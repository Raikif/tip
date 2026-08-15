export type TeamStage = "pending" | "verified" | "fullpaper" | "ppt" | "rejected";

export function canAdvance(_current: TeamStage, _next: TeamStage): boolean {
  return true;
}
