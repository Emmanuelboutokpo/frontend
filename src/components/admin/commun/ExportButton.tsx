"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick?: () => void;
  label?: string;
  variant?: "default" | "outline";
}

export function ExportButton({
  onClick,
  label = "Exporter",
  variant = "outline",
}: Props) {
  const handleExport = () => {
    if (onClick) return onClick();
    console.log("Export CSV déclenché");
  };

  return (
    <Button
      variant={variant}
      onClick={handleExport}
      className="h-10 rounded-xl"
    >
      <Download className="mr-2 h-3.5 w-3.5" />
      {label}
    </Button>
  );
}