let bgDeveloperMode = false;

function BGlog(...args: any[]): void {
  if (bgDeveloperMode) console.log("[Bing2YT BG]", ...args);
}

chrome.runtime.onInstalled.addListener(async (details) => {
  const manifest = chrome.runtime.getManifest();
  const currentVersion = manifest.version;
  const { lastShownVersion } = await chrome.storage.local.get("lastShownVersion");
  const data = await chrome.storage.sync.get(["redirectEnabled", "devMode"]);

  if (typeof data.redirectEnabled !== "boolean") {
    await chrome.storage.sync.set({ redirectEnabled: false });
    BGlog("redirectEnabled initialised to false");
  }

  bgDeveloperMode = data.devMode === true;
  BGlog("Developer mode in background:", bgDeveloperMode);

  if (details.reason === "update") {
    const previousVersion = details.previousVersion || "unknown";
    BGlog(`Updated from ${previousVersion} => ${currentVersion}`);

    if (lastShownVersion !== currentVersion) {
      await chrome.storage.local.set({ lastShownVersion: currentVersion });
      chrome.tabs.create({
        url: chrome.runtime.getURL("content/pages/changelog.html?v=" + currentVersion + "&from=msedge" ),
      });
      BGlog("Changelog page opened for new version");
    } else {
      BGlog("Changelog already shown for this version — skipping");
    }
  } else if (details.reason === "install") {
    await chrome.storage.local.set({ lastShownVersion: currentVersion });
    chrome.tabs.create({
      url: chrome.runtime.getURL("content/pages/welcome.html"),
    });
    BGlog("Welcome page opened on first install");
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.devMode) {
    bgDeveloperMode = changes.devMode.newValue;
    BGlog("Developer mode changed in background:", bgDeveloperMode);
  }
});
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "openBing2YT" && sender.tab?.id) {
    const url = chrome.runtime.getURL(
      `content/pages/bing2yt.html?v=${encodeURIComponent(msg.videoId)}`
    );

    chrome.tabs.update(sender.tab.id, { url });
  }
});
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "YT_pageRedirect" && msg.url && sender.tab?.id) {
        chrome.tabs.update(sender.tab.id, {
            url: msg.url
        });
    }
});

