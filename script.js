let mediaContainerElm = document.querySelector(".media-container");
let mediaWrapperElm = document.querySelector(".media-wrapper");
let mediaElm = document.querySelector(".media");
let msgElm = document.querySelector(".message");
let titleElm = document.querySelector(".title");
let htmlElm = document.querySelector("html");
let wrapper = document.querySelector(".wrapper");
if (!wrapper) {
    wrapper = document.querySelector(".overlay-wrapper");
}
let overlayBody = document.querySelector(".overlay-body");
let textContainer = document.querySelector(".text-container");
let wave = document.querySelector(".wave img");
let progressBar = document.querySelector(".progress-bar");
let progressBarCont = document.querySelector(".progress-bar-container");

//interval for checking font
let fontCheckInterval = null;
let intervalCount = 0;

let titleHTML = "";
let msgHTML = "";

let ytplayer;

function setMediaSize(size) {
    var scHeight = window.innerHeight - size;
    var scWidth = window.innerWidth - size;
    var height = 0;

    if (scWidth > scHeight) {
        height = Math.round(scHeight * 0.6);
    } else {
        height = Math.round(scWidth * 0.6);
    }

    var width = 0;

    if (mediaElm.id === "youtube") {
        width = Math.round(height * 1.78);
    } else {
        width = height;
    }

    if (width > window.innerWidth - 20) {
        width = window.innerWidth - 20;
        height = Math.round(width / (16 / 9));
    }

    if (wrapper.classList.contains("setting")) {
        scWidth = 0;
        if (mediaElm.id === "youtube") {
            scWidth = overlayBody.clientWidth * 0.7;
        } else {
            scWidth = overlayBody.clientWidth * 0.5;
        }
        // console.log(height);
        width = scWidth;
        height = 0;

        if (mediaElm.id === "youtube") {
            height = scWidth / 1.78;
        } else {
            height = width;
        }
    }

    if (wave) {
        wave.style.maxHeight = Math.round(height * 0.3);
    }

    if (mediaElm.id === "youtube") {
        var progressBarHeight = Math.round(Math.max(height * 0.023, 5));
        progressBarCont.style.height = progressBarHeight + "px";
        mediaWrapperElm.style.height = height + progressBarHeight + "px";
        mediaWrapperElm.style.width = width + "px";
        textContainer.style.width = width + "px";
        mediaContainerElm.style.height = height + "px";
    } else {
        mediaWrapperElm.style.maxHeight = height + "px";
        mediaWrapperElm.style.maxWidth = width + "px";
        textContainer.style.width = Math.round(width * 1.78) + "px";
    }

    mediaWrapperElm.style.borderRadius =
        Math.max(Math.min(Math.round(height * 0.04), 10), 5) + "px";

    if (wrapper.classList.contains("style2")) {
        textContainer.style.borderRadius =
            Math.max(Math.min(Math.round(height * 0.04), 10), 5) + "px";
    }

    setFontSize(height);
}

// setMediaSize(0);

function setFontSize(height, isTextOnly = false) {
    var fontSize = Math.round(height * 0.077);
    if (isTextOnly) {
        fontSize = height;
    }
    var msgFontSize = Math.round(fontSize * 0.8);

    document.querySelector(".title").style.fontSize = fontSize + "px";
    document.querySelector(".message").style.fontSize = msgFontSize + "px";

    if (mediaElm) {
        var reduce = 0.25;
        if (wrapper.classList.contains("style2")) {
            reduce = 0;
        }
        if (mediaElm.id === "youtube") {
            mediaWrapperElm.style.marginBottom =
                msgFontSize - Math.round(msgFontSize * reduce) + "px";
        } else {
            mediaWrapperElm.style.marginBottom =
                msgFontSize - Math.round(msgFontSize * reduce) + "px";
        }
    }

    titleElm.style.marginBottom =
        msgFontSize -
        Math.round(msgFontSize * 0.25) -
        Math.round(fontSize * 0.25) +
        "px";
    if (wrapper.classList.contains("setting")) {
        if (wrapper.classList.contains("style1")) {
            msgElm.style.marginBottom =
                msgFontSize - Math.round(msgFontSize * 0.25) + "px";
        } else {
            textContainer.style.marginBottom =
                msgFontSize - Math.round(msgFontSize * 0.25) + "px";
        }
    }

    if (wrapper.classList.contains("style2")) {
        textContainer.style.padding =
            msgFontSize -
            Math.round(fontSize * 0.25) +
            "px " +
            msgFontSize +
            "px " +
            msgFontSize +
            "px " +
            msgFontSize +
            "px ";
    }
}

function setOverlaySize() {
    var size = 20;
    var fontSize = 36;
    while (checkOverflow()) {
        if (mediaElm) {
            setMediaSize(size);
            size = size + 5;
        } else {
            setFontSize(fontSize, true);
            fontSize = fontSize - 1;
        }

        if (
            size > Math.min(window.innerHeight, window.innerWidth) ||
            fontSize == 0
        ) {
            break;
        }
    }
}

setTimeout(function () {
    // Code to be executed after 5 seconds

    if (mediaContainerElm) {
        if (mediaElm.id === "youtube") {
            let youtubeVideoId = mediaElm.getAttribute("data-ytvideoid");
            loadYtFrame(youtubeVideoId);
        } else {
            fontCheckInterval = setInterval(fontLoadListener, 250);
        }
    } else {
        fontCheckInterval = setInterval(fontLoadListener, 250);
    }
}, 5000);

function loadYtFrame(videoId) {
    //set the youtube embed API
    let tag = document.createElement("script");
    tag.id = "iframe-demo";
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function () {
        ytplayer = new YT.Player("youtube", {
            videoId: videoId,
            playerVars: {
                controls: 0,
                origin: window.location.origin,
            },
            events: {
                onReady: onYtPlayerReady,
                onerror: onYtPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    };
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var playerTotalTime = ytplayer.getDuration();
        mytimer = setInterval(function () {
            var playerCurrentTime = ytplayer.getCurrentTime();

            var playerTimeDifference =
                (playerCurrentTime / playerTotalTime) * 100;

            progressBar.style.width = playerTimeDifference + "%";
        }, 10);
    } else if (event.data == YT.PlayerState.ENDED) {
        progressBar.style.width = 100 + "%";
    }
}

function onYtPlayerReady() {
    fontCheckInterval = setInterval(fontLoadListener, 250);
}

//check if the font is loaded
function fontLoadListener() {
    let hasLoaded = false;
    try {
        hasLoaded = document.fonts.check("30px 'Open Sans'");
    } catch (error) {
        console.info(`document.fonts API error: ${error}`);
        fontLoadedSuccess();
        return;
    }
    intervalCount = intervalCount + 1;

    if (hasLoaded || intervalCount === 8) {
        if (intervalCount === 8) {
            if (textContainer) {
                textContainer.style.fontFamily = "sans-serif";
            }
        }
        fontLoadedSuccess();
    }
}

//when font is succesfully loaded
function fontLoadedSuccess() {
    if (fontCheckInterval) {
        clearInterval(fontCheckInterval);
    }

    document.getElementById("animate1").style.display = "block";

    //show the page content
    if (mediaElm) {
        setMediaSize(20);
    } else {
        setFontSize(469);
    }
    if (wrapper) {
        wrapper.classList.remove("hide");
        if (mediaContainerElm) {
            if (mediaElm.id === "youtube") {
                playYtVideo();
            }
        }
    }
    if (!wrapper.classList.contains("setting")) {
        if (checkOverflow()) {
            setOverlaySize();
        }
    }

    document.getElementById("animate1").style.display = "block";
}

function playYtVideo() {
    if (ytplayer) {
        ytplayer.playVideo();
        ytplayer.setVolume(100);
    }
}

function checkOverflow() {
    let wrapperHeight = wrapper.scrollHeight;
    let maxHeight = Math.min(window.innerHeight, window.innerWidth) - 20;
    if (wrapper.classList.contains("setting")) {
        maxHeight = overlayBody.clientWidth - 20;
    }
    if (wrapperHeight > maxHeight) {
        return true;
    } else {
        return false;
    }
}

window.addEventListener("resize", function () {
    this.location.reload();
});