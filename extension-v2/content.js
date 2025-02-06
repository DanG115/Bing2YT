console.log("Content script is running...");

let isRedirectEnabled = true; // Default state for redirection

// Listen for messages from the popup to enable or disable redirection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enableRedirect") {
    isRedirectEnabled = true;
    console.log("Redirection enabled.");
  } else if (message.action === "disableRedirect") {
    isRedirectEnabled = false;
    console.log("Redirection disabled.");
  }
});

// Function to handle redirection
function redirectToYouTube() {
  if (window.location.href.includes("bing.com/videos")) {
    console.log("Bing video results page detected.");

    const observer = new MutationObserver(() => {
      if (isRedirectEnabled) {
        const youtubeLink = document.querySelector('a.source.tosurl');
        if (youtubeLink && youtubeLink.href) {
          console.log("YouTube link found:", youtubeLink.href);
          window.location.href = youtubeLink.href;
          observer.disconnect(); // Stop observing once redirection happens
        }
      }
    });

    // Observe changes to the DOM for new video results
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.log("Not a Bing video results page.");
  }
}

// Check storage for the current state when the content script runs
chrome.storage.sync.get("redirectEnabled", (data) => {
  isRedirectEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
  if (isRedirectEnabled) {
    redirectToYouTube();
  }
});
