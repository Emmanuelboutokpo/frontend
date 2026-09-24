"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/utils/user.helpers";

interface RelativeTimeProps {
  date: string;
  fallback?: string;
  className?: string;
}

export function RelativeTime({
  date,
  fallback = "—",
  className,
}: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Au SSR, on rend un placeholder stable
  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{formatRelativeTime(date)}</span>;
}