import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface PollsPaginationProps {
  page: number;
  totalPages: number;
  search: string;
  filter: string;
}

function buildUrl(page: number, search: string, filter: string) {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  if (search) {
    params.set("search", search);
  }
  if (filter && filter !== 'all') {
    params.set("filter", filter);
  }
  return `/polls?${params.toString()}`;
}

export function PollsPagination({ page, totalPages, search, filter }: PollsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        {page > 1 && (
          <Link href={buildUrl(page - 1, search, filter)}>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              Previous
            </Button>
          </Link>
        )}
        
        <span className="px-4 py-2 text-gray-600">
          Page {page} of {totalPages}
        </span>
        
        {page < totalPages && (
          <Link href={buildUrl(page + 1, search, filter)}>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              Next
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
