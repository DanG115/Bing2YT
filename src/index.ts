import { bing2ytState } from "./content/state";
import { initialiseBing2YT } from "./content/lifecycle/init";
import { teardownBing2YT } from "./content/lifecycle/teardown";

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "TOGGLE_REDIRECT") {
    bing2ytState.redirectEnabled = msg.enabled;
    msg.enabled ? initialiseBing2YT() : teardownBing2YT();
  }
});

chrome.storage.sync.get(["redirectEnabled", "devMode"], data => {
  bing2ytState.redirectEnabled = !!data.redirectEnabled;
  bing2ytState.developerMode = !!data.devMode;
  if (bing2ytState.redirectEnabled) initialiseBing2YT();
});