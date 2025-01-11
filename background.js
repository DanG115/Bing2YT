chrome.runtime.onInstalled.addListener(() => {
  console.log("Bing YouTube Redirector extension installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "redirectToYouTube") {
    console.log("Redirecting to YouTube:", message.url);
    sendResponse({ success: true });
  }
});
