const Videoparams = new URLSearchParams(window.location.search);
const videoId = Videoparams.get('v') || Videoparams.get('videoId');
const url = Videoparams.get('url');

let youtubeUrl = '';
if (url) {
    youtubeUrl = url;
} else if (videoId) {
   youtubeUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
} else {
    youtubeUrl = document.referrer || 'https://www.youtube.com/';
}

const videoInfoEl = document.getElementById('videoInfo');
if (videoId) {
    videoInfoEl.textContent = `Video ID: ${videoId}`;
} else if (url) {
    videoInfoEl.textContent = 'Redirecting to provided URL...';
} else {
    videoInfoEl.textContent = 'No specific video provided';
}

setTimeout(() => {
    chrome.runtime.sendMessage({
        action: "YT_pageRedirect",
        url: youtubeUrl
    });
}, 1500);
