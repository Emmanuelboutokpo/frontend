"use client";

import { LucideIcon, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "success" | "default";
  onConfirm: () => void;
  children?: React.ReactNode;
}

const CONFIRM_CLASSES: Record<string, string> = {
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  success: "bg-emerald-700 text-white hover:bg-emerald-800",
  default: "bg-slate-900 text-white hover:bg-slate-800",
};

export function ConfirmModal({
  open,
  onOpenChange,
  title = "Êtes-vous sûr ?",
  description,
  icon: Icon = AlertTriangle,
  iconBg = "bg-rose-50",
  iconColor = "text-rose-600",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  confirmVariant = "danger",
  onConfirm,
  children,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <div
            className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full ${iconBg}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <AlertDialogTitle className="text-center text-lg">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center text-sm text-slate-500">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children && <div className="my-2">{children}</div>}

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="rounded-xl">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`rounded-xl ${CONFIRM_CLASSES[confirmVariant]}`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}