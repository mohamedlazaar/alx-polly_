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
    <div className="flex items-center gap-3">
      {/* Edit Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className="group border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 px-4 py-2 h-9"
      >
        <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </Button>
      
      {/* Delete Button or Confirmation */}
      {showConfirm ? (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center text-red-700 text-sm font-medium">
            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Are you sure?
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelDelete}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 px-3 py-1 h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1 h-7 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="group border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 px-4 py-2 h-9"
        >
          <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </Button>
      )}
    </div>
  )
}
