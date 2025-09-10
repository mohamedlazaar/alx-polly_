import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { getTimeAgo } from "@/app/lib/utils";
import PollActions from "@/app/components/PollActions";
import { Poll } from "@/app/types";

interface PollsGridProps {
  polls: Poll[];
  user: any;
  search: string;
  filter: string;
}

export function PollsGrid({ polls, user, search, filter }: PollsGridProps) {
  if (polls.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => {
        const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
        const isActive = poll.is_active && !isExpired;
        const timeAgo = getTimeAgo(new Date(poll.created_at));
        const isOwner = user?.id === poll.created_by;
        
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
        );
      })}
    </div>
  );
}
