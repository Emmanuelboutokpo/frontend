"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  width?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className = "",
  width = "w-[160px]",
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`h-10 rounded-xl border-slate-200 ${width} ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}