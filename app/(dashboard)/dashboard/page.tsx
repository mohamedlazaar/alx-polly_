import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your polls today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 expiring this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +180 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Polls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Polls</CardTitle>
          <CardDescription>
            Your most recent polls and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Favorite Programming Language</h3>
                <p className="text-sm text-gray-500">Created 2 days ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Best Pizza Topping</h3>
                <p className="text-sm text-gray-500">Created 1 week ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  Closed
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/polls">
              <Button variant="outline" className="w-full">
                View All Polls
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/polls/create">
              <Button className="w-full" size="lg">
                Create New Poll
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" className="w-full" size="lg">
                Browse All Polls
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

