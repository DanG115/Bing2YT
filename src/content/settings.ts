interface Settings {
  mode: "light" | "dark";
  devMode: boolean;
  ytIconVersion?: "button" | "icon";
  ytRedirectOption?: "toast" | "page";
  version?: string;
  settingsUIVersion?: "a" | "b";
}

const UI_VERSION_OLD = "a";
const UI_VERSION_NEW = "b";

const DEFAULT_SETTINGS: Settings = {
  mode: "light",
  devMode: false,
  ytRedirectOption: "toast",
  ytIconVersion: "button",
  version: "4.0.4",
  settingsUIVersion: UI_VERSION_OLD,
};

/* ================= DOM ================= */

const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement | null;
const devModeToggle = document.getElementById("devModeToggle") as HTMLInputElement | null;
const devDisclaimer = document.getElementById("devDisclaimer");
const versionNumber = document.getElementById("versionNumber");
const ytIconVersion = document.getElementById("ytInjectionOption") as HTMLSelectElement | null;
const ytRedirectOption = document.getElementById("ytRedirectOption") as HTMLSelectElement | null;

const tryNewUIBtn = document.getElementById("tryNewUIBtn");
const dismissNewUIBanner = document.getElementById("dismissNewUIBanner");
const rollbackUIBtn = document.getElementById("rollbackUI");
const newUIBanner = document.getElementById("newUIBanner");

/* ================= UTILS ================= */

function applyMode(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
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

/* ================= UI UPDATE ================= */

function updateUI(settings: Settings) {
  if (modeSelect) modeSelect.value = settings.mode;
  if (devModeToggle) devModeToggle.checked = settings.devMode;
  if (ytIconVersion) ytIconVersion.value = settings.ytIconVersion || "button";
  if (ytRedirectOption) ytRedirectOption.value = settings.ytRedirectOption || "toast";

  applyMode(settings.mode);

  if (devDisclaimer) {
    devDisclaimer.style.display = settings.devMode ? "block" : "none";
  }

  if (versionNumber) {
    versionNumber.textContent = chrome.runtime.getManifest().version;
  }
}

/* ================= INIT ================= */

async function init() {
  const settings = await loadSettings();
  updateUI(settings);

  /* ----- Event listeners ----- */

  modeSelect?.addEventListener("change", () => {
    const newMode = modeSelect.value as "light" | "dark";
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
      ytIconVersion: ytIconVersion.value as "button" | "icon",
    });
  });

  ytRedirectOption?.addEventListener("change", () => {
    saveSettings({
      ytRedirectOption: ytRedirectOption.value as "toast" | "page",
    });
  });
}

/* ================= NAVIGATION (NEW UI) ================= */

const navButtons = document.querySelectorAll(".nav-btn") as NodeListOf<HTMLButtonElement>;
const pages = document.querySelectorAll(".page") as NodeListOf<HTMLDivElement>;

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) =>
      b.classList.remove(
        "bg-blue-100",
        "dark:bg-gray-700",
        "text-blue-700",
        "dark:text-blue-300"
      )
    );

    btn.classList.add(
      "bg-blue-100",
      "dark:bg-gray-700",
      "text-blue-700",
      "dark:text-blue-300"
    );

    pages.forEach((p) => p.classList.add("hidden"));
    document
      .getElementById(`page-${btn.dataset.page}`)
      ?.classList.remove("hidden");
  });
});

/* ================= NEW UI BANNER (OLD UI ONLY) ================= */

chrome.storage.local.get(
  {
    settingsUIVersion: UI_VERSION_OLD,
    hideNewUIBanner: false,
  },
  ({ settingsUIVersion, hideNewUIBanner }) => {
    if (
      settingsUIVersion === UI_VERSION_OLD &&
      !hideNewUIBanner &&
      newUIBanner
    ) {
      newUIBanner.classList.remove("hidden");
    }
  }
);

/* ================= BANNER ACTIONS ================= */

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

/* ================= ROLLBACK (NEW UI) ================= */

rollbackUIBtn?.addEventListener("click", async () => {
  await chrome.storage.local.set({
    settingsUIVersion: UI_VERSION_OLD,
  });
  window.location.href = chrome.runtime.getURL("content/pages/settings.html");
});

/* ================= SAFETY NET (NEW UI) ================= */

window.addEventListener("error", async () => {
  await chrome.storage.local.set({
    settingsUIVersion: UI_VERSION_OLD,
  });
});

/* ================= START ================= */

init();
