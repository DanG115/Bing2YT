export interface Bing2YTState {
  developerMode: boolean;
  redirectEnabled: boolean;
  redirectingNow?: boolean;
  observers: {
    redirect: MutationObserver | null;
    ytIcon: MutationObserver | null;
  };
}

export const bing2ytState: Bing2YTState = {
  developerMode: false,
  redirectEnabled: false,
  observers: {
    redirect: null,
    ytIcon: null
  }
};
