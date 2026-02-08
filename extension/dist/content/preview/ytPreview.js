export const YT_PREVIEW_CONFIG = {
    previewDelay: 300,
    fadeDuration: 200,
    maxWidth: "320px"
};
let ytPreviewElement = null;
const createPreviewElement = () => {
    const div = document.createElement("div");
    div.id = "yt-preview-tooltip";
    Object.assign(div.style, {
        position: "fixed",
        zIndex: "999999",
        background: "#1f1f1f",
        color: "#fff",
        padding: "8px",
        borderRadius: "8px",
        maxWidth: YT_PREVIEW_CONFIG.maxWidth,
        display: "none",
        opacity: "0",
        transition: `opacity ${YT_PREVIEW_CONFIG.fadeDuration}ms ease`
    });
    document.body.appendChild(div);
    return div;
};
export const showYTPreview = async (link, event) => {
    if (!link.href.includes("youtube.com"))
        return;
    try {
        if (!ytPreviewElement) {
            ytPreviewElement = createPreviewElement();
        }
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(link.href)}&format=json`;
        const res = await fetch(oembedUrl);
        if (!res.ok)
            return;
        const data = await res.json();
        ytPreviewElement.innerHTML = `
      <div style="display:flex;gap:8px;">
        <img src="${data.thumbnail_url}" width="100" style="border-radius:6px" />
        <div>
          <div style="font-weight:600">${data.title}</div>
          <div style="font-size:12px;color:#ccc">${data.author_name}</div>
        </div>
      </div>
    `;
        updateYTPreviewPosition(event);
        ytPreviewElement.style.display = "block";
        requestAnimationFrame(() => {
            ytPreviewElement.style.opacity = "1";
        });
    }
    catch {
    }
};
export const hideYTPreview = () => {
    if (!ytPreviewElement)
        return;
    ytPreviewElement.style.opacity = "0";
    setTimeout(() => {
        if (ytPreviewElement)
            ytPreviewElement.style.display = "none";
    }, YT_PREVIEW_CONFIG.fadeDuration);
};
export const isYTPreviewVisible = () => !!ytPreviewElement && ytPreviewElement.style.display === "block";
export const updateYTPreviewPosition = (event) => {
    if (!ytPreviewElement)
        return;
    ytPreviewElement.style.top = `${event.clientY + 15}px`;
    ytPreviewElement.style.left = `${event.clientX + 15}px`;
};
export const teardownYTPreview = () => {
    if (!ytPreviewElement)
        return;
    ytPreviewElement.remove();
    ytPreviewElement = null;
};
