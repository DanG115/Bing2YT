import { injectYouTubeButton } from "../ui/ytButtons";
import { initRedirectObserver } from "../redirect/observer";
import { setupYTPreviewListeners } from "../preview/previewListeners";
import { updateViewSourceIcons } from "../ui/ytIcons";
import { BING2YT_CONFIG } from "../config";
import { processRedirect } from "../redirect/redirector";
import { isBingVideoPage, logDebug } from "../utils";
export const initialiseBing2YT = () => {
    if (!window.location.href.includes("bing.com/videos"))
        return;
    if (isBingVideoPage()) {
        document.addEventListener("click", processRedirect, { capture: true });
        initRedirectObserver();
        const ytIconsChecker = document.querySelector(BING2YT_CONFIG.YT_selectors.viewSource);
        if (ytIconsChecker) {
            updateViewSourceIcons();
        }
        else {
            logDebug("No view source icons found on video page");
        }
        logDebug("Initialised Bing2YT for video page");
    }
    else {
        injectYouTubeButton();
        initRedirectObserver();
        setupYTPreviewListeners();
        const ytIconsChecker = document.querySelector(BING2YT_CONFIG.YT_selectors.viewSource);
        if (ytIconsChecker) {
            updateViewSourceIcons();
        }
        else {
            logDebug("No view source icons found on video page");
        }
        logDebug("Initialized Bing2YT for search page");
    }
};
