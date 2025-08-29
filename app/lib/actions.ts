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

// Create a new poll
export async function createPoll(data: CreatePollData, userId: string): Promise<ApiResponse<Poll>> {
  try {
    const supabase = createServerSupabaseClient()
    
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
    const optionsToInsert = data.options.map(text => ({
      poll_id: poll.id,
      text
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)

    if (optionsError) throw optionsError

    // Revalidate the polls list page
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

// Get a poll with options and vote counts
export async function getPoll(pollId: string): Promise<ApiResponse<PollWithOptions>> {
  try {
    const supabase = createServerSupabaseClient()
    
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

// Get polls with pagination
export async function getPolls(
  userId?: string, 
  page: number = 1, 
  limit: number = 10
): Promise<ApiResponse<{ data: Poll[], count: number, page: number, limit: number, totalPages: number }>> {
  try {
    const supabase = createServerSupabaseClient()
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

// Submit a vote
export async function submitVote(data: VoteData): Promise<ApiResponse<any>> {
  try {
    const supabase = createServerSupabaseClient()
    
    const voteData = {
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

    // Revalidate the poll page
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

// Update a poll
export async function updatePoll(
  pollId: string, 
  data: Partial<CreatePollData>, 
  userId: string
): Promise<ApiResponse<Poll>> {
  try {
    const supabase = createServerSupabaseClient()
    
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

    // Revalidate the poll page and polls list
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

// Delete a poll
export async function deletePoll(pollId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const supabase = createServerSupabaseClient()
    
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

    // Revalidate the polls list and dashboard
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
