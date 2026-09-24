// =====================================================================
// PERMISSIONS & RÔLES
// =====================================================================

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  OWNER: "OWNER",
  ADMIN: "ADMIN",
} as const;

export type Role = keyof typeof ROLES;

export const permissions = {
  CUSTOMER: [
    "booking:create",
    "booking:read-own",
    "favorite:create",
  ],

  OWNER: [
    "establishment:create",
    "establishment:update-own",
    "availability:update-own",
    "booking:read-own",
  ],

  ADMIN: [
    "user:read",
    "user:update",
    "establishment:read",
    "establishment:create",
    "establishment:update",
    "establishment:approve",
    "establishment:delete",
    "booking:read",
    "statistics:read",
  ],
} as const;

export type Permission = (typeof permissions)[Role][number];

// ---------------------------------------------------------------------
// Helper : vérifier une permission
// ---------------------------------------------------------------------
export function hasPermission(
  role: Role | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return (permissions[role] as readonly string[]).includes(permission);
}

export function hasAnyPermission(
  role: Role | null | undefined,
  list: Permission[]
): boolean {
  if (!role) return false;
  return list.some((p) => hasPermission(role, p));
}