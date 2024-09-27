document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video"),
    canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d", { willReadFrequently: true }),
    redHeart = document.getElementById("redHeart"),
    blueHeart = document.getElementById("blueHeart"),
    expandBtn = document.getElementById("expandBtn"),
    collapseBtn = document.getElementById("collapseBtn"),
    cameraBtn = document.getElementById("cameraBtn");

  let isExpanded = false,
    mode = "normal",
    redIntensity = 0,
    blueIntensity = 0;

  function processFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height),
      data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (mode === "red") {
        data[i] = Math.min(data[i] + redIntensity, 255); // zwiększenie nasycenia czerwieni
        if (data[i] === 255) {
          data[i + 1] = Math.max(data[i + 1] - 15, 0); // zmniejszenie zielonego
          data[i + 2] = Math.max(data[i + 2] - 15, 0); // zmniejszenie niebieskiego
        }
		alert(data[i], data[i + 1], data[i + 2]);
      } else if (mode === "blue") {
        data[i + 2] = Math.min(data[i + 2] + blueIntensity, 255); // zwiększenie nasycenia niebieskiego
        if (data[i + 2] === 255) {
          data[i] = Math.max(data[i] - 15, 0); // zmniejszenie czerwonego
          data[i + 1] = Math.max(data[i + 1] - 15, 0); // zmniejszenie zielonego
        }
      }
    }

    context.putImageData(imageData, 0, 0);
    requestAnimationFrame(processFrame);
  }

  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: "environment" } } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        video.addEventListener("loadedmetadata", () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          processFrame();
        });
      })
      .catch((error) => {
        console.error("Błąd dostępu do kamery:", error);
      });
  }

  redHeart.onclick = () => {
    mode = "red";
    redIntensity += 10;
  };

  blueHeart.onclick = () => {
    mode = "blue";
    blueIntensity += 10;
  };

  window.onload = () => {
    startVideo();
  };

  cameraBtn.onclick = () => {};

  expandBtn.onclick = () => {
    if (!isExpanded) {
      video.classList.add("expanded");
      canvas.classList.add("canvas1");
      isExpanded = true;
      collapseBtn.style.display = "flex";
      expandBtn.style.display = "none";
      cameraBtn.style.display = "flex";
      redHeart.style.display = "flex";
      blueHeart.style.display = "flex";
    }
  };

  collapseBtn.onclick = () => {
    if (isExpanded) {
      video.classList.remove("expanded");
      canvas.classList.remove("canvas1");
      isExpanded = false;
      collapseBtn.style.display = "none";
      expandBtn.style.display = "flex";
      cameraBtn.style.display = "none";
      redHeart.style.display = "none";
      blueHeart.style.display = "none";
      mode = "normal";
    }
  };
});
