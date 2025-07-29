// Utility to migrate and normalize role values
export const ROLE_MAPPING = {
  // English to Spanish mapping
  'buyer': 'comprador',
  'seller': 'vendedor', 
  'admin': 'admin',
  'pending_vendor': 'pending_vendor',
  // Already correct values
  'comprador': 'comprador',
  'vendedor': 'vendedor'
} as const;

export const normalizeRole = (role: string): string => {
  return ROLE_MAPPING[role as keyof typeof ROLE_MAPPING] || role;
};

export const isValidRole = (role: string): boolean => {
  return ['comprador', 'vendedor', 'admin', 'pending_vendor'].includes(role);
};