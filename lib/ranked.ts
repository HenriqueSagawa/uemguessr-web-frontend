export const MASTER_RATING = 6000;
const TIER_POINTS = 400;
const METALS = ["Bronze", "Prata", "Ouro", "Platina", "Diamante"] as const;
const TIERS = ["III", "II", "I"] as const;

export function divisionProgress(rating: number) {
  if (rating >= MASTER_RATING) {
    return { current: "Mestre", next: "Mestre", progress: 100 };
  }
  const index = Math.min(Math.floor(rating / TIER_POINTS), 14);
  const metal = METALS[Math.floor(index / 3)];
  const tier = TIERS[index % 3];
  const current = `${metal} ${tier}`;
  const currentStart = index * TIER_POINTS;
  const progress = Math.round(((rating - currentStart) / TIER_POINTS) * 100);
  const nextIndex = index + 1;
  const next =
    nextIndex >= 15
      ? "Mestre"
      : `${METALS[Math.floor(nextIndex / 3)]} ${TIERS[nextIndex % 3]}`;
  return { current, next, progress };
}

export function initialsOf(name: string) {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  const two = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return two || name.slice(0, 2).toUpperCase();
}