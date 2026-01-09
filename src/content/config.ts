export const MAX_REDIRECT_ATTEMPTS = 10;
export const OBSERVER_DEBOUNCE_MS = 700;


export const BING2YT_CONFIG = {
  YT_selectors: {
    searchForm: ".b_searchboxForm",
    inputBox: "#sb_form_q",
    videoTitle: "div.title[href*='youtube.com']",
    videoLink: "a[href*='youtube.com'], a.source.tosurl",
    embeddedIframe: "iframe[src*='youtube.com/embed/'], div.ep iframe[src*='youtube.com']",
    viewSource: ".action.view_source.nofocus",
    videoResult: ".dg_u, .vrhdata, [data-bm]"
  },
  Edge_selectors: {
    superNav: "SuperNav",
    navContainer: ".navContainer",
    navList: "#navList"
  },
  youtubeUrl: "https://www.youtube.com/watch?v=",
  youtubeSearchUrl: "https://www.youtube.com/results?search_query="
};
