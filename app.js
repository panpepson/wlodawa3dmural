document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const decodedImage = document.getElementById('decodedImage');
    const toggleCameraBtn = document.getElementById('toggleCameraBtn');
    const expandBtn = document.getElementById('expandBtn');
    const collapseBtn = document.getElementById('collapseBtn');
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

    // Obsługa kliknięcia ikony aparatu
    cameraBtn.onclick = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        decodedImage.src = imageData;
        decodedImage.style.display = 'block';

        // Zapisz zdjęcie do galerii (na urządzeniu mobilnym)
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'zdjecie.png'; // Nazwa pliku
        link.click();

        // Przełączenie kamery po zrobieniu zdjęcia
        switchCamera();
    };

    // Funkcja do uruchomienia domyślnej kamery przy starcie
    startCamera();

    // Powiększenie obrazu
    expandBtn.onclick = () => {
        if (!isExpanded) {
            video.classList.add('expanded');
            isExpanded = true;
            collapseBtn.style.display = 'flex';
            expandBtn.style.display = 'none';
            cameraBtn.style.display = 'flex'; // Pokaż ikonę aparatu
        }
    };

    // Zmniejszenie obrazu
    collapseBtn.onclick = () => {
        if (isExpanded) {
            video.classList.remove('expanded');
            isExpanded = false;
            collapseBtn.style.display = 'none';
            expandBtn.style.display = 'flex';
            cameraBtn.style.display = 'none'; // Ukryj ikonę aparatu
        }
    };
});

