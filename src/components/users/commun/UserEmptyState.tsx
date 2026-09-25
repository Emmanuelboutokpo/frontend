"use client";

import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  /** Icône Lucide à afficher */
  icon: LucideIcon;
  /** Titre principal */
  title: string;
  /** Description secondaire (optionnelle) */
  description?: string;
  /** Action principale (bouton CTA) */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  /** Action secondaire (lien texte) */
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Couleur de l'icône (ex: "bg-emerald-50 text-emerald-700") */
  iconColor?: string;
  /** Réduire le padding (utile dans une carte) */
  compact?: boolean;
}

export function UserEmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  iconColor = "bg-emerald-50 text-emerald-700",
  compact = false,
}: Props) {
  const ActionIcon = action?.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-center ${
        compact ? "px-4 py-8" : "px-6 py-14"
      }`}
    >
      {/* Icône */}
      <div
        className={`grid place-items-center rounded-full ${iconColor} ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        <Icon className={compact ? "h-6 w-6" : "h-7 w-7"} />
      </div>

      {/* Titre */}
      <h3
        className={`mt-4 font-bold text-slate-800 ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-slate-500 sm:text-sm">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action &&
            (action.href ? (
              <Button
                asChild
                className="rounded-xl bg-emerald-700 px-5 hover:bg-emerald-800"
              >
                <Link href={action.href}>
                  {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                  {action.label}
                  {!ActionIcon && <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={action.onClick}
                className="rounded-xl bg-emerald-700 px-5 hover:bg-emerald-800"
              >
                {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                {action.label}
                {!ActionIcon && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                {secondaryAction.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}