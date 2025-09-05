"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { DatabaseService } from "@/app/lib/database"
import { validatePollData } from "@/app/lib/database"
import type { CreatePollData } from "@/app/types"

/**
 * Interface for poll options in the form state
 * Used for managing dynamic option creation and editing
 */
interface PollOption {
  id: string
  text: string
}

/**
 * CreatePollForm Component
 * 
 * A comprehensive form for creating new polls with the following features:
 * - Dynamic option management (add/remove options)
 * - Poll settings configuration (multiple votes, public/private)
 * - Expiration date setting
 * - Real-time validation
 * - Success/error state handling
 * 
 * @returns JSX element containing the poll creation form
 */
export default function CreatePollForm() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Form state management
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
    { id: "4", text: "" },
  ])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [expiresAt, setExpiresAt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  /**
   * Add a new poll option to the form
   * Generates a unique ID based on current option count
   */
  const addOption = () => {
    const newId = (options.length + 1).toString()
    setOptions([...options, { id: newId, text: "" }])
  }

  /**
   * Remove a poll option from the form
   * Prevents removal if only 2 options remain (minimum required)
   * @param id - ID of the option to remove
   */
  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id))
    }
  }

  /**
   * Update the text content of a specific poll option
   * @param id - ID of the option to update
   * @param text - New text content for the option
   */
  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ))
  }

  /**
   * Handle form submission for poll creation
   * Performs validation, data transformation, and submission
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    // Ensure user is authenticated
    if (!user) {
      setError("You must be logged in to create a poll")
      return
    }

    // Filter out empty options to prevent submission of incomplete data
    const validOptions = options.filter(option => option.text.trim())
    
    // Transform form data to match API expectations
    const pollData: CreatePollData = {
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions.map(option => option.text.trim()),
      allow_multiple_votes: allowMultipleVotes,
      is_public: isPublic,
      expires_at: expiresAt || undefined
    }

    // Validate poll data before submission
    const validation = validatePollData(pollData)
    if (!validation.isValid) {
      setError(validation.errors.join(", "))
      return
    }

    setIsSubmitting(true)
    
    try {
      // Submit poll to database
      const result = await DatabaseService.createPoll(pollData, user.id)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        setSuccess(true)
        // Redirect to the new poll after showing success message
        setTimeout(() => {
          router.push(`/polls/${result.data?.id}`)
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Error creating poll:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message
  if (success) {
    return (
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Poll Created Successfully!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your poll has been created and is now live. Redirecting you to the poll page...
          </p>
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Create Your Poll</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Share your question with the community and gather insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Poll Title */}
          <div className="space-y-3">
            <label htmlFor="title" className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Poll Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your burning question?"
              className="h-14 px-4 text-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Poll Description */}
          <div className="space-y-3">
            <label htmlFor="description" className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context about your poll to help people understand what you're asking..."
              className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Poll Options */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Poll Options *
            </label>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-3">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="h-12 px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    disabled={isSubmitting}
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeOption(option.id)}
                      className="h-12 px-4 border-red-300 text-red-600 hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addOption}
              className="h-12 px-6 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Option
            </Button>
          </div>

          {/* Poll Settings */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Poll Settings
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-lg font-medium text-gray-900">Allow Multiple Votes</p>
                  <p className="text-gray-600">Users can select multiple options</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowMultipleVotes}
                  onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                  className="h-6 w-6 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-lg font-medium text-gray-900">Public Poll</p>
                  <p className="text-gray-600">Anyone can view and vote on this poll</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-6 w-6 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-3">
            <label htmlFor="expiresAt" className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Expiration Date (Optional)
            </label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="h-12 px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              Leave empty to keep the poll active indefinitely
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-14 text-lg border-gray-300 hover:bg-gray-50"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-14 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Poll...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Poll
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

