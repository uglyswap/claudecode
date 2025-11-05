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

// Boutons de rafraîchissement
const refreshWebcamBtn = document.getElementById('refreshWebcamBtn');
const refreshMicBtn = document.getElementById('refreshMicBtn');

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
  });

  // Afficher/masquer le sélecteur de micro
  microphoneCheck.addEventListener('change', (e) => {
    micDeviceContainer.style.display = e.target.checked ? 'block' : 'none';
  });

  // Boutons de rafraîchissement
  refreshWebcamBtn.addEventListener('click', refreshDeviceLabels);
  refreshMicBtn.addEventListener('click', refreshDeviceLabels);
}

// ========================================
// Énumération des périphériques
// ========================================
async function enumerateDevices() {
  try {
    // Lister les périphériques sans demander de permissions (labels génériques)
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Webcams
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    webcamSelect.innerHTML = '<option value="default" selected>Webcam par défaut</option>';

    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Webcam ${index + 1}`;
      webcamSelect.appendChild(option);
    });

    // Microphones
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    micSelect.innerHTML = '<option value="default" selected>Microphone par défaut</option>';

    audioDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Microphone ${index + 1}`;
      micSelect.appendChild(option);
    });

    // Ajouter un message si pas de labels
    if (videoDevices.length > 0 && !videoDevices[0].label) {
      const hintOption = document.createElement('option');
      hintOption.disabled = true;
      hintOption.text = '───────────────────────';
      webcamSelect.appendChild(hintOption);

      const hintOption2 = document.createElement('option');
      hintOption2.disabled = true;
      hintOption2.text = '💡 Cliquez "Voir les noms" pour identifier vos périphériques';
      webcamSelect.appendChild(hintOption2);
    }

    if (audioDevices.length > 0 && !audioDevices[0].label) {
      const hintOption = document.createElement('option');
      hintOption.disabled = true;
      hintOption.text = '───────────────────────';
      micSelect.appendChild(hintOption);

      const hintOption2 = document.createElement('option');
      hintOption2.disabled = true;
      hintOption2.text = '💡 Cliquez "Voir les noms" pour identifier vos périphériques';
      micSelect.appendChild(hintOption2);
    }

  } catch (error) {
    console.warn('Erreur énumération:', error);
    webcamSelect.innerHTML = '<option value="default" selected>Webcam par défaut</option>';
    micSelect.innerHTML = '<option value="default" selected>Microphone par défaut</option>';
  }
}

// Rafraîchir avec les vrais noms des périphériques
async function refreshDeviceLabels() {
  try {
    // Demander les permissions pour obtenir les labels
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach(track => track.stop());

    // Relister avec les vrais noms
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Sauvegarder les valeurs actuelles
    const currentWebcam = webcamSelect.value;
    const currentMic = micSelect.value;

    // Webcams
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    webcamSelect.innerHTML = '<option value="default">Webcam par défaut</option>';

    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Webcam ${index + 1}`;
      if (device.deviceId === currentWebcam) option.selected = true;
      webcamSelect.appendChild(option);
    });

    // Restaurer la sélection
    if (currentWebcam === 'default') webcamSelect.value = 'default';

    // Microphones
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    micSelect.innerHTML = '<option value="default">Microphone par défaut</option>';

    audioDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Microphone ${index + 1}`;
      if (device.deviceId === currentMic) option.selected = true;
      micSelect.appendChild(option);
    });

    // Restaurer la sélection
    if (currentMic === 'default') micSelect.value = 'default';

    updateStatus('✅ Noms des périphériques chargés !');
    setTimeout(() => updateStatus('Prêt à enregistrer'), 2000);

  } catch (error) {
    console.error('Erreur permissions:', error);

    if (error.name === 'NotAllowedError') {
      updateStatus('ℹ️ Pas de problème ! Utilisez les périphériques par défaut');
    } else {
      updateStatus('⚠️ Impossible d\'obtenir les noms. Utilisez "par défaut"', true);
    }

    setTimeout(() => updateStatus('Prêt à enregistrer'), 3000);
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
      try {
        const webcamDeviceId = webcamSelect.value;

        // Configuration vidéo
        const videoConfig = {
          width: { ideal: 320 },
          height: { ideal: 240 }
        };

        // Ajouter le deviceId si ce n'est pas "default"
        if (webcamDeviceId && webcamDeviceId !== 'default') {
          videoConfig.deviceId = { exact: webcamDeviceId };
        }

        webcamStream = await navigator.mediaDevices.getUserMedia({
          video: videoConfig,
          audio: false
        });
        updateStatus('Webcam capturée ✓');
      } catch (error) {
        console.error('Erreur webcam:', error);

        let errorMsg = '⚠️ Erreur webcam: ';
        if (error.name === 'NotAllowedError') {
          errorMsg += 'Permission refusée. Autorisez l\'accès à la webcam.';
        } else if (error.name === 'NotFoundError') {
          errorMsg += 'Aucune webcam détectée sur cet ordinateur.';
        } else if (error.name === 'NotReadableError') {
          errorMsg += 'Webcam déjà utilisée par une autre application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMsg += 'Périphérique sélectionné non disponible. Utilisez "Webcam par défaut".';
        } else {
          errorMsg += error.message;
        }

        updateStatus(errorMsg, true);
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
      try {
        const micDeviceId = micSelect.value;

        // Configuration audio
        const audioConfig = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        };

        // Ajouter le deviceId si ce n'est pas "default"
        if (micDeviceId && micDeviceId !== 'default') {
          audioConfig.deviceId = { exact: micDeviceId };
        }

        micStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConfig
        });

        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(audioDestination);
        updateStatus('Microphone capturé ✓');
      } catch (error) {
        console.error('Erreur microphone:', error);

        let errorMsg = '⚠️ Erreur microphone: ';
        if (error.name === 'NotAllowedError') {
          errorMsg += 'Permission refusée. Autorisez l\'accès au microphone.';
        } else if (error.name === 'NotFoundError') {
          errorMsg += 'Aucun microphone détecté sur cet ordinateur.';
        } else if (error.name === 'NotReadableError') {
          errorMsg += 'Microphone déjà utilisé par une autre application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMsg += 'Périphérique sélectionné non disponible. Utilisez "Microphone par défaut".';
        } else {
          errorMsg += error.message;
        }

        updateStatus(errorMsg, true);
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
