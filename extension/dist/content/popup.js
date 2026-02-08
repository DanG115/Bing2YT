let popupDeveloperMode = false;
function log(...args) {
    if (popupDeveloperMode) {
        console.log("[Bing2YT Popup]", ...args);
    }
}
function getSettingsVersion(callback) {
    chrome.storage.local.get(["settingsUIVersion"], (data) => {
        callback(data.settingsUIVersion || "old");
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("redirectToggle");
    const status = document.getElementById("toggleStatus");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    if (!toggle || !status)
        return;
    chrome.storage.sync.get(["redirectEnabled", "devMode"], (data) => {
        const enabled = data.redirectEnabled === true;
        popupDeveloperMode = data.devMode === true;
        toggle.checked = enabled;
        status.textContent = enabled ? "On" : "Off";
        log("Popup loaded, redirect enabled:", enabled);
        log("Developer mode:", popupDeveloperMode);
    });
    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;
        chrome.storage.sync.set({ redirectEnabled: enabled }, () => {
            status.textContent = enabled ? "On" : "Off";
            log("Redirect toggle changed to:", enabled);
            chrome.tabs.query({}, (tabs) => {
                for (const tab of tabs) {
                    if (tab.id !== undefined) {
                        chrome.tabs.sendMessage(tab.id, {
                            type: "TOGGLE_REDIRECT",
                            enabled,
                        });
                    }
                }
            });
        });
    });
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", () => {
            getSettingsVersion((version) => {
                if (version === "b") {
                    chrome.tabs.create({ url: chrome.runtime.getURL("content/pages/settings-b.html") });
                }
                else {
                    chrome.tabs.create({ url: chrome.runtime.getURL("content/pages/settings.html") });
                }
            });
        });
    }
    chrome.storage.sync.get(["mode", "textSize", "fontFamily"], (settings) => {
        if (settings.mode === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
        if (settings.textSize) {
            document.body.style.fontSize = `${settings.textSize}px`;
        }
        if (settings.fontFamily) {
            document.body.style.fontFamily = settings.fontFamily;
        }
    });
});
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.devMode) {
        popupDeveloperMode = changes.devMode.newValue;
        log("Developer mode changed in popup:", popupDeveloperMode);
    }
});
