import { Card } from '@/components/ui';

export function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col h-full border-transparent">
      {/* Thumbnail Placeholder */}
      <div className="h-40 flex-shrink-0 relative overflow-hidden rounded-t-lg bg-gray-200 animate-pulse">
        {/* Status Badge Placeholder */}
        <div className="absolute top-2 left-2 w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title Placeholder */}
        <div className="mb-2 min-h-[3rem]">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Meta Info Placeholder */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="ml-auto">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}