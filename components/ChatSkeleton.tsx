import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "./ui/sidebar";

export default function ChatSkeleton() {
  const { open, isMobile } = useSidebar();
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 -mt-48">
      <div
        className={`max-w-3xl w-full space-y-8 ${
          open && !isMobile && "md:max-w-[420px] lg:max-w-[640px]"
        }`}
      >
        {/* User Message Skeleton */}
        <div className="flex flex-col items-end">
          {/* Image attachment skeleton */}
          <div className="mb-2 max-w-[70%]">
            <Skeleton className="w-full h-64 rounded-2xl bg-gray-200 dark:bg-[#303030]" />
          </div>
          {/* User message bubble */}
          <div className="max-w-[70%]">
            <Skeleton className="h-12 w-80 rounded-3xl bg-gray-200 dark:bg-[#303030]" />
          </div>
          {/* Action buttons */}
          <div className="flex justify-end mt-1 gap-2">
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
          </div>
        </div>

        {/* Assistant Message Skeleton */}
        <div className="flex">
          <div className="max-w-full w-full">
            <div className="rounded-3xl py-4">
              {/* Assistant message content */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-[#303030]" />
                <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-[#303030]" />
                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-[#303030]" />
                <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-[#303030]" />
              </div>
              {/* Separator */}
              <Skeleton className="h-px w-full my-4 bg-gray-200 dark:bg-[#303030]" />
              {/* Copy button */}
              <div className="flex justify-start">
                <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
              </div>
            </div>
          </div>
        </div>

        {/* Another User Message Skeleton */}
        <div className="flex flex-col items-end">
          <div className="max-w-[70%]">
            <Skeleton className="h-10 w-64 rounded-3xl bg-gray-200 dark:bg-[#303030]" />
          </div>
          <div className="flex justify-end mt-1 gap-2">
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
          </div>
        </div>

        {/* Another Assistant Message Skeleton */}
        <div className="flex">
          <div className="max-w-full w-full">
            <div className="rounded-3xl py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-[#303030]" />
                <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-[#303030]" />
                <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-[#303030]" />
              </div>
              <Skeleton className="h-px w-full my-4 bg-gray-200 dark:bg-[#303030]" />
              <div className="flex justify-start">
                <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
              </div>
            </div>
          </div>
        </div>

        {/* User Message with longer text skeleton */}
        <div className="flex flex-col items-end">
          <div className="max-w-[70%]">
            <Skeleton className="h-16 w-96 rounded-3xl bg-gray-200 dark:bg-[#303030]" />
          </div>
          <div className="flex justify-end mt-1 gap-2">
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
            <Skeleton className="h-8 w-8 rounded bg-gray-200 dark:bg-[#303030]" />
          </div>
        </div>
      </div>
    </div>
  );
}
