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

import { marked } from "marked";

const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
const textSizeRange = document.getElementById("textSizeRange") as HTMLInputElement;
const textSizeValue = document.getElementById("textSizeValue")!;
const fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
const devModeToggle = document.getElementById("devModeToggle") as HTMLInputElement;
const devDisclaimer = document.getElementById("devDisclaimer")!;
const versionNumber = document.getElementById("versionNumber")!;

const PATCH_NOTES_URL = "https://api.github.com/repos/DanG115/Bing2YT/releases/latest";
const GITHUB_RELEASE_URL = "https://github.com/your-username/your-repo/releases/latest";

const patchNotesContainer = document.getElementById("releaseNotes")!;
const updateBtn = document.getElementById("updateBtn") as HTMLButtonElement;

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

// --- Rate Limiter ---
let lastFetchTime = 0;
const RATE_LIMIT_MS = 10_000; // 10 seconds

async function fetchPatchNotes(force = false) {
  const now = Date.now();
  if (!force && now - lastFetchTime < RATE_LIMIT_MS) {
    patchNotesContainer.innerHTML = "<em>Please wait before checking again.</em>";
    return;
  }
  lastFetchTime = now;
  try {
    const response = await fetch(PATCH_NOTES_URL);
    if (!response.ok) throw new Error("Failed to fetch patch notes");
    const data = await response.json();
    // Render as plain text, escaping HTML
    const plain = (data.body || "No patch notes available.").replace(/[<>&]/g, c =>
      c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"
    );
    patchNotesContainer.textContent = `${data.name || "Latest Release"}\n\n${plain}`;
  } catch (err) {
    patchNotesContainer.textContent = "Unable to load patch notes.";
  }
}

// Update button opens the latest release page and fetches notes with rate limit
if (updateBtn) {
  updateBtn.addEventListener("click", () => {
    fetchPatchNotes(true);
    window.open(GITHUB_RELEASE_URL, "_blank");
  });
}

async function init() {
  const settings = await loadSettings();
  updateUI(settings);
  fetchPatchNotes(); // Fetch patch notes on load

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
