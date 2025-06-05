interface Settings {
  mode: "light" | "dark";
  textSize: number;
  fontFamily: string;
  devMode: boolean;
  version: string;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "light",
  textSize: 16,
  fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
  devMode: false,
  version: "3.0"
};

const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
const textSizeRange = document.getElementById("textSizeRange") as HTMLInputElement;
const textSizeValue = document.getElementById("textSizeValue")!;
const fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
const devModeToggle = document.getElementById("devModeToggle") as HTMLInputElement;
const devDisclaimer = document.getElementById("devDisclaimer")!;
const versionNumber = document.getElementById("versionNumber")!;

function applyMode(mode: "light" | "dark") {
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function saveSettings(settings: Partial<Settings>) {
  chrome.storage.sync.set(settings);
}

function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      resolve(items as Settings);
    });
  });
}

function updateUI(settings: Settings) {
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
    const newMode = modeSelect.value as "light" | "dark";
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
