import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { VoteData } from '@/app/types'
import { revalidatePath } from 'next/cache'

// Submit a vote
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const pollId = params.id
  const { data: { user } } = await supabase.auth.getUser()

  try {
    const data: Omit<VoteData, 'poll_id'> = await request.json()

    const voteData = {
      poll_id: pollId,
      option_id: data.option_id,
      user_id: user?.id || null,
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
    revalidatePath(`/polls/${pollId}`)

    return NextResponse.json({ data: vote })
  } catch (error) {
    console.error('Error submitting vote:', error)
    const message = error instanceof Error ? error.message : 'Failed to submit vote'
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
