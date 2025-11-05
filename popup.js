// ========================================
// Variables globales
// ========================================
let mediaRecorder = null;
let recordedChunks = [];
let screenStream = null;
let webcamStream = null;
let micStream = null;
let combinedStream = null;
let canvasStream = null;
let startTime = null;
let timerInterval = null;
let canvas = null;
let canvasContext = null;
let animationId = null;

// ========================================
// Éléments DOM
// ========================================
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const timerDiv = document.getElementById('timer');
const timerDisplay = document.getElementById('timerDisplay');

// Checkboxes
const webcamCheck = document.getElementById('webcamCheck');
const microphoneCheck = document.getElementById('microphoneCheck');
const systemAudioCheck = document.getElementById('systemAudioCheck');

// Sélecteurs de périphériques
const webcamSelect = document.getElementById('webcamSelect');
const micSelect = document.getElementById('micSelect');
const webcamDeviceContainer = document.getElementById('webcamDeviceContainer');
const micDeviceContainer = document.getElementById('micDeviceContainer');

// ========================================
// Initialisation
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  enumerateDevices();
  setupEventListeners();
});

// ========================================
// Configuration des événements
// ========================================
function setupEventListeners() {
  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);

  // Afficher/masquer le sélecteur de webcam
  webcamCheck.addEventListener('change', (e) => {
    webcamDeviceContainer.style.display = e.target.checked ? 'block' : 'none';
    if (e.target.checked) {
      // Rafraîchir la liste avec les vrais noms des périphériques
      refreshDevicesWithPermission();
    }
  });

  // Afficher/masquer le sélecteur de micro
  microphoneCheck.addEventListener('change', (e) => {
    micDeviceContainer.style.display = e.target.checked ? 'block' : 'none';
    if (e.target.checked) {
      // Rafraîchir la liste avec les vrais noms des périphériques
      refreshDevicesWithPermission();
    }
  });
}

// ========================================
// Énumération des périphériques
// ========================================
async function enumerateDevices() {
  try {
    // Lister les périphériques disponibles (sans labels au départ)
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Périphériques vidéo (webcams)
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    webcamSelect.innerHTML = '<option value="">Sélectionner une webcam...</option>';

    if (videoDevices.length > 0) {
      // Ajouter une option pour utiliser la webcam par défaut (sélectionnée par défaut)
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.text = 'Webcam par défaut';
      defaultOption.selected = true;
      webcamSelect.appendChild(defaultOption);

      videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Webcam ${index + 1}`;
        webcamSelect.appendChild(option);
      });
    } else {
      // Pas de webcam détectée, ajouter quand même l'option par défaut
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.text = 'Webcam par défaut';
      defaultOption.selected = true;
      webcamSelect.appendChild(defaultOption);
    }

    // Périphériques audio (microphones)
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    micSelect.innerHTML = '<option value="">Sélectionner un microphone...</option>';

    if (audioDevices.length > 0) {
      // Ajouter une option pour utiliser le micro par défaut (sélectionné par défaut)
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.text = 'Microphone par défaut';
      defaultOption.selected = true;
      micSelect.appendChild(defaultOption);

      audioDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Microphone ${index + 1}`;
        micSelect.appendChild(option);
      });
    } else {
      // Pas de micro détecté, ajouter quand même l'option par défaut
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.text = 'Microphone par défaut';
      defaultOption.selected = true;
      micSelect.appendChild(defaultOption);
    }

  } catch (error) {
    console.warn('Erreur lors de l\'énumération des périphériques:', error);
    // Ne pas bloquer l'interface, juste ajouter les options par défaut
    webcamSelect.innerHTML = '<option value="">Sélectionner une webcam...</option><option value="default" selected>Webcam par défaut</option>';
    micSelect.innerHTML = '<option value="">Sélectionner un microphone...</option><option value="default" selected>Microphone par défaut</option>';
  }
}

// Rafraîchir la liste des périphériques avec leurs vrais noms
async function refreshDevicesWithPermission() {
  try {
    // Demander les permissions pour obtenir les vrais noms
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach(track => track.stop());

    // Maintenant on peut lister les périphériques avec leurs labels
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Mettre à jour les webcams
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const currentWebcamValue = webcamSelect.value;
    webcamSelect.innerHTML = '<option value="">Sélectionner une webcam...</option>';

    const defaultWebcamOption = document.createElement('option');
    defaultWebcamOption.value = 'default';
    defaultWebcamOption.text = 'Webcam par défaut';
    if (currentWebcamValue === 'default') defaultWebcamOption.selected = true;
    webcamSelect.appendChild(defaultWebcamOption);

    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Webcam ${index + 1}`;
      if (device.deviceId === currentWebcamValue) option.selected = true;
      webcamSelect.appendChild(option);
    });

    // Mettre à jour les microphones
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const currentMicValue = micSelect.value;
    micSelect.innerHTML = '<option value="">Sélectionner un microphone...</option>';

    const defaultMicOption = document.createElement('option');
    defaultMicOption.value = 'default';
    defaultMicOption.text = 'Microphone par défaut';
    if (currentMicValue === 'default') defaultMicOption.selected = true;
    micSelect.appendChild(defaultMicOption);

    audioDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Microphone ${index + 1}`;
      if (device.deviceId === currentMicValue) option.selected = true;
      micSelect.appendChild(option);
    });
  } catch (error) {
    console.warn('Impossible d\'obtenir les noms des périphériques:', error);
  }
}

// ========================================
// Gestion de l'interface
// ========================================
function updateStatus(message, isError = false) {
  statusDiv.innerHTML = `<p style="color: ${isError ? '#fca5a5' : '#fff'}">${message}</p>`;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  startTime = Date.now();
  timerDiv.style.display = 'block';

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerDiv.style.display = 'none';
  timerDisplay.textContent = '00:00:00';
}

// ========================================
// Obtenir la résolution sélectionnée
// ========================================
function getSelectedResolution() {
  const resolutionRadio = document.querySelector('input[name="resolution"]:checked');
  const resolution = parseInt(resolutionRadio.value);

  const resolutions = {
    1080: { width: 1920, height: 1080 },
    1440: { width: 2560, height: 1440 },
    2160: { width: 3840, height: 2160 }
  };

  return resolutions[resolution];
}

// ========================================
// Obtenir le framerate sélectionné
// ========================================
function getSelectedFramerate() {
  const framerateRadio = document.querySelector('input[name="framerate"]:checked');
  return parseInt(framerateRadio.value);
}

// ========================================
// Démarrage de l'enregistrement
// ========================================
async function startRecording() {
  try {
    recordedChunks = [];
    updateStatus('Démarrage de l\'enregistrement...');

    const resolution = getSelectedResolution();
    const framerate = getSelectedFramerate();

    // Étape 1: Capturer l'écran
    updateStatus('Sélectionnez votre écran...');
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        frameRate: { ideal: framerate }
      },
      audio: systemAudioCheck.checked
    });

    // Gérer l'arrêt de partage d'écran
    screenStream.getVideoTracks()[0].onended = () => {
      stopRecording();
    };

    // Étape 2: Capturer la webcam si demandé
    if (webcamCheck.checked) {
      const webcamDeviceId = webcamSelect.value;
      if (!webcamDeviceId) {
        updateStatus('⚠️ Veuillez sélectionner une webcam', true);
        cleanup();
        return;
      }

      try {
        // Configuration vidéo
        const videoConfig = {
          width: { ideal: 320 },
          height: { ideal: 240 }
        };

        // Ajouter le deviceId seulement si ce n'est pas "default"
        if (webcamDeviceId !== 'default') {
          videoConfig.deviceId = { exact: webcamDeviceId };
        }

        webcamStream = await navigator.mediaDevices.getUserMedia({
          video: videoConfig,
          audio: false
        });
        updateStatus('Webcam capturée ✓');
      } catch (error) {
        console.warn('Erreur webcam:', error);
        updateStatus('⚠️ Impossible de capturer la webcam', true);
        cleanup();
        return;
      }
    }

    // Étape 3: Créer le contexte audio pour mixer
    const audioContext = new AudioContext();
    const audioDestination = audioContext.createMediaStreamDestination();

    // Ajouter l'audio système si disponible
    if (systemAudioCheck.checked) {
      const audioTracks = screenStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const systemAudioSource = audioContext.createMediaStreamSource(
          new MediaStream(audioTracks)
        );
        systemAudioSource.connect(audioDestination);
        updateStatus('Audio système capturé ✓');
      } else {
        updateStatus('⚠️ Audio système non disponible');
      }
    }

    // Ajouter le microphone si demandé
    if (microphoneCheck.checked) {
      const micDeviceId = micSelect.value;
      if (!micDeviceId) {
        updateStatus('⚠️ Veuillez sélectionner un microphone', true);
        cleanup();
        return;
      }

      try {
        // Configuration audio
        const audioConfig = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        };

        // Ajouter le deviceId seulement si ce n'est pas "default"
        if (micDeviceId !== 'default') {
          audioConfig.deviceId = { exact: micDeviceId };
        }

        micStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConfig
        });

        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(audioDestination);
        updateStatus('Microphone capturé ✓');
      } catch (error) {
        console.warn('Erreur microphone:', error);
        updateStatus('⚠️ Impossible de capturer le microphone', true);
        cleanup();
        return;
      }
    }

    // Étape 4: Créer le canvas pour combiner écran + webcam
    if (webcamCheck.checked && webcamStream) {
      canvasStream = await createCanvasWithWebcam(screenStream, webcamStream, resolution);
    } else {
      canvasStream = screenStream;
    }

    // Étape 5: Combiner vidéo et audio
    const videoTrack = canvasStream.getVideoTracks()[0];
    const audioTracks = audioDestination.stream.getAudioTracks();
    combinedStream = new MediaStream([videoTrack, ...audioTracks]);

    // Étape 6: Créer le MediaRecorder avec haute qualité
    const bitrate = resolution.height >= 2160 ? 20000000 : // 4K: 20 Mbps
                    resolution.height >= 1440 ? 12000000 : // 1440p: 12 Mbps
                    8000000; // 1080p: 8 Mbps

    const options = {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: bitrate,
      audioBitsPerSecond: 128000
    };

    // Fallback si VP9 n'est pas supporté
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }

    mediaRecorder = new MediaRecorder(combinedStream, options);

    // Enregistrer les chunks au fur et à mesure
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      saveRecording();
      cleanup();
    };

    mediaRecorder.onerror = (event) => {
      console.error('Erreur MediaRecorder:', event.error);
      updateStatus('❌ Erreur d\'enregistrement', true);
      cleanup();
    };

    // Démarrer l'enregistrement avec des chunks de 10 secondes
    // Cela permet un enregistrement illimité sans problème de mémoire
    mediaRecorder.start(10000);

    // Mettre à jour l'interface
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    statusDiv.classList.add('recording-indicator');
    updateStatus('🔴 Enregistrement en cours...');
    startTimer();

  } catch (error) {
    console.error('Erreur de démarrage:', error);

    let errorMessage = '❌ Erreur: ';
    if (error.name === 'NotAllowedError') {
      errorMessage += 'Permission refusée';
    } else if (error.name === 'NotFoundError') {
      errorMessage += 'Aucun périphérique trouvé';
    } else {
      errorMessage += error.message;
    }

    updateStatus(errorMessage, true);
    cleanup();
  }
}

// ========================================
// Créer un canvas avec incrustation webcam
// ========================================
async function createCanvasWithWebcam(screenStream, webcamStream, resolution) {
  return new Promise((resolve) => {
    // Créer le canvas
    canvas = document.createElement('canvas');
    canvas.width = resolution.width;
    canvas.height = resolution.height;
    canvasContext = canvas.getContext('2d');

    // Créer les éléments vidéo
    const screenVideo = document.createElement('video');
    const webcamVideo = document.createElement('video');

    screenVideo.srcObject = screenStream;
    webcamVideo.srcObject = webcamStream;

    screenVideo.play();
    webcamVideo.play();

    // Taille et position de la webcam (15% de la largeur, en bas à gauche)
    const webcamWidth = resolution.width * 0.15;
    const webcamHeight = webcamWidth * (3 / 4); // Ratio 4:3
    const margin = 20;
    const webcamX = margin;
    const webcamY = resolution.height - webcamHeight - margin;

    // Fonction de dessin
    function drawFrame() {
      // Dessiner l'écran
      canvasContext.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      // Dessiner la webcam avec bordure arrondie
      canvasContext.save();

      // Créer un chemin arrondi
      const radius = 10;
      canvasContext.beginPath();
      canvasContext.moveTo(webcamX + radius, webcamY);
      canvasContext.lineTo(webcamX + webcamWidth - radius, webcamY);
      canvasContext.quadraticCurveTo(webcamX + webcamWidth, webcamY, webcamX + webcamWidth, webcamY + radius);
      canvasContext.lineTo(webcamX + webcamWidth, webcamY + webcamHeight - radius);
      canvasContext.quadraticCurveTo(webcamX + webcamWidth, webcamY + webcamHeight, webcamX + webcamWidth - radius, webcamY + webcamHeight);
      canvasContext.lineTo(webcamX + radius, webcamY + webcamHeight);
      canvasContext.quadraticCurveTo(webcamX, webcamY + webcamHeight, webcamX, webcamY + webcamHeight - radius);
      canvasContext.lineTo(webcamX, webcamY + radius);
      canvasContext.quadraticCurveTo(webcamX, webcamY, webcamX + radius, webcamY);
      canvasContext.closePath();
      canvasContext.clip();

      // Dessiner la webcam
      canvasContext.drawImage(webcamVideo, webcamX, webcamY, webcamWidth, webcamHeight);

      canvasContext.restore();

      // Ajouter une bordure
      canvasContext.strokeStyle = '#ffffff';
      canvasContext.lineWidth = 3;
      canvasContext.beginPath();
      canvasContext.moveTo(webcamX + radius, webcamY);
      canvasContext.lineTo(webcamX + webcamWidth - radius, webcamY);
      canvasContext.quadraticCurveTo(webcamX + webcamWidth, webcamY, webcamX + webcamWidth, webcamY + radius);
      canvasContext.lineTo(webcamX + webcamWidth, webcamY + webcamHeight - radius);
      canvasContext.quadraticCurveTo(webcamX + webcamWidth, webcamY + webcamHeight, webcamX + webcamWidth - radius, webcamY + webcamHeight);
      canvasContext.lineTo(webcamX + radius, webcamY + webcamHeight);
      canvasContext.quadraticCurveTo(webcamX, webcamY + webcamHeight, webcamX, webcamY + webcamHeight - radius);
      canvasContext.lineTo(webcamX, webcamY + radius);
      canvasContext.quadraticCurveTo(webcamX, webcamY, webcamX + radius, webcamY);
      canvasContext.stroke();

      animationId = requestAnimationFrame(drawFrame);
    }

    // Attendre que les vidéos soient prêtes
    Promise.all([
      new Promise(resolve => screenVideo.onloadedmetadata = resolve),
      new Promise(resolve => webcamVideo.onloadedmetadata = resolve)
    ]).then(() => {
      drawFrame();
      const stream = canvas.captureStream(getSelectedFramerate());
      resolve(stream);
    });
  });
}

// ========================================
// Arrêt de l'enregistrement
// ========================================
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    updateStatus('Traitement de la vidéo...');
    stopTimer();
  }
}

// ========================================
// Sauvegarde de l'enregistrement
// ========================================
async function saveRecording() {
  if (recordedChunks.length === 0) {
    updateStatus('❌ Aucune donnée enregistrée', true);
    return;
  }

  updateStatus('Préparation du téléchargement...');

  // Créer un blob de la vidéo
  const blob = new Blob(recordedChunks, {
    type: 'video/webm'
  });

  const resolution = getSelectedResolution();
  const resolutionLabel = resolution.height === 2160 ? '4K' :
                          resolution.height === 1440 ? '2K' :
                          '1080p';

  // Créer un nom de fichier avec timestamp et résolution
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `recording-${resolutionLabel}-${timestamp}.webm`;

  // Convertir le blob en data URL
  const reader = new FileReader();
  reader.onloadend = async () => {
    const dataUrl = reader.result;

    // Envoyer au background script pour téléchargement
    try {
      chrome.runtime.sendMessage({
        type: 'DOWNLOAD_RECORDING',
        blob: dataUrl,
        filename: filename
      }, (response) => {
        if (response && response.success) {
          updateStatus(`✅ Vidéo enregistrée: ${filename}`);

          // Réinitialiser après 3 secondes
          setTimeout(() => {
            updateStatus('Prêt à enregistrer');
          }, 3000);
        } else {
          updateStatus('❌ Erreur lors du téléchargement', true);
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
      updateStatus('❌ Erreur lors du téléchargement', true);
    }
  };
  reader.readAsDataURL(blob);
}

// ========================================
// Nettoyage des ressources
// ========================================
function cleanup() {
  // Arrêter l'animation du canvas
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Arrêter tous les flux
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    screenStream = null;
  }
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  if (combinedStream) {
    combinedStream.getTracks().forEach(track => track.stop());
    combinedStream = null;
  }
  if (canvasStream) {
    canvasStream.getTracks().forEach(track => track.stop());
    canvasStream = null;
  }

  // Nettoyer le canvas
  if (canvas) {
    canvas = null;
    canvasContext = null;
  }

  // Réinitialiser l'interface
  startBtn.style.display = 'block';
  stopBtn.style.display = 'none';
  statusDiv.classList.remove('recording-indicator');
  stopTimer();

  // Réinitialiser le MediaRecorder
  mediaRecorder = null;
  recordedChunks = [];
}

// ========================================
// Nettoyer lors de la fermeture
// ========================================
window.addEventListener('unload', () => {
  cleanup();
});
