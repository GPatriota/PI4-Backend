// Helper to safely parse ID from params
export const parseIdParam = (id: string | string[]): number => {
  const idStr = Array.isArray(id) ? id[0] : id;
  return parseInt(idStr, 10);
};
