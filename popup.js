// Variables globales
let mediaRecorder = null;
let recordedChunks = [];
let screenStream = null;
let micStream = null;
let tabStream = null;
let combinedStream = null;
let startTime = null;
let timerInterval = null;

// Éléments DOM
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const timerDiv = document.getElementById('timer');
const timerDisplay = document.getElementById('timerDisplay');
const microphoneCheck = document.getElementById('microphoneCheck');
const systemAudioCheck = document.getElementById('systemAudioCheck');
const warningKeepOpen = document.getElementById('warningKeepOpen');

// Événements
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

// Fonction pour mettre à jour le statut
function updateStatus(message, isError = false) {
  statusDiv.innerHTML = `<p style="color: ${isError ? '#fca5a5' : '#fff'}">${message}</p>`;
}

// Fonction pour formater le temps
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Fonction pour démarrer le timer
function startTimer() {
  startTime = Date.now();
  timerDiv.style.display = 'block';

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
}

// Fonction pour arrêter le timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerDiv.style.display = 'none';
  timerDisplay.textContent = '00:00:00';
}

// Fonction pour démarrer l'enregistrement
async function startRecording() {
  try {
    recordedChunks = [];
    updateStatus('Démarrage de l\'enregistrement...');

    // Étape 1: Capturer l'écran
    updateStatus('Sélectionnez votre écran...');
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: 'screen',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      },
      audio: systemAudioCheck.checked // Audio système depuis l'onglet
    });

    // Gérer l'arrêt de partage d'écran
    screenStream.getVideoTracks()[0].onended = () => {
      stopRecording();
    };

    // Créer un contexte audio pour mixer les flux
    const audioContext = new AudioContext();
    const audioDestination = audioContext.createMediaStreamDestination();

    // Étape 2: Ajouter l'audio du système si disponible et coché
    if (systemAudioCheck.checked) {
      const audioTracks = screenStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const systemAudioSource = audioContext.createMediaStreamSource(
          new MediaStream(audioTracks)
        );
        systemAudioSource.connect(audioDestination);
        updateStatus('Audio système capturé ✓');
      } else {
        updateStatus('⚠️ Audio système non disponible (partagez un onglet avec audio)');
      }
    }

    // Étape 3: Capturer le micro si coché
    if (microphoneCheck.checked) {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(audioDestination);
        updateStatus('Microphone capturé ✓');
      } catch (micError) {
        console.warn('Erreur microphone:', micError);
        updateStatus('⚠️ Microphone non accessible (continuons sans)');
      }
    }

    // Étape 4: Combiner vidéo et audio mixé
    const videoTrack = screenStream.getVideoTracks()[0];
    const audioTracks = audioDestination.stream.getAudioTracks();

    combinedStream = new MediaStream([videoTrack, ...audioTracks]);

    // Étape 5: Créer le MediaRecorder
    const options = {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: 2500000 // 2.5 Mbps
    };

    // Fallback si VP9 n'est pas supporté
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }

    mediaRecorder = new MediaRecorder(combinedStream, options);

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

    // Démarrer l'enregistrement avec un timeslice plus court pour éviter la perte de données
    mediaRecorder.start(100); // Chunk chaque 100ms pour capturer les enregistrements courts

    // Mettre à jour l'interface
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    statusDiv.classList.add('recording-indicator');
    warningKeepOpen.style.display = 'block'; // Afficher l'avertissement
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

// Fonction pour arrêter l'enregistrement
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    updateStatus('Traitement de la vidéo...');
    stopTimer();
  }
}

// Fonction pour sauvegarder l'enregistrement
function saveRecording() {
  if (recordedChunks.length === 0) {
    updateStatus('❌ Aucune donnée enregistrée', true);
    return;
  }

  // Créer un blob de la vidéo
  const blob = new Blob(recordedChunks, {
    type: 'video/webm'
  });

  // Créer un nom de fichier avec timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `screen-recording-${timestamp}.webm`;

  // Télécharger le fichier
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Nettoyer
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  updateStatus(`✅ Vidéo sauvegardée: ${filename}`);

  // Réinitialiser l'interface après 3 secondes
  setTimeout(() => {
    updateStatus('Prêt à enregistrer');
  }, 3000);
}

// Fonction pour nettoyer les ressources
function cleanup() {
  // Arrêter tous les flux
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    screenStream = null;
  }
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  if (tabStream) {
    tabStream.getTracks().forEach(track => track.stop());
    tabStream = null;
  }
  if (combinedStream) {
    combinedStream.getTracks().forEach(track => track.stop());
    combinedStream = null;
  }

  // Réinitialiser l'interface
  startBtn.style.display = 'block';
  stopBtn.style.display = 'none';
  statusDiv.classList.remove('recording-indicator');
  warningKeepOpen.style.display = 'none'; // Cacher l'avertissement
  stopTimer();

  // Réinitialiser le MediaRecorder
  mediaRecorder = null;
}

// Sauvegarder et nettoyer quand la popup se ferme
window.addEventListener('beforeunload', (e) => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    // Si un enregistrement est en cours, tenter de le sauvegarder
    e.preventDefault();

    // Arrêter l'enregistrement immédiatement
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }

    // Sauvegarder les données si disponibles
    if (recordedChunks.length > 0) {
      saveRecording();
    }
  }
  cleanup();
});
