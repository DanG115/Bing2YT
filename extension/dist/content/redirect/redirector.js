import { bing2ytState } from "../state";
import { BING2YT_CONFIG, MAX_REDIRECT_ATTEMPTS } from "../config";
import { extractYouTubeId, isBingVideoPage, logDebug } from "../utils";
import { showRedirectToast } from "../ui/toast";
let redirectAttempts = 0;
let lastIframeSrc = null;
let lastHref = null;
let lastProcessTimestamp = 0;
export const processRedirect = (event) => {
    logDebug("Processing redirect...");
    if (!bing2ytState.redirectEnabled || !isBingVideoPage())
        return;
    if (bing2ytState.redirectingNow) {
        logDebug("Redirect already in progress, skipping.");
        return;
    }
    if (redirectAttempts >= MAX_REDIRECT_ATTEMPTS) {
        logDebug("Max redirect attempts reached, waiting for iframe load...");
        return;
    }
    const iframe = document.querySelector(BING2YT_CONFIG.YT_selectors.embeddedIframe);
    if (iframe) {
        if (lastHref === window.location.href && lastIframeSrc === iframe.src) {
            logDebug("Already processed this iframe source on this page, skipping.");
            return;
        }
    }
    redirectAttempts++;
    logDebug(`Redirect attempt #${redirectAttempts}`);
    if (iframe) {
        const videoId = extractYouTubeId(iframe.src);
        if (videoId) {
            lastHref = window.location.href;
            lastIframeSrc = iframe.src;
            logDebug(`Redirecting to YouTube video with ID: ${videoId}`);
            bing2ytState.redirectingNow = true;
            chrome.storage.sync.get(["ytRedirectOption"], (settings) => {
                if (settings.ytRedirectOption === "page") {
                    chrome.runtime.sendMessage({
                        action: "openBing2YT",
                        videoId
                    });
                }
                else if (settings.ytRedirectOption === "toast") {
                    showRedirectToast();
                    window.location.href = `${BING2YT_CONFIG.youtubeVideoUrl}${videoId}`;
                }
                else {
                    logDebug("Redirecting via toast replacement - no setting found.");
                    showRedirectToast();
                    window.location.href = `${BING2YT_CONFIG.youtubeVideoUrl}${videoId}`;
                    return;
                }
            });
        }
    }
    if (redirectAttempts < MAX_REDIRECT_ATTEMPTS) {
        logDebug("Redirect failed — retrying shortly...");
        setTimeout(() => processRedirect(), 800);
    }
    if (event?.type === "click") {
        const videoElement = event.target.closest(BING2YT_CONFIG.YT_selectors.videoResult);
        if (!videoElement)
            return;
        const link = videoElement.querySelector(BING2YT_CONFIG.YT_selectors.videoLink);
        if (link?.dataset.instInfo) {
            try {
                const data = JSON.parse(link.dataset.instInfo);
                const ytUrl = data.url ? decodeURIComponent(data.url) : null;
                if (ytUrl && ytUrl.includes("youtube.com")) {
                    logDebug(`Redirecting to YouTube URL: ${ytUrl}`);
                    bing2ytState.redirectingNow = true;
                    showRedirectToast();
                    lastHref = window.location.href;
                    lastIframeSrc = null;
                    event.preventDefault();
                    window.location.replace(ytUrl);
                }
            }
            catch (err) {
                logDebug("Failed to parse data-inst-info:", err);
            }
        }
    }
};
