// Background service worker pour gérer les notifications et téléchargements

let downloadId = null;
let downloadFilePath = null;

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DOWNLOAD_RECORDING') {
    downloadRecording(message.blob, message.filename)
      .then(id => {
        downloadId = id;
        sendResponse({ success: true, downloadId: id });
      })
      .catch(error => {
        console.error('Erreur de téléchargement:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Permet la réponse asynchrone
  }
});

// Fonction pour télécharger l'enregistrement
async function downloadRecording(blobData, filename) {
  return new Promise((resolve, reject) => {
    // Convertir le blob en data URL si nécessaire
    const url = blobData;

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false // Télécharger directement dans le dossier Téléchargements
    }, (id) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        downloadId = id;
        resolve(id);
      }
    });
  });
}

// Écouter la fin du téléchargement
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.id === downloadId && delta.state) {
    if (delta.state.current === 'complete') {
      // Récupérer les informations du téléchargement
      chrome.downloads.search({ id: downloadId }, (results) => {
        if (results && results.length > 0) {
          downloadFilePath = results[0].filename;

          // Créer une notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Enregistrement terminé',
            message: 'Votre vidéo a été enregistrée avec succès !',
            buttons: [
              { title: 'Ouvrir le fichier' },
              { title: 'Ouvrir le dossier' }
            ],
            requireInteraction: true
          }, (notificationId) => {
            // Stocker l'association notification-download
            chrome.storage.local.set({
              [notificationId]: {
                downloadId: downloadId,
                filePath: downloadFilePath
              }
            });
          });
        }
      });
    } else if (delta.state.current === 'interrupted') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Erreur d\'enregistrement',
        message: 'Le téléchargement a été interrompu.',
        requireInteraction: false
      });
    }
  }
});

// Gérer les clics sur les boutons de notification
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  chrome.storage.local.get([notificationId], (result) => {
    const data = result[notificationId];
    if (data && data.downloadId) {
      if (buttonIndex === 0) {
        // Ouvrir le fichier
        chrome.downloads.open(data.downloadId);
      } else if (buttonIndex === 1) {
        // Ouvrir le dossier contenant le fichier
        chrome.downloads.show(data.downloadId);
      }

      // Fermer la notification
      chrome.notifications.clear(notificationId);

      // Nettoyer le storage
      chrome.storage.local.remove([notificationId]);
    }
  });
});

// Gérer le clic sur la notification elle-même
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.storage.local.get([notificationId], (result) => {
    const data = result[notificationId];
    if (data && data.downloadId) {
      // Ouvrir le dossier par défaut
      chrome.downloads.show(data.downloadId);

      // Fermer la notification
      chrome.notifications.clear(notificationId);

      // Nettoyer le storage
      chrome.storage.local.remove([notificationId]);
    }
  });
});
