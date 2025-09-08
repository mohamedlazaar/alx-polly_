import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { CreatePollData, PollWithOptions } from '@/app/types'
import { revalidatePath } from 'next/cache'

// Get a poll with options and vote counts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const pollId = params.id

  try {
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

    return NextResponse.json({ data: pollWithOptions })
  } catch (error) {
    console.error('Error fetching poll:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch poll'
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}

// Update a poll
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const pollId = params.id
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data: Partial<CreatePollData> = await request.json()

    // Verify ownership
    const { data: existingPoll, error: checkError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (checkError) throw checkError
    if (existingPoll.created_by !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this poll' }, { status: 403 })
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

    return NextResponse.json({ data: poll })
  } catch (error) {
    console.error('Error updating poll:', error)
    const message = error instanceof Error ? error.message : 'Failed to update poll'
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}

// Delete a poll
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const pollId = params.id
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify ownership
    const { data: existingPoll, error: checkError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (checkError) throw checkError
    if (existingPoll.created_by !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this poll' }, { status: 403 })
    }

    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (error) throw error

    // Revalidate the polls list and dashboard
    revalidatePath('/polls')
    revalidatePath('/dashboard')

    return NextResponse.json({ message: 'Poll deleted successfully' })
  } catch (error) {
    console.error('Error deleting poll:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete poll'
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
