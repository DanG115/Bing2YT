let observer = null;
let redirectEnabled = false;
function observeBing() {
    if (!redirectEnabled || !document.body)
        return;
    if (observer)
        observer.disconnect();
    observer = new MutationObserver(() => {
        const link = document.querySelector("a.source.tosurl");
        if (link && link.href.includes("youtube.com")) {
            window.location.href = link.href;
            observer?.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
function stopObserving() {
    observer?.disconnect();
    observer = null;
}
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_REDIRECT") {
        redirectEnabled = msg.enabled;
        if (redirectEnabled) {
            observeBing();
        }
        else {
            stopObserving();
        }
    }
});
chrome.storage.sync.get("redirectEnabled", (data) => {
    redirectEnabled = data.redirectEnabled === true;
    if (redirectEnabled && window.location.href.includes("bing.com/videos")) {
        observeBing();
    }
});
