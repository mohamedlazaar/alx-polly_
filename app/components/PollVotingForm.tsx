"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { handleSubmitVote as submitVote, validatePollStatus, calculateVoteStats } from "@/app/lib/voteHandler"
import type { PollWithOptions } from "@/app/types"

interface PollVotingFormProps {
  poll: PollWithOptions
}

export default function PollVotingForm({ poll }: PollVotingFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  // State management for voting form
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [voterEmail, setVoterEmail] = useState("")
  const [voterName, setVoterName] = useState("")

  // Determine poll status and calculate vote statistics
  const { isActive, isExpired } = validatePollStatus(poll)
  const { totalVotes, optionsWithPercentages } = calculateVoteStats(poll.options)

  /**
   * Handle option selection based on poll settings
   * Supports both single and multiple vote scenarios
   */
  const handleOptionSelect = (optionId: string) => {
    // Don't allow selection if poll is not active
    if (!isActive) return

    if (poll.allow_multiple_votes) {
      // Multiple votes allowed: toggle selection
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)  // Remove if already selected
          : [...prev, optionId]                 // Add if not selected
      )
    } else {
      // Single vote only: replace selection
      setSelectedOptions([optionId])
    }
  }

  /**
   * Handle vote submission using the optimized vote handler
   * Delegates to the centralized vote submission logic
   */
  const handleSubmitVote = async () => {
    await submitVote(
      selectedOptions,
      poll.id,
      user,
      voterEmail,
      voterName,
      setError,
      setSuccess,
      setIsSubmitting,
      router
    )
  }

  // Show success message
  if (success) {
    return (
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Submitted!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for voting. The results are being updated...
          </p>
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {isActive ? "Cast Your Vote" : "Poll Results"}
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          {isActive 
            ? `Select ${poll.allow_multiple_votes ? 'one or more' : 'one'} option${poll.allow_multiple_votes ? 's' : ''}`
            : "This poll is no longer accepting votes"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Anonymous Voting Form */}
        {!user && isActive && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <h3 className="font-semibold text-blue-900">Anonymous Voting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your email"
                value={voterEmail}
                onChange={(e) => setVoterEmail(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Poll Options */}
        <div className="space-y-4">
          {optionsWithPercentages.map((option, index) => {
            const percentage = option.percentage
            const isSelected = selectedOptions.includes(option.id)
            
            // Define gradient colors for visual variety in progress bars
            const gradientColors = [
              'from-purple-500 to-pink-500',
              'from-blue-500 to-cyan-500',
              'from-indigo-500 to-purple-500',
              'from-orange-500 to-red-500',
              'from-yellow-500 to-orange-500',
              'from-pink-500 to-rose-500'
            ]

            return (
              <div 
                key={option.id} 
                className={`group cursor-pointer ${!isActive ? 'cursor-default' : ''}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className={`relative p-6 border-2 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50/50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                } ${!isActive ? 'opacity-75' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Selection indicator - only show for active polls */}
                      {isActive && (
                        <div className={`w-6 h-6 border-2 rounded-full transition-colors ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-500' 
                            : 'border-gray-300 group-hover:border-purple-500'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{option.text}</h3>
                        <p className="text-gray-600">Option {index + 1}</p>
                      </div>
                    </div>
                    {/* Vote statistics display */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                      <div className="text-sm text-gray-500">{option.vote_count} votes</div>
                    </div>
                  </div>
                  {/* Progress bar with dynamic gradient */}
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${gradientColors[index % gradientColors.length]} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Vote Button */}
        {isActive && (
          <div className="pt-6">
            <Button 
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              onClick={handleSubmitVote}
              disabled={isSubmitting || selectedOptions.length === 0}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Vote...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Vote
                </>
              )}
            </Button>
          </div>
        )}

        {/* Poll Closed Message */}
        {!isActive && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Poll Closed</h3>
            <p className="text-gray-600">This poll is no longer accepting votes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
