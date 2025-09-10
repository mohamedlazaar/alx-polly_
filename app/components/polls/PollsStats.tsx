interface PollsStatsProps {
  totalPolls: number;
  activePolls: number;
  totalVotes: number;
  todayVotes: number;
}

export function PollsStats({ totalPolls, activePolls, totalVotes, todayVotes }: PollsStatsProps) {
  return (
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
            <p className="text-2xl font-bold text-gray-900">{activePolls}</p>
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
            <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
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
            <p className="text-2xl font-bold text-gray-900">{todayVotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
