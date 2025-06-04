chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("redirectEnabled", (data) => {
    if (typeof data.redirectEnabled !== "boolean") {
      chrome.storage.sync.set({ redirectEnabled: false });
    }
  });
});
