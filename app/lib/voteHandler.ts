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
  // Clear previous states
  setError("")
  setSuccess(false)

  // Validation helpers
  const validateSelection = (): boolean => {
    if (selectedOptions.length === 0) {
      setError("Please select at least one option")
      return false
    }
    return true
  }

  const validateAnonymousVoting = (): boolean => {
    if (!user && (!voterEmail || !voterName)) {
      setError("Please provide your name and email for anonymous voting")
      return false
    }
    return true
  }

  // Early validation returns
  if (!validateSelection() || !validateAnonymousVoting()) {
    return
  }

  setIsSubmitting(true)

  try {
    // Create vote data for all options at once
    const voteDataArray: VoteData[] = selectedOptions.map(optionId => ({
      poll_id: pollId,
      option_id: optionId,
      user_id: user?.id || undefined,
      voter_email: user ? undefined : voterEmail,
      voter_name: user ? undefined : voterName
    }))

    // Submit all votes in parallel for better performance
    const votePromises = voteDataArray.map(voteData => 
      DatabaseService.submitVote(voteData)
    )

    const results = await Promise.all(votePromises)

    // Check for any errors in the results
    const errorResult = results.find(result => result.error)
    if (errorResult?.error) {
      throw new Error(errorResult.error.message)
    }

    setSuccess(true)
    
    // Use requestAnimationFrame for better UX timing
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
 * @param poll - Poll object with expiration and active status
 * @returns Object with isActive and isExpired boolean flags
 */
export const validatePollStatus = (poll: {
  expires_at?: string | null
  is_active: boolean
}): { isActive: boolean; isExpired: boolean } => {
  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
  const isActive = poll.is_active && !isExpired
  
  return { isActive, isExpired }
}

/**
 * Calculate total votes and percentages for poll options
 * @param options - Array of poll options with vote counts and other properties
 * @returns Object with total votes and options with calculated percentages
 */
export const calculateVoteStats = <T extends { id: string; vote_count: number }>(options: T[]) => {
  const totalVotes = options.reduce((sum, option) => sum + option.vote_count, 0)
  
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
 * @param selectedOptions - Array of selected option IDs
 * @param existingVotes - Array of existing votes for the user
 * @returns Array of options that haven't been voted on yet
 */
export const filterUnvotedOptions = (
  selectedOptions: string[],
  existingVotes: Array<{ option_id: string }>
): string[] => {
  const votedOptionIds = new Set(existingVotes.map(vote => vote.option_id))
  return selectedOptions.filter(optionId => !votedOptionIds.has(optionId))
}
