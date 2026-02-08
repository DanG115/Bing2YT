export const showRedirectToast = () => {
    const existingBanner = document.getElementById("bing2yt-toast");
    if (existingBanner)
        existingBanner.remove();
    const banner = document.createElement("div");
    banner.id = "bing2yt-toast";
    banner.textContent = "Redirecting to YouTube video!";
    Object.assign(banner.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        backgroundColor: "#FF0000",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
        textAlign: "center",
        padding: "10px 0",
        zIndex: "9999",
        opacity: "0",
        transform: "translateY(-100%)",
        transition: "all 0.4s ease"
    });
    document.body.appendChild(banner);
    requestAnimationFrame(() => {
        banner.style.opacity = "1";
        banner.style.transform = "translateY(0)";
    });
    setTimeout(() => {
        banner.style.opacity = "0";
        banner.style.transform = "translateY(-100%)";
        setTimeout(() => banner.remove(), 500);
    }, 3000);
};
