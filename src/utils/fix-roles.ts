// Utility to map role values consistently
export const roleMapping = {
  'buyer': 'comprador',
  'seller': 'vendedor',
  'admin': 'admin',
  'pending_vendor': 'pending_vendor'
} as const;

export const reverseRoleMapping = {
  'comprador': 'buyer',
  'vendedor': 'seller', 
  'admin': 'admin',
  'pending_vendor': 'pending_vendor'
} as const;

export function normalizeRole(role: string): string {
  return roleMapping[role as keyof typeof roleMapping] || role;
}