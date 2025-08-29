"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { useAuth } from "@/app/contexts/AuthContext"
import { DatabaseService } from "@/app/lib/database"
import type { Poll } from "@/app/types"

interface PollActionsProps {
  poll: Poll
}

export default function PollActions({ poll }: PollActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Only show actions if user is the creator
  if (!user || user.id !== poll.created_by) {
    return null
  }

  const handleEdit = () => {
    router.push(`/polls/${poll.id}/edit`)
  }

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsDeleting(true)
    try {
      const result = await DatabaseService.deletePoll(poll.id, user.id)
      if (result.error) {
        alert(`Error deleting poll: ${result.error.message}`)
      } else {
        // Refresh the page to update the list
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting poll:', error)
      alert('An unexpected error occurred while deleting the poll.')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className="border-blue-300 text-blue-600 hover:bg-blue-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </Button>
      
      {showConfirm ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelDelete}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      )}
    </div>
  )
}
