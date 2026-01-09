import { bing2ytState } from "./state";

export const logDebug = (...args: any[]) => {
  if (bing2ytState.developerMode) {
    console.log("[Bing2YT]", ...args);
  }
};

export const extractYouTubeId = (url: string): string | null => {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export const isBingVideoPage = (): boolean =>
  location.href.includes("/riverview/") ||
  location.href.includes("/watch/") ||
  location.href.includes("view=detail");
