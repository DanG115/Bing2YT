console.log("Content script is running...");


if (window.location.href.includes("bing.com/videos")) {
  console.log("Bing video results page detected.");

  const observer = new MutationObserver(function(mutationsList, observer) {
    const youtubeLink = document.querySelector('a.source.tosurl');
    
    if (youtubeLink && youtubeLink.href) {
      console.log("YouTube link found:", youtubeLink.href);
      window.location.href = youtubeLink.href;
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
} else {
  console.log("Not a Bing video results page.");
}
