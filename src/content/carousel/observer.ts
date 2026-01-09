// NEW FOR UPDATE_4.0.5: creating a new youtube dock on edge homepage.
import { BING2YT_CONFIG } from "../config";
import { logDebug } from "../utils";
import { addCustomNavItem } from "./YTinjector";

export const observer = new MutationObserver(() => {
  addCustomNavItem();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
