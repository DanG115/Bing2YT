const redirectButton = document.getElementById("redirectButton");

chrome.storage.sync.get("redirectEnabled", (data) => {
  const isEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
  updateButtonState(isEnabled);
});

redirectButton.addEventListener("click", () => {
  chrome.storage.sync.get("redirectEnabled", (data) => {
    const isEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
    const newState = !isEnabled;

    chrome.storage.sync.set({ redirectEnabled: newState });
    updateButtonState(newState);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: newState ? "enableRedirect" : "disableRedirect",
        });
      }
    });
  });
});

function updateButtonState(isEnabled) {
  if (isEnabled) {
    redirectButton.textContent = "Turn Off"; //  "Turn Off"  
    redirectButton.classList.add("on");
    redirectButton.classList.remove("off");
  } else {
    redirectButton.textContent = "Turn On"; // "Turn On" disabled
    redirectButton.classList.add("off");
    redirectButton.classList.remove("on");
  }
}
