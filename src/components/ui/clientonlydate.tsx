"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/utils/user.helpers";

interface ClientOnlyDateProps {
  date: string;
  fallback?: string;
  className?: string;
}

export function ClientOnlyDate({
  date,
  fallback = "—",
  className,
}: ClientOnlyDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{formatDate(date)}</span>;
}