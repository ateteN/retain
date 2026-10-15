export function normalizeToMonth(input?: string): Date {
  const d = input ? new Date(input) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export function startOfNextMonth(month: Date): Date {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1));
}