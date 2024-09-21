document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const decodedImage = document.getElementById('decodedImage');

    const toggleCameraBtn = document.getElementById('toggleCameraBtn');
    const expandBtn = document.getElementById('expandBtn');
    const collapseBtn = document.getElementById('collapseBtn');
    const redHeart = document.getElementById('redHeart');
    const blueHeart = document.getElementById('blueHeart');
    const cameraBtn = document.getElementById('cameraBtn');

    let isExpanded = false;
    let currentStream = null;
    let videoDevices = [];
    let currentCameraIndex = 0;

    // Funkcja uruchamiania kamery
    async function startCamera(deviceId = null) {
        const constraints = {
            video: deviceId ? { deviceId: { exact: deviceId } } : true
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            currentStream = stream;
        } catch (error) {
            console.error('Błąd uruchamiania kamery:', error);
        }
    }

    // Zatrzymanie bieżącego strumienia
    function stopCurrentStream() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
    }

    // Funkcja przełączania kamer
    async function switchCamera() {
        if (videoDevices.length === 0) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            videoDevices = devices.filter(device => device.kind === 'videoinput');
        }

        if (videoDevices.length > 1) {
            // Przełączanie między kamerami
            currentCameraIndex = (currentCameraIndex + 1) % videoDevices.length;
            stopCurrentStream();
            await startCamera(videoDevices[currentCameraIndex].deviceId);
        }
    }

    // Obsługa kliknięcia przycisku przełączania kamery
    toggleCameraBtn.onclick = switchCamera;

    // Ustawienia kanwy
    canvas.width = 1280;
    canvas.height = 720;

    // Obsługa kliknięcia ikony aparatu
    cameraBtn.onclick = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        decodedImage.src = imageData;
        decodedImage.style.display = 'block';

        // Tworzenie linku do pobrania
        const link = document.createElement('a');
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        link.href = imageData;
        link.download = `zdjecie_${formattedDate}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Przełączenie kamery po zrobieniu zdjęcia
        switchCamera();
    };

    // Funkcja aplikująca czerwony filtr
    function applyRedFilter() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] += 100; // Zwiększenie czerwieni
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Funkcja aplikująca niebieski filtr
    function applyBlueFilter() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i + 2] += 100; // Zwiększenie niebieskiego
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Przypisywanie funkcji filtrowania do ikon serc
    redHeart.onclick = applyRedFilter;
    blueHeart.onclick = applyBlueFilter;

    // Funkcja do uruchomienia domyślnej kamery przy starcie
    startCamera();

    // Powiększenie obrazu
    expandBtn.onclick = () => {
        if (!isExpanded) {
            video.classList.add('expanded');
            isExpanded = true;
            collapseBtn.style.display = 'flex';
            expandBtn.style.display = 'none';
            cameraBtn.style.display = 'flex';

            // Pokaż ikony serc, gdy obraz jest powiększony
            redHeart.style.display = 'flex';
            blueHeart.style.display = 'flex';
        }
    };

    // Zmniejszenie obrazu
    collapseBtn.onclick = () => {
        if (isExpanded) {
            video.classList.remove('expanded');
            isExpanded = false;
            collapseBtn.style.display = 'none';
            expandBtn.style.display = 'flex';
            cameraBtn.style.display = 'none';

            // Ukryj ikony serc, gdy obraz jest pomniejszony
            redHeart.style.display = 'none';
            blueHeart.style.display = 'none';
        }
    };
});

