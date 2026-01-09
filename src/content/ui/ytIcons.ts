import { bing2ytState } from "../state";
import { BING2YT_CONFIG } from "../config";
import { logDebug } from "../utils";  

export const updateViewSourceIcons = () => {
  logDebug("Updating Bing view source icons to YouTube icons");
  bing2ytState.observers.ytIcon?.disconnect();

  const replaceIcons = () => {
    document.querySelectorAll(BING2YT_CONFIG.YT_selectors.viewSource).forEach((element) => {
      if (!element.classList.contains("yt-replaced")) {
        element.innerHTML = `
          <span class="yt-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
              viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184C21.239 3.53 22.488 4.857 22.837 6.524c.376 1.803.376 5.563.376 5.563s0 3.76-.376 5.563c-.349 1.667-1.598 2.994-3.222 3.34C17.5 21.5 12 21.5 12 21.5s-5.5 0-7.615-.33C2.761 20.824 1.512 19.497 1.163 17.83.787 16.027.787 12.267.787 12.267s0-3.76.376-5.563C1.512 4.857 2.761 3.53 4.385 3.184 6.5 2.854 12 2.854 12 2.854s5.5 0 7.615.33zM10 15.5l6-3.5-6-3.5v7z"/>
            </svg>
          </span>`;
        element.classList.add("yt-replaced");
        logDebug("Replaced icon with YouTube icon");
      }
    });
  };

  bing2ytState.observers.ytIcon = new MutationObserver(replaceIcons);
  bing2ytState.observers.ytIcon.observe(document.body, { childList: true, subtree: true });

  replaceIcons();
  logDebug("Observer set for view source icon updates");
};
