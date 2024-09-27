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
    redLevel = 0,
    blueLevel = 0,
    increment = 10; // Określa, o ile zwiększamy nasycenie przy każdym naciśnięciu

  function processFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height),
      data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (mode === "red") {
        data[i] = Math.min(data[i] + redLevel, 255); // zwiększenie czerwieni
        data[i + 1] = Math.max(data[i + 1] - redLevel, 0); // zmniejszenie zielonego
        data[i + 2] = Math.max(data[i + 2] - redLevel, 0); // zmniejszenie niebieskiego
      } else if (mode === "blue") {
        data[i] = Math.max(data[i] - blueLevel, 0); // zmniejszenie czerwieni
        data[i + 1] = Math.max(data[i + 1] - blueLevel, 0); // zmniejszenie zielonego
        data[i + 2] = Math.min(data[i + 2] + blueLevel, 255); // zwiększenie niebieskiego
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
    redLevel = Math.min(redLevel + increment, 255); // Zwiększanie nasycenia czerwieni aż do 255
  };

  blueHeart.onclick = () => {
    mode = "blue";
    blueLevel = Math.min(blueLevel + increment, 255); // Zwiększanie nasycenia niebieskiego aż do 255
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
      redLevel = 0; // Resetowanie poziomu nasycenia czerwieni
      blueLevel = 0; // Resetowanie poziomu nasycenia niebieskiego
    }
  };
});
