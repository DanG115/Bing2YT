console.log("Content script is running...");

let isRedirectEnabled = true; 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enableRedirect") {
    isRedirectEnabled = true;
    console.log("Redirection enabled.");
  } else if (message.action === "disableRedirect") {
    isRedirectEnabled = false;
    console.log("Redirection disabled.");
  }
});

function redirectToYouTube() {
  if (window.location.href.includes("bing.com/videos")) {
    console.log("Bing video results page detected.");

    const observer = new MutationObserver(() => {
      if (isRedirectEnabled) {
        const youtubeLink = document.querySelector('a.source.tosurl');
        if (youtubeLink && youtubeLink.href) {
          console.log("YouTube link found:", youtubeLink.href);
          window.location.href = youtubeLink.href;
          observer.disconnect(); 
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.log("Not a Bing video results page.");
  }
}

chrome.storage.sync.get("redirectEnabled", (data) => {
  isRedirectEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
  if (isRedirectEnabled) {
    redirectToYouTube();
  }
});
