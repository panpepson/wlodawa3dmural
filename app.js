document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const redHeart = document.getElementById('redHeart');
    const blueHeart = document.getElementById('blueHeart');
    const expandBtn = document.getElementById('expandBtn');
    const collapseBtn = document.getElementById('collapseBtn');
    const cameraBtn = document.getElementById('cameraBtn');

    let isExpanded = false;
    let kolor = 'normal'; // 'red', 'blue', 'normal'
    let redIntensity = 0;  // Początkowe zwiększenie czerwieni
    let blueIntensity = 0; // Początkowe zwiększenie niebieskiego

    function drawVideoToCanvas() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (kolor === 'red') {
                data[i] = Math.min(data[i] + redIntensity, 255);   // Czerwony kanał (R), max 255
                data[i + 1] = Math.max(data[i + 1] - 1, 0);        // Zielony kanał (G)
                data[i + 2] = Math.max(data[i + 2] - 1, 0);        // Niebieski kanał (B)
            } else if (kolor === 'blue') {
                data[i] = Math.max(data[i] - 5, 0);                // Czerwony kanał (R)
                data[i + 1] = Math.max(data[i + 1] - 1, 0);        // Zielony kanał (G)
                data[i + 2] = Math.min(data[i + 2] + blueIntensity, 255); // Niebieski kanał (B)
            }
        }

        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(drawVideoToCanvas);
    }

    function initCameraStream() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                video.srcObject = stream;
                video.play();

                video.addEventListener('loadedmetadata', () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    drawVideoToCanvas();
                });
            })
            .catch(error => {
                console.error('Błąd dostępu do kamery:', error);
            });
    }

    redHeart.onclick = () => {
        kolor = 'red';
        redIntensity += 10;
    };

    blueHeart.onclick = () => {
        kolor = 'blue';
        blueIntensity += 10;
    };

    expandBtn.onclick = () => {
        if (!isExpanded) {
            video.classList.add('expanded');
            canvas.classList.add('canvas1');
            isExpanded = true;
            collapseBtn.style.display = 'flex';
            expandBtn.style.display = 'none';
            cameraBtn.style.display = 'flex';
            redHeart.style.display = 'flex';
            blueHeart.style.display = 'flex';
        }
    };

    collapseBtn.onclick = () => {
        if (isExpanded) {
            video.classList.remove('expanded');
            canvas.classList.remove('canvas1');
            isExpanded = false;
            collapseBtn.style.display = 'none';
            expandBtn.style.display = 'flex';
            cameraBtn.style.display = 'none';
            redHeart.style.display = 'none';
            blueHeart.style.display = 'none';
            kolor = 'normal';
        }
    };

    window.onload = () => {
        initCameraStream();
    };
});
