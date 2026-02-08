const UI_VERSION_OLD = "a";
const UI_VERSION_NEW = "b";
const DEFAULT_SETTINGS = {
    mode: "light",
    devMode: false,
    ytRedirectOption: "toast",
    ytIconVersion: "button",
    version: "4.0.4",
    settingsUIVersion: UI_VERSION_OLD,
};
const modeSelect = document.getElementById("modeSelect");
const devModeToggle = document.getElementById("devModeToggle");
const devDisclaimer = document.getElementById("devDisclaimer");
const versionNumber = document.getElementById("versionNumber");
const ytIconVersion = document.getElementById("ytInjectionOption");
const ytRedirectOption = document.getElementById("ytRedirectOption");
const tryNewUIBtn = document.getElementById("tryNewUIBtn");
const dismissNewUIBanner = document.getElementById("dismissNewUIBanner");
const rollbackUIBtn = document.getElementById("rollbackUI");
const newUIBanner = document.getElementById("newUIBanner");
function applyMode(mode) {
    document.documentElement.classList.toggle("dark", mode === "dark");
}
function saveSettings(settings) {
    chrome.storage.sync.set(settings);
}
function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
            resolve(items);
        });
    });
}
function updateUI(settings) {
    if (modeSelect)
        modeSelect.value = settings.mode;
    if (devModeToggle)
        devModeToggle.checked = settings.devMode;
    if (ytIconVersion)
        ytIconVersion.value = settings.ytIconVersion || "button";
    if (ytRedirectOption)
        ytRedirectOption.value = settings.ytRedirectOption || "toast";
    applyMode(settings.mode);
    if (devDisclaimer) {
        devDisclaimer.style.display = settings.devMode ? "block" : "none";
    }
    if (versionNumber) {
        versionNumber.textContent = chrome.runtime.getManifest().version;
    }
}
async function init() {
    const settings = await loadSettings();
    updateUI(settings);
    modeSelect?.addEventListener("change", () => {
        const newMode = modeSelect.value;
        applyMode(newMode);
        saveSettings({ mode: newMode });
    });
    devModeToggle?.addEventListener("change", () => {
        const enabled = devModeToggle.checked;
        if (devDisclaimer) {
            devDisclaimer.style.display = enabled ? "block" : "none";
        }
        saveSettings({ devMode: enabled });
    });
    ytIconVersion?.addEventListener("change", () => {
        saveSettings({
            ytIconVersion: ytIconVersion.value,
        });
    });
    ytRedirectOption?.addEventListener("change", () => {
        saveSettings({
            ytRedirectOption: ytRedirectOption.value,
        });
    });
}
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        navButtons.forEach((b) => b.classList.remove("bg-blue-100", "dark:bg-gray-700", "text-blue-700", "dark:text-blue-300"));
        btn.classList.add("bg-blue-100", "dark:bg-gray-700", "text-blue-700", "dark:text-blue-300");
        pages.forEach((p) => p.classList.add("hidden"));
        document
            .getElementById(`page-${btn.dataset.page}`)
            ?.classList.remove("hidden");
    });
});
chrome.storage.local.get({
    settingsUIVersion: UI_VERSION_OLD,
    hideNewUIBanner: false,
}, ({ settingsUIVersion, hideNewUIBanner }) => {
    if (settingsUIVersion === UI_VERSION_OLD &&
        !hideNewUIBanner &&
        newUIBanner) {
        newUIBanner.classList.remove("hidden");
    }
});
tryNewUIBtn?.addEventListener("click", async () => {
    await chrome.storage.local.set({
        settingsUIVersion: UI_VERSION_NEW,
    });
    window.location.href = chrome.runtime.getURL("content/pages/settings-b.html");
});
dismissNewUIBanner?.addEventListener("click", async () => {
    await chrome.storage.local.set({ hideNewUIBanner: true });
    newUIBanner?.remove();
});
rollbackUIBtn?.addEventListener("click", async () => {
    await chrome.storage.local.set({
        settingsUIVersion: UI_VERSION_OLD,
    });
    window.location.href = chrome.runtime.getURL("content/pages/settings.html");
});
window.addEventListener("error", async () => {
    await chrome.storage.local.set({
        settingsUIVersion: UI_VERSION_OLD,
    });
});
init();
