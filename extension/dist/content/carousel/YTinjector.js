import { BING2YT_CONFIG } from "../config";
import { logDebug } from "../utils";
export const addCustomNavItem = () => {
    const superNav = document.getElementById(BING2YT_CONFIG.Edge_selectors.superNav);
    if (!superNav) {
        logDebug("Super nav not found, cannot add YouTube nav item.");
        return false;
    }
    const navContainer = superNav.querySelector(BING2YT_CONFIG.Edge_selectors.navContainer);
    if (!navContainer) {
        logDebug("Nav container not found, cannot add YouTube nav item.");
        return false;
    }
    const navList = navContainer.querySelector(BING2YT_CONFIG.Edge_selectors.navList);
    if (!navList) {
        logDebug("Nav list not found, cannot add YouTube nav item.");
        return false;
    }
    if (navList.querySelector("#bing2yt-nav")) {
        return true;
    }
    const li = document.createElement("li");
    li.setAttribute("part", "list-item");
    const a = document.createElement("a");
    a.id = "bing2yt-nav";
    a.className = "navItem";
    a.tabIndex = 0;
    a.textContent = "YouTube";
    a.href = "https://www.youtube.com";
    a.target = "_self";
    li.appendChild(a);
    navList.appendChild(li);
    logDebug("YouTube nav item added.");
    return true;
};
