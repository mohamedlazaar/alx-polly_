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

// Database operation utilities
export class DatabaseService {
  // Poll operations
  static async createPoll(data: CreatePollData, userId: string): Promise<ApiResponse<Poll>> {
    try {
      const supabase = createClient()
      
      // Insert poll
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

      // Insert poll options
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

  static async getPoll(pollId: string): Promise<ApiResponse<PollWithOptions>> {
    try {
      const supabase = createClient()
      
      // Get poll with options and vote counts
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

      // Transform the data to match PollWithOptions interface
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

  static async getPolls(
    userId?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    try {
      const supabase = createClient()
      const offset = (page - 1) * limit

      let query = supabase
        .from('polls')
        .select('*', { count: 'exact' })

      // Filter by user if provided, otherwise show public polls
      if (userId) {
        query = query.or(`created_by.eq.${userId},is_public.eq.true`)
      } else {
        query = query.eq('is_public', true)
      }

      const { data: polls, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

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

// Utility functions for data transformation
export const transformPollData = (poll: any): PollWithOptions => {
  return {
    ...poll,
    options: poll.poll_options?.map((option: any) => ({
      ...option,
      vote_count: option.votes?.[0]?.count || 0
    })) || []
  }
}

export const validatePollData = (data: CreatePollData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Poll title is required')
  }

  if (!data.options || data.options.length < 2) {
    errors.push('At least 2 options are required')
  }

  if (data.options?.some(option => !option.trim())) {
    errors.push('All options must have text')
  }

  if (data.expires_at && new Date(data.expires_at) <= new Date()) {
    errors.push('Expiration date must be in the future')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateVoteData = (data: VoteData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.poll_id) {
    errors.push('Poll ID is required')
  }

  if (!data.option_id) {
    errors.push('Option ID is required')
  }

  // Either user_id or voter_email must be provided
  if (!data.user_id && !data.voter_email) {
    errors.push('Either user ID or voter email is required')
  }

  if (data.voter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.voter_email)) {
    errors.push('Invalid email format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
