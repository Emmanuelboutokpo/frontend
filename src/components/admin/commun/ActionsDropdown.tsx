"use client";

import { MoreHorizontal, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger" | "success" | "warning";
  separatorBefore?: boolean;
}

interface Props {
  actions: ActionItem[];
  align?: "start" | "end";
  ariaLabel?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  default: "",
  danger: "text-rose-600 focus:bg-rose-50 focus:text-rose-700",
  success: "text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800",
  warning: "text-amber-700 focus:bg-amber-50 focus:text-amber-800",
};

export function ActionsDropdown({
  actions,
  align = "end",
  ariaLabel = "Actions",
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          aria-label={ariaLabel}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i}>
              {a.separatorBefore && i > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={a.onClick}
                className={VARIANT_CLASSES[a.variant ?? "default"]}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {a.label}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}