import { createClient } from './supabase'
import type { 
  Poll, 
  PollInsert, 
  PollOption, 
  PollOptionInsert, 
  Vote, 
  VoteInsert,
  PollWithOptions,
  CreatePollData,
  VoteData,
  ApiResponse,
  PaginatedResponse
} from '@/app/types'

/**
 * DatabaseService class providing centralized database operations
 * 
 * This class encapsulates all Supabase database interactions for the polling app.
 * It provides methods for CRUD operations on polls, options, and votes with
 * proper error handling and data transformation.
 */
export class DatabaseService {
  /**
   * Create a new poll with associated options
   * 
   * This method handles the complete poll creation process:
   * 1. Inserts the main poll record
   * 2. Creates all poll options in a separate transaction
   * 3. Returns the created poll data
   * 
   * @param data - Poll creation data including title, description, options, and settings
   * @param userId - ID of the user creating the poll
   * @returns Promise resolving to ApiResponse with created poll or error
   */
  static async createPoll(data: CreatePollData, userId: string): Promise<ApiResponse<Poll>> {
    try {
      const supabase = createClient()
      
      // Step 1: Insert the main poll record
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: data.title,
          description: data.description,
          created_by: userId,
          expires_at: data.expires_at,
          allow_multiple_votes: data.allow_multiple_votes,
          is_public: data.is_public
        })
        .select()
        .single()

      if (pollError) throw pollError

      // Step 2: Create poll options in a separate transaction
      const optionsToInsert: PollOptionInsert[] = data.options.map(text => ({
        poll_id: poll.id,
        text
      }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)

      if (optionsError) throw optionsError

      return { data: poll }
    } catch (error) {
      console.error('Error creating poll:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to create poll' 
        } 
      }
    }
  }

  /**
   * Get a poll with its options and vote counts
   * 
   * Uses Supabase's relational queries to efficiently fetch all poll data
   * including options and their current vote counts in a single request.
   * 
   * @param pollId - Unique identifier of the poll to fetch
   * @returns Promise resolving to ApiResponse with poll data including options and vote counts
   */
  static async getPoll(pollId: string): Promise<ApiResponse<PollWithOptions>> {
    try {
      const supabase = createClient()
      
      // Use Supabase's relational query to get poll with options and vote counts
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            *,
            votes (count)
          )
        `)
        .eq('id', pollId)
        .single()

      if (pollError) throw pollError

      // Transform the nested data structure to match our PollWithOptions interface
      const pollWithOptions: PollWithOptions = {
        ...poll,
        options: poll.poll_options.map((option: any) => ({
          ...option,
          vote_count: option.votes?.[0]?.count || 0
        }))
      }

      return { data: pollWithOptions }
    } catch (error) {
      console.error('Error fetching poll:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch poll' 
        } 
      }
    }
  }

  /**
   * Get polls with pagination and filtering
   * 
   * Retrieves a paginated list of polls with optional user filtering.
   * For authenticated users, shows both their own polls and public polls.
   * For anonymous users, shows only public polls.
   * 
   * @param userId - Optional user ID to filter polls (shows user's polls + public polls)
   * @param page - Page number for pagination (1-based)
   * @param limit - Number of polls per page
   * @returns Promise resolving to ApiResponse with paginated poll data
   */
  static async getPolls(
    userId?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    try {
      const supabase = createClient()
      const offset = (page - 1) * limit

      // Build base query with count for pagination
      let query = supabase
        .from('polls')
        .select('*', { count: 'exact' })

      // Apply filtering based on user authentication
      if (userId) {
        // Authenticated users see their own polls + public polls
        query = query.or(`created_by.eq.${userId},is_public.eq.true`)
      } else {
        // Anonymous users see only public polls
        query = query.eq('is_public', true)
      }

      // Execute query with pagination and ordering
      const { data: polls, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      // Calculate total pages for pagination UI
      const totalPages = Math.ceil((count || 0) / limit)

      return {
        data: {
          data: polls || [],
          count: count || 0,
          page,
          limit,
          totalPages
        }
      }
    } catch (error) {
      console.error('Error fetching polls:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch polls' 
        } 
      }
    }
  }

  static async updatePoll(
    pollId: string, 
    data: Partial<PollInsert>, 
    userId: string
  ): Promise<ApiResponse<Poll>> {
    try {
      const supabase = createClient()
      
      // Verify ownership
      const { data: existingPoll, error: checkError } = await supabase
        .from('polls')
        .select('created_by')
        .eq('id', pollId)
        .single()

      if (checkError) throw checkError
      if (existingPoll.created_by !== userId) {
        throw new Error('Unauthorized to update this poll')
      }

      const { data: poll, error } = await supabase
        .from('polls')
        .update(data)
        .eq('id', pollId)
        .select()
        .single()

      if (error) throw error

      return { data: poll }
    } catch (error) {
      console.error('Error updating poll:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to update poll' 
        } 
      }
    }
  }

  static async deletePoll(pollId: string, userId: string): Promise<ApiResponse<void>> {
    try {
      const supabase = createClient()
      
      // Verify ownership
      const { data: existingPoll, error: checkError } = await supabase
        .from('polls')
        .select('created_by')
        .eq('id', pollId)
        .single()

      if (checkError) throw checkError
      if (existingPoll.created_by !== userId) {
        throw new Error('Unauthorized to delete this poll')
      }

      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId)

      if (error) throw error

      return {}
    } catch (error) {
      console.error('Error deleting poll:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to delete poll' 
        } 
      }
    }
  }

  // Vote operations
  static async submitVote(data: VoteData): Promise<ApiResponse<Vote>> {
    try {
      const supabase = createClient()
      
      const voteData: VoteInsert = {
        poll_id: data.poll_id,
        option_id: data.option_id,
        user_id: data.user_id || null,
        voter_email: data.voter_email || null,
        voter_name: data.voter_name || null
      }

      const { data: vote, error } = await supabase
        .from('votes')
        .insert(voteData)
        .select()
        .single()

      if (error) throw error

      return { data: vote }
    } catch (error) {
      console.error('Error submitting vote:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to submit vote' 
        } 
      }
    }
  }

  static async getPollVotes(pollId: string): Promise<ApiResponse<Vote[]>> {
    try {
      const supabase = createClient()
      
      const { data: votes, error } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', pollId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: votes || [] }
    } catch (error) {
      console.error('Error fetching votes:', error)
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Failed to fetch votes' 
        } 
      }
    }
  }


}

/**
 * Transform raw poll data from database to PollWithOptions format
 * 
 * Converts the nested structure returned by Supabase queries into
 * a flattened format that's easier to work with in components.
 * 
 * @param poll - Raw poll data from database with nested options and votes
 * @returns Transformed poll data with flattened options and vote counts
 */
export const transformPollData = (poll: any): PollWithOptions => {
  return {
    ...poll,
    options: poll.poll_options?.map((option: any) => ({
      ...option,
      vote_count: option.votes?.[0]?.count || 0
    })) || []
  }
}

/**
 * Validate poll creation data
 * 
 * Performs comprehensive validation on poll data before creation:
 * - Checks required fields (title, options)
 * - Validates option count and content
 * - Validates expiration date if provided
 * 
 * @param data - Poll creation data to validate
 * @returns Object with validation result and error messages
 */
export const validatePollData = (data: CreatePollData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate required title
  if (!data.title?.trim()) {
    errors.push('Poll title is required')
  }

  // Validate minimum option count
  if (!data.options || data.options.length < 2) {
    errors.push('At least 2 options are required')
  }

  // Validate option content
  if (data.options?.some(option => !option.trim())) {
    errors.push('All options must have text')
  }

  // Validate expiration date if provided
  if (data.expires_at && new Date(data.expires_at) <= new Date()) {
    errors.push('Expiration date must be in the future')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate vote submission data
 * 
 * Ensures vote data is complete and properly formatted before submission:
 * - Validates required IDs (poll_id, option_id)
 * - Ensures voter identification (user_id or voter_email)
 * - Validates email format if provided
 * 
 * @param data - Vote data to validate
 * @returns Object with validation result and error messages
 */
export const validateVoteData = (data: VoteData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate required poll ID
  if (!data.poll_id) {
    errors.push('Poll ID is required')
  }

  // Validate required option ID
  if (!data.option_id) {
    errors.push('Option ID is required')
  }

  // Ensure voter identification (either user_id or voter_email)
  if (!data.user_id && !data.voter_email) {
    errors.push('Either user ID or voter email is required')
  }

  // Validate email format if provided
  if (data.voter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.voter_email)) {
    errors.push('Invalid email format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
