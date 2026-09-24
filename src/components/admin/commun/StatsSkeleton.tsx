"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Props {
  count?: number;
  columns?: 2 | 3 | 4 | 5 | 6;
}

const COL_CLASSES: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function StatsSkeleton({ count = 5, columns = 5 }: Props) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${COL_CLASSES[columns]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="rounded-2xl p-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}