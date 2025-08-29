import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import Link from "next/link"

interface PollPageProps {
  params: {
    id: string
  }
}

export default function PollPage({ params }: PollPageProps) {
  // Mock poll data - in a real app, this would come from an API
  const poll = {
    id: params.id,
    title: "Favorite Programming Language",
    description: "What's your preferred programming language for web development? Share your thoughts and see what the community thinks!",
    options: [
      { id: "1", text: "JavaScript/TypeScript", votes: 45, percentage: 45 },
      { id: "2", text: "Python", votes: 30, percentage: 30 },
      { id: "3", text: "Java", votes: 15, percentage: 15 },
      { id: "4", text: "C#", votes: 10, percentage: 10 },
    ],
    totalVotes: 100,
    createdBy: "John Doe",
    createdAt: "2024-01-15",
    isActive: true,
    allowMultipleVotes: false,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{poll.title}</h1>
          <p className="text-gray-600 mt-2">{poll.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>Created by {poll.createdBy}</span>
            <span>•</span>
            <span>{poll.createdAt}</span>
            <span>•</span>
            <span>{poll.totalVotes} votes</span>
          </div>
        </div>
        <Link href="/polls">
          <Button variant="outline">Back to Polls</Button>
        </Link>
      </div>

      {/* Poll Options */}
      <Card>
        <CardHeader>
          <CardTitle>Vote</CardTitle>
          <CardDescription>
            Select your preferred option{poll.allowMultipleVotes ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type={poll.allowMultipleVotes ? "checkbox" : "radio"}
                    name="vote"
                    value={option.id}
                    id={option.id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-sm text-gray-500">
                        {option.votes} votes ({option.percentage}%)
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Submit Vote
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Poll Results (if user has already voted) */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Current voting results for this poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-gray-500">
                    {option.votes} votes ({option.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Total votes: {poll.totalVotes}</span>
              <span>Status: {poll.isActive ? "Active" : "Closed"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Poll */}
      <Card>
        <CardHeader>
          <CardTitle>Share This Poll</CardTitle>
          <CardDescription>
            Share this poll with others to get more votes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={`https://yourapp.com/polls/${poll.id}`}
              readOnly
              className="flex-1"
            />
            <Button variant="outline">
              Copy Link
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              Share on Twitter
            </Button>
            <Button variant="outline" size="sm">
              Share on Facebook
            </Button>
            <Button variant="outline" size="sm">
              Share on LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Related Polls */}
      <Card>
        <CardHeader>
          <CardTitle>Related Polls</CardTitle>
          <CardDescription>
            Other polls you might be interested in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/polls/2" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">Best Pizza Topping</h3>
              <p className="text-sm text-gray-500">89 votes • 1 week ago</p>
            </Link>
            <Link href="/polls/3" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">Preferred Work Environment</h3>
              <p className="text-sm text-gray-500">234 votes • 3 days ago</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
