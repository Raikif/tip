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

export function canSubmitAbstrak(status: TeamStage): boolean {
  return isStage(status, "verified");
}

export function canSubmitFullpaper(status: TeamStage): boolean {
  return isStage(status, "fullpaper");
}

export function canSubmitPPT(status: TeamStage): boolean {
  return isStage(status, "ppt");
}

export function getStageLabel(status: TeamStage): string {
  const labels: Record<TeamStage, string> = {
    pending: "Menunggu Verifikasi",
    verified: "Terverifikasi",
    fullpaper: "Lolos ke Fullpaper",
    ppt: "Lolos ke Final (PPT)",
    rejected: "Ditolak",
  };
  return labels[status] || status;
}

export function getNextStageLabel(status: TeamStage): string {
  if (status === "pending") return "Verifikasi";
  if (status === "verified") return "Pengumpulan Abstrak";
  if (status === "fullpaper") return "Pengumpulan Fullpaper";
  if (status === "ppt") return "Pengumpulan PPT (Final)";
  return "";
}
