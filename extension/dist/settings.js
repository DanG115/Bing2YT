const DEFAULT_SETTINGS = {
    mode: "light",
    textSize: 16,
    fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
    devMode: false,
    version: "3.0"
};
const modeSelect = document.getElementById("modeSelect");
const textSizeRange = document.getElementById("textSizeRange");
const textSizeValue = document.getElementById("textSizeValue");
const fontSelect = document.getElementById("fontSelect");
const devModeToggle = document.getElementById("devModeToggle");
const devDisclaimer = document.getElementById("devDisclaimer");
const versionNumber = document.getElementById("versionNumber");
function applyMode(mode) {
    if (mode === "dark") {
        document.documentElement.classList.add("dark");
    }
    else {
        document.documentElement.classList.remove("dark");
    }
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
    modeSelect.value = settings.mode;
    textSizeRange.value = settings.textSize.toString();
    textSizeValue.textContent = settings.textSize.toString();
    fontSelect.value = settings.fontFamily;
    devModeToggle.checked = settings.devMode;
    applyMode(settings.mode);
    devDisclaimer.style.display = settings.devMode ? "block" : "none";
    versionNumber.textContent = settings.version;
}
async function init() {
    const settings = await loadSettings();
    updateUI(settings);
    modeSelect.addEventListener("change", () => {
        const newMode = modeSelect.value;
        applyMode(newMode);
        saveSettings({ mode: newMode });
    });
    textSizeRange.addEventListener("input", () => {
        const newSize = parseInt(textSizeRange.value, 10);
        textSizeValue.textContent = newSize.toString();
        saveSettings({ textSize: newSize });
    });
    fontSelect.addEventListener("change", () => {
        saveSettings({ fontFamily: fontSelect.value });
    });
    devModeToggle.addEventListener("change", () => {
        const isDev = devModeToggle.checked;
        devDisclaimer.style.display = isDev ? "block" : "none";
        saveSettings({ devMode: isDev });
    });
}
init();
