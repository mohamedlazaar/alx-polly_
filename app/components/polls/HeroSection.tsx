import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export function HeroSection() {
  return (
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
  );
}
