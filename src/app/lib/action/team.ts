"use server";

export function isValidTeamNameForDatabase(teamName: string) {
  return !!teamName?.trim() && !/[.$#[\]/]/.test(teamName);
}

function findTeamPath(
  data: unknown,
  targetName: string,
  currentPath = "",
): string | null {
  if (!data || typeof data !== "object") return null;

  const node = data as Record<string, any>;

  if (
    typeof node.teamName === "string" &&
    node.teamName.trim().toLowerCase() === targetName
  ) {
    return currentPath;
  }

  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === "object") {
      const nextPath = currentPath ? `${currentPath}/${key}` : key;
      const found = findTeamPath(value, targetName, nextPath);
      if (found) return found;
    }
  }

  return null;
}

export function collectTeams(data: unknown): Array<Record<string, any>> {
  const result: Array<Record<string, any>> = [];
  if (!data || typeof data !== "object") return result;

  const node = data as Record<string, any>;
  if (typeof node.teamName === "string") {
    result.push({ ...node, teamName: node.teamName });
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      result.push(...collectTeams(value));
    }
  }

  return result;
}

export async function resolveTeamPathByName(
  db: any,
  teamName: string,
): Promise<string | null> {
  const target = teamName?.trim();
  if (!target) return null;

  const directSnapshot = await db.ref(`peserta/${target}`).once("value");
  if (directSnapshot.exists()) {
    return target;
  }

  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val();
  if (!data) return null;

  return findTeamPath(data, target.toLowerCase(), "");
}
