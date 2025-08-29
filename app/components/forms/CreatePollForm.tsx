"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CreatePollData } from "@/app/types"

interface CreatePollFormProps {
  onSubmit: (data: CreatePollData) => void
  isLoading?: boolean
}

export default function CreatePollForm({ onSubmit, isLoading = false }: CreatePollFormProps) {
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    description: "",
    options: ["", ""],
    allowMultipleVotes: false,
    isPublic: true,
  })

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""]
    })
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData({ ...formData, options: newOptions })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validOptions = formData.options.filter(option => option.trim() !== "")
    if (validOptions.length >= 2) {
      onSubmit({
        ...formData,
        options: validOptions
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Fill in the details for your new poll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your poll question..."
              required
            />
          </div>

          {/* Poll Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more context about your poll..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Poll Options */}
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Poll Options *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
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
            >
              + Add Option
            </Button>
          </div>

          {/* Poll Settings */}
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Poll Settings
            </label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Allow Multiple Votes</p>
                  <p className="text-xs text-gray-500">Users can select multiple options</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowMultipleVotes}
                  onChange={(e) => setFormData({ ...formData, allowMultipleVotes: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Public Poll</p>
                  <p className="text-xs text-gray-500">Anyone can view and vote on this poll</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label htmlFor="expiresAt" className="text-sm font-medium">
              Expiration Date (Optional)
            </label>
            <Input
              id="expiresAt"
              type="datetime-local"
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value ? new Date(e.target.value) : undefined })}
            />
            <p className="text-xs text-gray-500">
              Leave empty to keep the poll active indefinitely
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

