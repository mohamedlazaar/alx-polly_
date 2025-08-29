import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import Link from "next/link"
import TestDatabase from "@/app/components/TestDatabase"
import { DatabaseService } from "@/app/lib/database"
import { createServerSupabaseClient } from "@/app/lib/supabase-server"
import { getTimeAgo } from "@/app/lib/utils"
import PollActions from "@/app/components/PollActions"

export default async function DashboardPage() {
  // Get current user
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user's polls and public polls
  const pollsResult = await DatabaseService.getPolls(user?.id, 1, 10)
  const userPolls = pollsResult.data?.data || []
  
  // Calculate stats
  const totalPolls = userPolls.length
  const activePolls = userPolls.filter(poll => {
    const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
    return poll.is_active && !isExpired
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Test Component */}
        <div className="mb-8">
          <TestDatabase />
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's what's happening with your polls today. Create new polls, track engagement, and see how your community is voting.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Polls</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPolls}</p>
                  <p className="text-xs text-green-600">Your polls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Polls</p>
                  <p className="text-3xl font-bold text-gray-900">{activePolls}</p>
                  <p className="text-xs text-green-600">Currently running</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userPolls.reduce((sum, poll) => {
                      // This would need to be calculated from votes table
                      // For now, showing placeholder
                      return sum + 0
                    }, 0)}
                  </p>
                  <p className="text-xs text-green-600">Across all polls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Activity</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-green-600">New votes today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Get started quickly with these common actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/polls/create">
                <div className="group p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Poll</h3>
                  <p className="text-gray-600">Start a new poll and gather insights from your community</p>
                </div>
              </Link>

              <Link href="/polls">
                <div className="group p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Polls</h3>
                  <p className="text-gray-600">Discover and participate in polls created by the community</p>
                </div>
              </Link>

              <div className="group p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
                <p className="text-gray-600">Analyze your poll performance and engagement metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Polls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Recent Polls */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Recent Polls
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your latest poll creations and their performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userPolls.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
                  <p className="text-gray-600 mb-4">Create your first poll to get started!</p>
                  <Link href="/polls/create">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      Create Your First Poll
                    </Button>
                  </Link>
                </div>
              ) : (
                userPolls.slice(0, 3).map((poll) => {
                  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
                  const isActive = poll.is_active && !isExpired
                  const timeAgo = getTimeAgo(new Date(poll.created_at))
                  
                  return (
                    <div key={poll.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{poll.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      {poll.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{poll.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{timeAgo}</span>
                        <div className="flex items-center gap-2">
                          <Link href={`/polls/${poll.id}`}>
                            <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                              View
                            </Button>
                          </Link>
                          <PollActions poll={poll} />
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              
              {userPolls.length > 3 && (
                <div className="text-center pt-4">
                  <Link href="/polls">
                    <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                      View All Polls
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Latest votes and interactions on your polls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                <p className="text-gray-600">Votes and interactions will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance Insights
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Key metrics and trends for your polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
                <div className="text-sm font-medium text-gray-700">Average Engagement</div>
                <div className="text-xs text-green-600 mt-1">No data yet</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm font-medium text-gray-700">Total Views</div>
                <div className="text-xs text-green-600 mt-1">No data yet</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                <div className="text-sm font-medium text-gray-700">Completion Rate</div>
                <div className="text-xs text-green-600 mt-1">No data yet</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

