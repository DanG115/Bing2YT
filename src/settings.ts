interface Settings {
  mode: "light" | "dark";
  textSize: number;
  fontFamily: string;
  devMode: boolean;
  version: string;
  releaseNotes: string;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "light",
  textSize: 16,
  fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
  devMode: false,
  version: "3.0",
  releaseNotes: "- Initial release",
};

const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
const textSizeRange = document.getElementById("textSizeRange") as HTMLInputElement;
const textSizeValue = document.getElementById("textSizeValue")!;
const fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
const devModeToggle = document.getElementById("devModeToggle") as HTMLInputElement;
const devDisclaimer = document.getElementById("devDisclaimer")!;
const checkUpdatesBtn = document.getElementById("checkUpdatesBtn") as HTMLButtonElement;
const updateStatus = document.getElementById("updateStatus")!;
const versionNumber = document.getElementById("versionNumber")!;
const releaseNotes = document.getElementById("releaseNotes")!;

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
  releaseNotes.textContent = settings.releaseNotes;
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

  checkUpdatesBtn.addEventListener("click", async () => {
   updateStatus.textContent = "Checking for updates...";
   checkUpdatesBtn.disabled = true;

    await new Promise((res) => setTimeout(res, 1500));

    const latestVersion = "1.1";
    const latestNotes = "- Added dark mode\n- Added settings page\n- Bug fixes";

    const currentVersion = (await loadSettings()).version;

    if (currentVersion === latestVersion) {
      updateStatus.textContent = "You are up to date!";
    } else {
      updateStatus.textContent = `New version ${latestVersion} available! Updating...`;
      saveSettings({ version: latestVersion, releaseNotes: latestNotes });
      updateUI({ ...await loadSettings(), version: latestVersion, releaseNotes: latestNotes });
    }

    checkUpdatesBtn.disabled = false;
  });
}

init();
