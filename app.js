document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context  = canvas.getContext('2d', { willReadFrequently: true });
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
    let kolor = 'normal';  // 'red', 'blue', 'normal'

    // Zmienne śledzące intensywność koloru
    let redIntensity = 0;  // Początkowe zwiększenie czerwieni
    let blueIntensity = 0; // Początkowe zwiększenie niebieskiego

function drawVideoToCanvas() {
    // Rysowanie obrazu z kamery
     context.drawImage(video, 0, 0, canvas.width, canvas.height);
     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
    if (kolor === 'red') {
                // Zwiększ czerwoną intensywność o redIntensity
                data[i] = Math.min(data[i] + redIntensity, 255);   // Czerwony kanał (R), max 255
                data[i + 1] = Math.max(data[i + 1] - 5, 0);        // Zielony kanał (G)
                data[i + 2] = Math.max(data[i + 2] - 1, 0);        // Niebieski kanał (B)
            } else if (kolor === 'blue') {
                // Zwiększ niebieską intensywność o blueIntensity
                data[i] = Math.max(data[i] - 5, 0);                // Czerwony kanał (R)
                data[i + 1] = Math.max(data[i + 1] - 5, 0);        // Zielony kanał (G)
                data[i + 2] = Math.min(data[i + 2] + blueIntensity, 255); //
        } else if (kolor === 'normal') {
           }
    }
    // Nakładamy zmienione piksele z powrotem na canvas
    context.putImageData(imageData, 0, 0);
    // Wywołanie pętli renderowania, aby obraz był dynamicznie aktualizowany
    requestAnimationFrame(drawVideoToCanvas);
    
}


// Inicjalizacja wideo z kamery, preferując tylną kamerę (environment)
function initCameraStream() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: 'environment' }  // Preferencja kamery tylnej
        }
    })
    .then(stream => {
        video.srcObject = stream;
        video.play();

        // Po uruchomieniu wideo dopasuj rozmiar canvasu
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



    // Przypisywanie funkcji filtrowania do ikon serc
    redHeart.onclick = () => {
        kolor = 'red';  // Ustawienie filtra na czerwony
          redIntensity += 10;  // Zwiększenie intensywności czerwonego o 10
      };
    blueHeart.onclick = () => {
        kolor = 'blue';  // Ustawienie filtra na niebieski
          blueIntensity += 10;  // Zwiększenie intensywnności niebieskiego o 10
      };



// Inicjalizacja po załadowaniu strony
window.onload = () => {
   initCameraStream();
 };

    // Obsługa kliknięcia ikony aparatu
    cameraBtn.onclick = () => {  };


    // Powiększenie obrazu
    expandBtn.onclick = () => {
        if (!isExpanded) {
            video.classList.add('expanded');
           canvas.classList.add('canvas1');
            
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
            canvas.classList.remove('canvas1');
            isExpanded = false;
            collapseBtn.style.display = 'none';
            expandBtn.style.display = 'flex';
            cameraBtn.style.display = 'none';

            // Ukryj ikony serc, gdy obraz jest pomniejszony
            redHeart.style.display = 'none';
            blueHeart.style.display = 'none';
            kolor = 'normal';
        }
    };
});
