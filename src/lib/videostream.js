import { isRef, onMounted, onUnmounted, ref, watch } from "vue";

import { debug, replace, config } from ".";

import Hls from "hls.js";

export const useVideoStream = (src) => {
  const retryDelay = 3000;

  const videoRef = ref(null);
  const videoSrc = isRef(src) ? src : ref(src);

  const status = ref("nodata");
  const width = ref(640);
  const height = ref(360);

  let hls = null;
  let timeout = null;

  watch(
    [videoRef, videoSrc],
    () => {
      if (videoRef.value) {
        if (videoRef.value.canPlayType("application/vnd.apple.mpegURL")) {
          playSafariHls();
        } else {
          if (Hls.isSupported()) {
            playHls();
          }
        }
      }
    },
    { immediate: true }
  );

  const playSafariHls = () => {
    videoRef.value.src = videoSrc.value;

    /*
    timeout = setInterval(() => {
      videoRef.value.src = src;
    }, retryDelay);

    videoRef.value.addEventListener("loadeddata", (e) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });

    videoRef.value.addEventListener("waiting", (e) => {
      status.value = "loading";
      timeout = setInterval(() => {
        videoRef.value.src = videoSrc.value;
      }, retryDelay);
    });
    */

    const statuses =
      "abort canplay canplaythrough durationchange emptied encrypted ended error interruptbegin interruptend loadeddata loadedmetadata loadstart mozaudioavailable pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      );

    statuses.forEach((s) => {
      videoRef.value.addEventListener(s, (e) => {
        console.log(s.toUpperCase());
      });
    });
  };

  const playHls = () => {
    hls = new Hls({
      debug: debug.value,
      manifestLoadingRetryDelay: retryDelay,
      manifestLoadingMaxRetry: Infinity,
      xhrSetup: function (xhr) {
        xhr.addEventListener("error", (e) => {
          hls.loadSource(videoSrc.value);
          hls.startLoad();
          if (videoRef.value) {
            videoRef.value.play();
          }
        });
      },
    });

    hls.attachMedia(videoRef.value);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(videoSrc.value);
      hls.startLoad();
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      hls.recoverMediaError();
      if (data.type !== Hls.ErrorTypes.MEDIA_ERROR) {
        hls.startLoad();
      }
    });
  };

  onMounted(() => {
    videoRef.value.addEventListener("loadeddata", (e) => {
      status.value = "loading";
      width.value =
        videoRef.value?.videoWidth > 0 ? videoRef.value?.videoWidth : -1;
      height.value =
        videoRef.value?.videoHeight > 0 ? videoRef.value?.videoHeight : -1;
    });

    videoRef.value.addEventListener("playing", (e) => {
      status.value = "playing";
      width.value =
        videoRef.value?.videoWidth > 0 ? videoRef.value?.videoWidth : -1;
      height.value =
        videoRef.value?.videoHeight > 0 ? videoRef.value?.videoHeight : -1;
    });

    // videoRef.value.addEventListener("emptied", (e) => {
    //   status.value = "nodata";
    // });

    videoRef.value.addEventListener("ended", (e) => {
      status.value = "nodata";
    });
  });

  onUnmounted(() => {
    if (hls) {
      hls.destroy();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  return { videoRef, status, width, height };
};

export const formatStreamUrl = (streamkey) => {
  if (streamkey.endsWith("m3u8")) {
    return streamkey;
  } else {
    return replace(config.streamUrl, { streamkey });
  }
};
