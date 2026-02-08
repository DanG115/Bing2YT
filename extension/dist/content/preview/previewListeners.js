import { BING2YT_CONFIG } from "../config";
import { showYTPreview, hideYTPreview, updateYTPreviewPosition, isYTPreviewVisible, YT_PREVIEW_CONFIG } from "../preview/ytPreview";
let timeout = null;
export const setupYTPreviewListeners = () => {
    document.addEventListener("mouseover", (event) => {
        const link = event.target
            ?.closest(BING2YT_CONFIG.YT_selectors.videoTitle);
        if (!link)
            return;
        link.removeAttribute("title");
        if (timeout)
            clearTimeout(timeout);
        timeout = window.setTimeout(() => showYTPreview(link, event), YT_PREVIEW_CONFIG.previewDelay);
    });
    document.addEventListener("mousemove", (event) => {
        if (isYTPreviewVisible()) {
            updateYTPreviewPosition(event);
        }
    });
    document.addEventListener("mouseout", (event) => {
        const link = event.target
            ?.closest(BING2YT_CONFIG.YT_selectors.videoTitle);
        if (!link)
            return;
        if (timeout)
            clearTimeout(timeout);
        hideYTPreview();
    });
};
