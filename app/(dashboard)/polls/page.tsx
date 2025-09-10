import { createServerSupabaseClient } from "@/app/lib/supabase-server";
import { DatabaseService } from "@/app/lib/database";
import { HeroSection } from "@/app/components/polls/HeroSection";
import { PollsSearchAndFilter } from "@/app/components/polls/PollsSearchAndFilter";
import { PollsStats } from "@/app/components/polls/PollsStats";
import { PollsGrid } from "@/app/components/polls/PollsGrid";
import { PollsPagination } from "@/app/components/polls/PollsPagination";

interface PollsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    filter?: string;
  };
}

export default async function PollsPage({ searchParams }: PollsPageProps) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const filter = searchParams.filter || 'all';

  const pollsResult = await DatabaseService.getPolls(user?.id, page, 12, search, filter);
  const polls = pollsResult.data?.data || [];
  const totalPages = pollsResult.data?.totalPages || 1;

  const statsResult = await DatabaseService.getPollsStats(user?.id);
  const stats = statsResult.data || { totalPolls: 0, activePolls: 0, totalVotes: 0, todayVotes: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <PollsSearchAndFilter search={search} filter={filter} user={user} />
        <PollsStats 
          totalPolls={stats.totalPolls} 
          activePolls={stats.activePolls} 
          totalVotes={stats.totalVotes} 
          todayVotes={stats.todayVotes} 
        />
        <PollsGrid polls={polls} user={user} search={search} filter={filter} />
        <PollsPagination page={page} totalPages={totalPages} search={search} filter={filter} />
      </div>
    </div>
  );
}