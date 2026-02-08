document.getElementById('versionNumber').textContent = chrome.runtime.getManifest().version;
document.getElementById('getStartedBtn').addEventListener('click', () => {
    window.close();
});
