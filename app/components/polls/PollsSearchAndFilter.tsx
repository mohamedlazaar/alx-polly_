import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface PollsSearchAndFilterProps {
  search: string;
  filter: string;
  user: any;
}

export function PollsSearchAndFilter({ search, filter, user }: PollsSearchAndFilterProps) {
  return (
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
  );
}
