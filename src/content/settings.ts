interface Settings {
  mode: "light" | "dark";
  devMode: boolean;
  ytIconVersion?: "button" | "icon"; 
  ytRedirectOption?: "toast" | "page";
  version?: string;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "light",
  devMode: false,
  ytRedirectOption: "toast",
  ytIconVersion: "button",
  version: "4.0.4",
};

// DOM elements
const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
const devModeToggle = document.getElementById("devModeToggle") as HTMLInputElement;
const devDisclaimer = document.getElementById("devDisclaimer")!;
const versionNumber = document.getElementById("versionNumber")!;
const updateStatus = document.getElementById("updateStatus")!;
const ytIconVersion = document.getElementById("ytInjectionOption") as HTMLSelectElement;
const ytRedirectOption = document.getElementById("ytRedirectOption") as HTMLSelectElement;
const updateBtn = document.getElementById("checkUpdatesBtn") as HTMLButtonElement;

const manifestVersion = chrome.runtime.getManifest().version;

// Apply dark/light mode
function applyMode(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

// Save settings to chrome storage
function saveSettings(settings: Partial<Settings>) {
  chrome.storage.sync.set(settings);
}

// Load settings from chrome storage
function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      resolve(items as Settings);
    });
  });
}

// Update UI with loaded settings
function updateUI(settings: Settings) {
  modeSelect.value = settings.mode;
  devModeToggle.checked = settings.devMode;
  ytIconVersion.value = settings.ytIconVersion || "button";
  ytRedirectOption.value = settings.ytRedirectOption || "toast";

  applyMode(settings.mode);
  devDisclaimer.style.display = settings.devMode ? "block" : "none";
  versionNumber.textContent = manifestVersion;
}

async function init() {
  const settings = await loadSettings();
  updateUI(settings);

  // Event listeners
  modeSelect.addEventListener("change", () => {
    const newMode = modeSelect.value as "light" | "dark";
    applyMode(newMode);
    saveSettings({ mode: newMode });
  });

  devModeToggle.addEventListener("change", () => {
    const isDev = devModeToggle.checked;
    devDisclaimer.style.display = isDev ? "block" : "none";
    saveSettings({ devMode: isDev });
  });

  ytIconVersion.addEventListener("change", () => {
    const newOption = ytIconVersion.value as "button" | "icon";
    saveSettings({ ytIconVersion: newOption });
  });

  ytRedirectOption.addEventListener("change", () => {
    const newOption = ytRedirectOption.value as "toast" | "page";
    saveSettings({ ytRedirectOption: newOption });
  });
}

init();
