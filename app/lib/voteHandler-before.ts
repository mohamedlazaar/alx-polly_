// voteHandler-before.ts
// Original version of handleSubmitVote function from PollVotingForm.tsx
// This is the BEFORE snapshot for comparison with the optimized version

import { DatabaseService } from "@/app/lib/database"

export const handleSubmitVoteOriginal = async (
  selectedOptions: string[],
  poll: { id: string },
  user: { id: string } | null,
  voterEmail: string,
  voterName: string,
  isActive: boolean,
  setError: (error: string) => void,
  setSuccess: (success: boolean) => void,
  setIsSubmitting: (loading: boolean) => void,
  router: { refresh: () => void }
) => {
  if (!isActive) return

  setError("")
  setSuccess(false)

  // Validate selection
  if (selectedOptions.length === 0) {
    setError("Please select at least one option")
    return
  }

  // Validate anonymous voting
  if (!user && (!voterEmail || !voterName)) {
    setError("Please provide your name and email for anonymous voting")
    return
  }

  setIsSubmitting(true)

  try {
    // Submit votes for each selected option
    for (const optionId of selectedOptions) {
      const voteData = {
        poll_id: poll.id,
        option_id: optionId,
        user_id: user?.id || undefined,
        voter_email: user ? undefined : voterEmail,
        voter_name: user ? undefined : voterName
      }

      const result = await DatabaseService.submitVote(voteData)
      if (result.error) {
        throw new Error(result.error.message)
      }
    }

    setSuccess(true)
    // Refresh the page to show updated results
    setTimeout(() => {
      router.refresh()
    }, 1500)
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to submit vote")
  } finally {
    setIsSubmitting(false)
  }
}
