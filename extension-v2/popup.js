const redirectButton = document.getElementById("redirectButton");

// Load the saved state from storage
chrome.storage.sync.get("redirectEnabled", (data) => {
  const isEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
  updateButtonState(isEnabled);
});

// Add a click event listener to toggle the state
redirectButton.addEventListener("click", () => {
  chrome.storage.sync.get("redirectEnabled", (data) => {
    const isEnabled = data.redirectEnabled !== undefined ? data.redirectEnabled : true;
    const newState = !isEnabled;

    // Save the new state and update the button
    chrome.storage.sync.set({ redirectEnabled: newState });
    updateButtonState(newState);

    // Send a message to the content script to update the redirect state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: newState ? "enableRedirect" : "disableRedirect",
        });
      }
    });
  });
});

// Function to update the button appearance using CSS classes
function updateButtonState(isEnabled) {
  if (isEnabled) {
    redirectButton.textContent = "Turn Off"; // Show "Turn Off" when enabled
    redirectButton.classList.add("on");
    redirectButton.classList.remove("off");
  } else {
    redirectButton.textContent = "Turn On"; // Show "Turn On" when disabled
    redirectButton.classList.add("off");
    redirectButton.classList.remove("on");
  }
}
