import { addCustomNavItem } from "./YTinjector";
export const observer = new MutationObserver(() => {
    addCustomNavItem();
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});
