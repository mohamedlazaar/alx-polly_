import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"

export default function CreatePollPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
        <p className="text-gray-600 mt-2">Create a new poll and share it with the community</p>
      </div>

      {/* Create Poll Form */}
      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Fill in the details for your new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Poll Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Poll Title *
              </label>
              <Input
                id="title"
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Option 1"
                    required
                  />
                  <Button type="button" variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Option 2"
                    required
                  />
                  <Button type="button" variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Option 3"
                    required
                  />
                  <Button type="button" variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Option 4"
                    required
                  />
                  <Button type="button" variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm">
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
                    defaultChecked
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
              />
              <p className="text-xs text-gray-500">
                Leave empty to keep the poll active indefinitely
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Link href="/polls">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1">
                Create Poll
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Creating Great Polls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Keep your question clear and concise</li>
            <li>• Provide enough options to cover different perspectives</li>
            <li>• Use descriptive option text</li>
            <li>• Consider setting an expiration date for time-sensitive topics</li>
            <li>• Make sure your poll is relevant to your audience</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

