document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("redirectToggle") as HTMLInputElement | null;
  const status = document.getElementById("toggleStatus") as HTMLElement | null;
  const openSettingsBtn = document.getElementById("openSettingsBtn");

  if (!toggle || !status) {
    console.error("Toggle or status element not found in popup.");
    return;
  }

  // Load saved redirect state
  chrome.storage.sync.get("redirectEnabled", (data) => {
    const enabled = data.redirectEnabled === true;
    toggle.checked = enabled;
    status.textContent = enabled ? "On" : "Off";
  });

  // Redirect toggle listener
  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ redirectEnabled: enabled }, () => {
      status.textContent = enabled ? "On" : "Off";

      // Notify all tabs about redirect toggle change
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

  // Open settings page button listener
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("settings/settings.html") });
    });
  }

  // Load mode, textSize, fontFamily and apply them
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
