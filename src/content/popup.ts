let popupDeveloperMode = false;

function log(...args: any[]) {
  if (popupDeveloperMode) {
    console.log("[Bing2YT Popup]", ...args);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("redirectToggle") as HTMLInputElement | null;
  const status = document.getElementById("toggleStatus") as HTMLElement | null;
  const openSettingsBtn = document.getElementById("openSettingsBtn");

  if (!toggle || !status) return;

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
      chrome.tabs.create({ url: chrome.runtime.getURL("content/pages/settings.html") });
    });
  }

  chrome.storage.sync.get(["mode", "textSize", "fontFamily"], (settings) => {
    if (settings.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
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
