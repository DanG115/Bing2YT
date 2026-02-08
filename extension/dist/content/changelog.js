const params = new URLSearchParams(window.location.search);
const currentVersion = params.get('v') || 'Unknown';
document.getElementById('currentVersion').textContent = currentVersion;
document.getElementById('closeChangelog').addEventListener('click', () => {
    window.close();
});
chrome.storage.sync.get(["mode"], (settings) => {
    if (settings.mode === "dark") {
        document.documentElement.classList.add("dark");
    }
    else {
        document.documentElement.classList.remove("dark");
    }
});
