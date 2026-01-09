import { bing2ytState } from "../state";
import { BING2YT_CONFIG, OBSERVER_DEBOUNCE_MS } from "../config";
import { processRedirect } from "./redirector";
import { logDebug } from "../utils";

let lastObserverCall = 0;

export const initRedirectObserver = () => {
  bing2ytState.observers.redirect?.disconnect();
  processRedirect();

  bing2ytState.observers.redirect = new MutationObserver(mutations => {
    const now = Date.now();

    if (now - lastObserverCall < OBSERVER_DEBOUNCE_MS) {
      logDebug("Redirect observer debounced");
      return;
    }
    lastObserverCall = now;

    if (window.location.href.startsWith("https://www.bing.com/videos/onecolumn/landing")) {
      logDebug("Observer skipping work on videos landing page");
      return;
    }

    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (
          node.nodeType === 1 &&
          (node as HTMLElement).matches(BING2YT_CONFIG.YT_selectors.embeddedIframe)
        ) {
          processRedirect();
          return;
        }
      }
    }
  });

  bing2ytState.observers.redirect.observe(document, {
    childList: true,
    subtree: true
  });
};
