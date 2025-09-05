// voteHandler.ts
// Optimized vote handling functions for the PollMaster app

import { DatabaseService } from './database'
import type { VoteData } from '@/app/types'

/**
 * Optimized vote submission handler that processes multiple votes in parallel
 * @param selectedOptions - Array of selected option IDs
 * @param pollId - The poll ID to vote on
 * @param user - User object (can be null for anonymous voting)
 * @param voterEmail - Email for anonymous voting
 * @param voterName - Name for anonymous voting
 * @param setError - Function to set error messages
 * @param setSuccess - Function to set success state
 * @param setIsSubmitting - Function to set loading state
 * @param router - Router object for page refresh
 * @returns Promise<void>
 */
export const handleSubmitVote = async (
  selectedOptions: string[],
  pollId: string,
  user: { id: string } | null,
  voterEmail: string,
  voterName: string,
  setError: (error: string) => void,
  setSuccess: (success: boolean) => void,
  setIsSubmitting: (loading: boolean) => void,
  router: { refresh: () => void }
): Promise<void> => {
  // Clear previous states to ensure clean UI
  setError("")
  setSuccess(false)

  /**
   * Validation helper functions
   * These ensure data integrity before attempting to submit votes
   */
  const validateSelection = (): boolean => {
    if (selectedOptions.length === 0) {
      setError("Please select at least one option")
      return false
    }
    return true
  }

  const validateAnonymousVoting = (): boolean => {
    // For anonymous voting, we need both name and email for identification
    if (!user && (!voterEmail || !voterName)) {
      setError("Please provide your name and email for anonymous voting")
      return false
    }
    return true
  }

  // Perform all validations before proceeding
  if (!validateSelection() || !validateAnonymousVoting()) {
    return
  }

  setIsSubmitting(true)

  try {
    /**
     * Create vote data array for all selected options
     * This allows us to submit multiple votes in parallel for better performance
     */
    const voteDataArray: VoteData[] = selectedOptions.map(optionId => ({
      poll_id: pollId,
      option_id: optionId,
      // Use user ID for authenticated users, undefined for anonymous
      user_id: user?.id || undefined,
      // Use voter info for anonymous users, undefined for authenticated
      voter_email: user ? undefined : voterEmail,
      voter_name: user ? undefined : voterName
    }))

    /**
     * Submit all votes in parallel using Promise.all
     * This is more efficient than sequential voting and provides better UX
     */
    const votePromises = voteDataArray.map(voteData => 
      DatabaseService.submitVote(voteData)
    )

    const results = await Promise.all(votePromises)

    // Check if any vote submission failed
    const errorResult = results.find(result => result.error)
    if (errorResult?.error) {
      throw new Error(errorResult.error.message)
    }

    setSuccess(true)
    
    /**
     * Use requestAnimationFrame for optimal timing
     * This ensures the success animation plays before page refresh
     */
    requestAnimationFrame(() => {
      setTimeout(() => {
        router.refresh()
      }, 1500)
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to submit vote"
    setError(errorMessage)
  } finally {
    setIsSubmitting(false)
  }
}

/**
 * Validate if a poll is active and can accept votes
 * 
 * Checks both the poll's active status and expiration date to determine
 * if the poll is currently accepting votes.
 * 
 * @param poll - Poll object with expiration and active status
 * @returns Object with isActive and isExpired boolean flags
 */
export const validatePollStatus = (poll: {
  expires_at?: string | null
  is_active: boolean
}): { isActive: boolean; isExpired: boolean } => {
  // Check if poll has expired based on expiration date
  const isExpired = Boolean(poll.expires_at && new Date(poll.expires_at) < new Date())
  // Poll is active if it's marked as active AND not expired
  const isActive = poll.is_active && !isExpired
  
  return { isActive, isExpired }
}

/**
 * Calculate total votes and percentages for poll options
 * 
 * Processes poll options to calculate vote statistics including:
 * - Total vote count across all options
 * - Percentage distribution for each option
 * 
 * @param options - Array of poll options with vote counts and other properties
 * @returns Object with total votes and options with calculated percentages
 */
export const calculateVoteStats = <T extends { id: string; vote_count: number }>(options: T[]) => {
  // Sum up all votes across all options
  const totalVotes = options.reduce((sum, option) => sum + option.vote_count, 0)
  
  // Calculate percentage for each option, handling division by zero
  const optionsWithPercentages = options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0
  }))
  
  return {
    totalVotes,
    optionsWithPercentages
  }
}

/**
 * Check if user has already voted on specific options
 * 
 * Filters out options that the user has already voted on to prevent
 * duplicate voting when multiple votes are allowed.
 * 
 * @param selectedOptions - Array of selected option IDs
 * @param existingVotes - Array of existing votes for the user
 * @returns Array of options that haven't been voted on yet
 */
export const filterUnvotedOptions = (
  selectedOptions: string[],
  existingVotes: Array<{ option_id: string }>
): string[] => {
  // Create a Set of already voted option IDs for efficient lookup
  const votedOptionIds = new Set(existingVotes.map(vote => vote.option_id))
  // Return only options that haven't been voted on yet
  return selectedOptions.filter(optionId => !votedOptionIds.has(optionId))
}
