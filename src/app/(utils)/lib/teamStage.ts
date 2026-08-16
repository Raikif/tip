export type TeamStage = "pending" | "verified" | "fullpaper" | "ppt" | "rejected";

export function canAdvance(_current: TeamStage, _next: TeamStage): boolean {
  return true;
}

const STAGE_RANK: Record<TeamStage, number> = {
  pending: 0,
  verified: 1,
  fullpaper: 2,
  ppt: 3,
  rejected: -1,
};

export function isStage(current: TeamStage, target: TeamStage): boolean {
  if (current === target) return true;
  if (current === "rejected" || target === "rejected") return false;
  return (STAGE_RANK[current] ?? 0) > (STAGE_RANK[target] ?? 0);
}
