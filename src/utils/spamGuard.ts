import { SpamGuardEntry } from "../dto/SpamGuardDTO";

export const createSpamGuard = (windowMs: number, maxHits: number) => {
  const bucket = new Map<string, SpamGuardEntry>();

  return (key: string): boolean => {
    const now = Date.now();
    const existing = bucket.get(key);

    if (!existing || now - existing.firstHitAt > windowMs) {
      bucket.set(key, {
        hitCount: 1,
        firstHitAt: now,
      });
      return true;
    }

    if (existing.hitCount >= maxHits) {
      return false;
    }

    existing.hitCount += 1;
    return true;
  };
};
