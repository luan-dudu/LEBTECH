// Limite simples em memória (por instância do servidor). Em ambiente serverless
// cada instância tem o próprio contador — suficiente para conter abusos óbvios.

const hits = new Map<string, { count: number; reset: number }>();
const MAX_KEYS = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (hits.size > MAX_KEYS) {
    hits.forEach((entry, k) => {
      if (entry.reset < now) hits.delete(k);
    });
  }

  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}
