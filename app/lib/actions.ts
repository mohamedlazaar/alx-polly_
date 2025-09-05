"use server"

import { createServerSupabaseClient } from './supabase-server'
import { revalidatePath } from 'next/cache'
import type { 
  CreatePollData, 
  VoteData, 
  ApiResponse, 
  Poll, 
  PollWithOptions 
} from '@/app/types'

/**
 * Server Action: Create a new poll with options
 * 
 * This function handles the complete poll creation process including:
 * - Inserting the poll record into the database
 * - Creating associated poll options
 * - Revalidating relevant cache paths
 * 
 * @param data - Poll creation data including title, description, options, and settings
 * @param userId - ID of the user creating the poll
 * @returns Promise resolving to ApiResponse containing the created poll or error
 */
export async function createPoll(data: CreatePollData, userId: string): Promise<ApiResponse<Poll>> {
  try {
    const supabase = createServerSupabaseClient()
    
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
    const optionsToInsert = data.options.map(text => ({
      poll_id: poll.id,
      text
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)

    if (optionsError) throw optionsError

    // Step 3: Revalidate Next.js cache for affected pages
    revalidatePath('/polls')
    revalidatePath('/dashboard')

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
 * Server Action: Get a poll with its options and vote counts
 * 
 * Fetches a complete poll including all options and their current vote counts.
 * Uses Supabase's relational queries to efficiently get all data in one request.
 * 
 * @param pollId - Unique identifier of the poll to fetch
 * @returns Promise resolving to ApiResponse containing poll with options and vote counts
 */
export async function getPoll(pollId: string): Promise<ApiResponse<PollWithOptions>> {
  try {
    const supabase = createServerSupabaseClient()
    
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
 * Server Action: Get polls with pagination and filtering
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
export async function getPolls(
  userId?: string, 
  page: number = 1, 
  limit: number = 10
): Promise<ApiResponse<{ data: Poll[], count: number, page: number, limit: number, totalPages: number }>> {
  try {
    const supabase = createServerSupabaseClient()
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

/**
 * Server Action: Submit a vote for a poll option
 * 
 * Handles vote submission for both authenticated and anonymous users.
 * Supports both single and multiple vote scenarios based on poll settings.
 * 
 * @param data - Vote data including poll ID, option ID, and voter information
 * @returns Promise resolving to ApiResponse with vote record or error
 */
export async function submitVote(data: VoteData): Promise<ApiResponse<any>> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Prepare vote data for database insertion
    const voteData = {
      poll_id: data.poll_id,
      option_id: data.option_id,
      user_id: data.user_id || null,
      voter_email: data.voter_email || null,
      voter_name: data.voter_name || null
    }

    // Insert vote record into database
    const { data: vote, error } = await supabase
      .from('votes')
      .insert(voteData)
      .select()
      .single()

    if (error) throw error

    // Revalidate the specific poll page to show updated results
    revalidatePath(`/polls/${data.poll_id}`)

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

/**
 * Server Action: Update an existing poll
 * 
 * Updates poll properties with ownership verification.
 * Only the poll creator can update their polls.
 * 
 * @param pollId - ID of the poll to update
 * @param data - Partial poll data containing fields to update
 * @param userId - ID of the user attempting to update (for authorization)
 * @returns Promise resolving to ApiResponse with updated poll or error
 */
export async function updatePoll(
  pollId: string, 
  data: Partial<CreatePollData>, 
  userId: string
): Promise<ApiResponse<Poll>> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Step 1: Verify user owns this poll before allowing updates
    const { data: existingPoll, error: checkError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (checkError) throw checkError
    if (existingPoll.created_by !== userId) {
      throw new Error('Unauthorized to update this poll')
    }

    // Step 2: Update poll with new data
    const { data: poll, error } = await supabase
      .from('polls')
      .update({
        title: data.title,
        description: data.description,
        expires_at: data.expires_at,
        allow_multiple_votes: data.allow_multiple_votes,
        is_public: data.is_public
      })
      .eq('id', pollId)
      .select()
      .single()

    if (error) throw error

    // Step 3: Revalidate cache for affected pages
    revalidatePath(`/polls/${pollId}`)
    revalidatePath('/polls')
    revalidatePath('/dashboard')

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

/**
 * Server Action: Delete a poll
 * 
 * Permanently deletes a poll and all associated data (options, votes).
 * Only the poll creator can delete their polls.
 * 
 * @param pollId - ID of the poll to delete
 * @param userId - ID of the user attempting to delete (for authorization)
 * @returns Promise resolving to ApiResponse indicating success or error
 */
export async function deletePoll(pollId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Step 1: Verify user owns this poll before allowing deletion
    const { data: existingPoll, error: checkError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (checkError) throw checkError
    if (existingPoll.created_by !== userId) {
      throw new Error('Unauthorized to delete this poll')
    }

    // Step 2: Delete poll (cascading deletes will handle options and votes)
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (error) throw error

    // Step 3: Revalidate cache for affected pages
    revalidatePath('/polls')
    revalidatePath('/dashboard')

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
