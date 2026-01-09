import { BING2YT_CONFIG } from "../config";
import { showYTPreview, hideYTPreview } from "./ytPreview";

let timeout: number | null = null;

export const setupYTPreviewListeners = () => {
  document.addEventListener("mouseover", e => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      BING2YT_CONFIG.YT_selectors.videoTitle
    );
    if (!link) return;

    timeout = window.setTimeout(
      () => showYTPreview(link, e),
      300
    );
  });

  document.addEventListener("mouseout", () => {
    if (timeout) clearTimeout(timeout);
    hideYTPreview();
  });
};
