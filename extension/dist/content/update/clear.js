export const CleanupS = () => {
    chrome.storage.sync.set({
        fontFamily: "Arial",
        textSize: 14
    }, () => {
        console.log("Bing2YT: Defaults applied");
        setTimeout(() => {
            chrome.storage.sync.remove(["fontFamily", "textSize"], () => {
                console.log("Bing2YT: Settings cleaned up");
            });
        }, 300);
    });
};
