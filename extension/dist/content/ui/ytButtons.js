import { BING2YT_CONFIG } from "../config";
import { logDebug } from "../utils";
let lastIconSetting = undefined;
let storageListenerAdded = false;
function getIconSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["ytIconVersion"], (settings) => {
            resolve(settings?.ytIconVersion);
        });
    });
}
export const injectYouTubeButton = async () => {
    const existingBtn = document.getElementById("yt-search-btn");
    const existingSlick = document.getElementById("yt-search-btn-sl");
    const searchForm = document.querySelector(BING2YT_CONFIG.YT_selectors.searchForm);
    const inputBox = document.querySelector(BING2YT_CONFIG.YT_selectors.inputBox);
    if (searchForm && inputBox) {
        const iconSetting = await getIconSettings();
        const desired = iconSetting ?? "button";
        const hasButton = !!document.getElementById("yt-search-btn");
        const hasSlick = !!document.getElementById("yt-search-btn-sl");
        if (lastIconSetting === desired &&
            ((desired === "button" && hasButton) || (desired === "icon" && hasSlick))) {
            logDebug("YouTube button already matches setting, skipping injection");
            return;
        }
        if (existingBtn)
            existingBtn.remove();
        if (existingSlick)
            existingSlick.remove();
        if (desired === "button") {
            searchForm.insertBefore(createYouTubeSearchButton(), inputBox.nextSibling);
        }
        else if (desired === "icon") {
            searchForm.insertBefore(YTSearchSlick(), inputBox.nextSibling);
        }
        lastIconSetting = desired;
        logDebug(`Injecting YouTube search button (variant: ${desired})`);
    }
    else {
        logDebug("Search form not found, skipping YouTube button injection");
    }
};
export const createYouTubeSearchButton = () => {
    const btn = document.createElement("button");
    btn.id = "yt-search-btn";
    btn.innerHTML = `
    <svg style="vertical-align:middle;margin-right:6px" width="16" height="16" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
    Search on YouTube`;
    Object.assign(btn.style, {
        marginLeft: "8px",
        padding: "6px 12px",
        backgroundColor: "#fff",
        color: "#FF0000",
        border: "1px solid rgba(255, 0, 0, 0.4)",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        marginTop: "8px",
        display: "inline-flex",
        alignItems: "center",
        transition: "all 0.25s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    });
    btn.type = "button";
    btn.onmouseover = () => {
        btn.style.backgroundColor = "#FF0000";
        btn.style.color = "#fff";
        btn.style.borderColor = "#FF0000";
    };
    btn.onmouseout = () => {
        btn.style.backgroundColor = "#fff";
        btn.style.color = "#FF0000";
        btn.style.borderColor = "rgba(255, 0, 0, 0.4)";
    };
    btn.onclick = () => {
        const query = document.querySelector(BING2YT_CONFIG.YT_selectors.inputBox)?.value.trim();
        if (query && query.length > 0) {
            logDebug(`Opening YouTube search for: ${query}`);
            window.location.href = `${BING2YT_CONFIG.youtubeSearchUrl}${encodeURIComponent(query)}`;
        }
    };
    return btn;
};
export const YTSearchSlick = () => {
    const btn = document.createElement("button");
    btn.id = "yt-search-btn-sl";
    btn.type = "button";
    btn.setAttribute("aria-label", "Search on YouTube");
    btn.className = "sb_icon";
    btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  `;
    Object.assign(btn.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        width: "32px",
        height: "32px",
        padding: "0",
        marginLeft: "6px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
    });
    const svg = btn.querySelector("svg");
    Object.assign(svg.style, {
        display: "block",
        width: "18px",
        height: "18px",
        fill: "#E6E5E6",
        opacity: "0.85",
        pointerEvents: "none"
    });
    btn.addEventListener("mouseenter", () => {
        svg.style.opacity = "1";
    });
    btn.addEventListener("mouseleave", () => {
        svg.style.opacity = "0.85";
    });
    btn.onclick = () => {
        const query = document.querySelector(BING2YT_CONFIG.YT_selectors.inputBox)?.value.trim();
        if (query) {
            logDebug(`Opening YouTube search for: ${query}`);
            window.location.href = `${BING2YT_CONFIG.youtubeSearchUrl}${encodeURIComponent(query)}`;
        }
    };
    return btn;
};
