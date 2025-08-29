import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { DatabaseService } from "@/app/lib/database"
import { createServerSupabaseClient } from "@/app/lib/supabase-server"
import { getTimeAgo } from "@/app/lib/utils"
import PollActions from "@/app/components/PollActions"

interface PollsPageProps {
  searchParams: Promise<{ 
    page?: string
    search?: string
    filter?: string
  }>
}

export default async function PollsPage({ searchParams }: PollsPageProps) {
  // Get current user
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Parse search params - await the Promise first
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const filter = params.filter || 'all'
  
  // Fetch polls
  const pollsResult = await DatabaseService.getPolls(user?.id, page, 12)
  const polls = pollsResult.data?.data || []
  const totalPolls = pollsResult.data?.count || 0
  const totalPages = pollsResult.data?.totalPages || 1

  // Filter polls based on search and filter params
  let filteredPolls = polls
  
  if (search) {
    filteredPolls = polls.filter(poll => 
      poll.title.toLowerCase().includes(search.toLowerCase()) ||
      poll.description?.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (filter === 'active') {
    filteredPolls = filteredPolls.filter(poll => {
      const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
      return poll.is_active && !isExpired
    })
  } else if (filter === 'closed') {
    filteredPolls = filteredPolls.filter(poll => {
      const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
      return !poll.is_active || isExpired
    })
  } else if (filter === 'my-polls') {
    filteredPolls = filteredPolls.filter(poll => poll.created_by === user?.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Polls
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore polls created by the community and make your voice heard. 
            Vote on topics that matter to you and see real-time results.
          </p>
          <Link href="/polls/create">
            <Button className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Poll
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  name="search"
                  placeholder="Search polls by title, description, or creator..."
                  defaultValue={search}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50"
                />
              </div>
            </div>
            <select 
              name="filter"
              defaultValue={filter}
              className="h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white/50"
            >
              <option value="all">All Polls</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
              {user && <option value="my-polls">My Polls</option>}
            </select>
            <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter
            </Button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Polls</p>
                <p className="text-2xl font-bold text-gray-900">{totalPolls}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {polls.filter(poll => {
                    const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
                    return poll.is_active && !isExpired
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Votes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Polls Grid */}
        {filteredPolls.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600 mb-6">
              {search || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a poll!'
              }
            </p>
            {!search && filter === 'all' && (
              <Link href="/polls/create">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Create Your First Poll
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => {
              const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
              const isActive = poll.is_active && !isExpired
              const timeAgo = getTimeAgo(new Date(poll.created_at))
              const isOwner = user?.id === poll.created_by
              
              return (
                <Card key={poll.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                      <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                      {poll.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {poll.description || 'No description provided'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Created by</span>
                        <span className="font-medium text-gray-900">
                          {isOwner ? 'You' : poll.created_by}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Multiple votes</span>
                        <span className="font-medium text-gray-900">
                          {poll.allow_multiple_votes ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {poll.expires_at && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Expires</span>
                          <span className="font-medium text-gray-900">
                            {new Date(poll.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Link href={`/polls/${poll.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                          {isActive ? 'Vote Now' : 'View Results'}
                        </Button>
                      </Link>
                      {isOwner && (
                        <div className="ml-2">
                          <PollActions poll={poll} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link href={`/polls?page=${page - 1}${search ? `&search=${search}` : ''}${filter !== 'all' ? `&filter=${filter}` : ''}`}>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    Previous
                  </Button>
                </Link>
              )}
              
              <span className="px-4 py-2 text-gray-600">
                Page {page} of {totalPages}
              </span>
              
              {page < totalPages && (
                <Link href={`/polls?page=${page + 1}${search ? `&search=${search}` : ''}${filter !== 'all' ? `&filter=${filter}` : ''}`}>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

