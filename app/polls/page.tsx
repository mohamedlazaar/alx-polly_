import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"

export default function PollsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
          <p className="text-gray-600 mt-2">Discover and participate in polls created by the community</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search polls..."
              className="w-full"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Poll Cards */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Favorite Programming Language</CardTitle>
            <CardDescription>
              What's your preferred programming language for web development?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 156</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: John Doe</span>
                <span>2 days ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/1">
                <Button className="w-full">Vote Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Best Pizza Topping</CardTitle>
            <CardDescription>
              Vote for your favorite pizza topping!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 89</span>
                <span className="text-gray-600">Closed</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: Jane Smith</span>
                <span>1 week ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/2">
                <Button variant="outline" className="w-full">View Results</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Preferred Work Environment</CardTitle>
            <CardDescription>
              Where do you prefer to work from?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 234</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: Mike Johnson</span>
                <span>3 days ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/3">
                <Button className="w-full">Vote Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Favorite Movie Genre</CardTitle>
            <CardDescription>
              What's your go-to movie genre for entertainment?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 67</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: Sarah Wilson</span>
                <span>5 days ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/4">
                <Button className="w-full">Vote Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Best Coffee Type</CardTitle>
            <CardDescription>
              Which coffee type do you prefer for your daily caffeine fix?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 123</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: Alex Brown</span>
                <span>1 day ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/5">
                <Button className="w-full">Vote Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Preferred Music Genre</CardTitle>
            <CardDescription>
              What music genre do you listen to most often?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes: 178</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: Lisa Davis</span>
                <span>4 days ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/polls/6">
                <Button className="w-full">Vote Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Polls
        </Button>
      </div>
    </div>
  )
}
