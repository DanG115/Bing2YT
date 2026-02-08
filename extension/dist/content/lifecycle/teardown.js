import { bing2ytState } from "../state";
import { logDebug } from "../utils";
import { processRedirect } from "../redirect/redirector";
import { teardownYTPreview } from "../preview/ytPreview";
export const teardownBing2YT = () => {
    document.removeEventListener("click", processRedirect);
    bing2ytState.observers.redirect?.disconnect();
    bing2ytState.observers.ytIcon?.disconnect();
    document.getElementById("yt-search-btn")?.remove();
    teardownYTPreview();
    bing2ytState.redirectingNow = false;
    document.querySelectorAll(".yt-replaced").forEach((el) => {
        el.classList.remove("yt-replaced");
        el.innerHTML = "";
    });
    logDebug("Bing2YT cleaned up");
};
