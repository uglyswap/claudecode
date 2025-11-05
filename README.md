# 🎥 Screen & Audio Recorder 4K Pro - Extension Chrome

Extension Chrome professionnelle pour enregistrer votre écran en **4K sans limite de durée** avec incrustation webcam et contrôle total des périphériques audio/vidéo.

## ✨ Fonctionnalités principales

### 📐 Qualité d'enregistrement professionnelle
- **Résolutions multiples** : 1080p (Full HD), 1440p (2K), 2160p (4K)
- **Framerate ajustable** : 30 FPS ou 60 FPS
- **Bitrate optimisé** : Jusqu'à 20 Mbps pour la 4K
- **Codec VP9/Opus** : Meilleure compression et qualité
- **Durée illimitée** : Enregistrez aussi longtemps que vous avez d'espace disque

### 🎬 Incrustation webcam
- Webcam incrustée en bas à gauche avec bordure arrondie
- Sélection du périphérique webcam spécifique
- Taille automatiquement proportionnelle à la résolution
- Activation/désactivation facile

### 🔊 Gestion audio avancée
- **Audio système** : Capture le son de l'onglet/navigateur
- **Microphone** : Sélection du périphérique spécifique (micro casque, micro webcam, etc.)
- **Mixing audio** : Combine toutes les sources audio sélectionnées
- **Qualité optimale** : Réduction de bruit, annulation d'écho, contrôle de gain automatique

### 💾 Téléchargement intelligent
- Sauvegarde automatique dans le dossier **Téléchargements**
- Nom de fichier avec timestamp et résolution
- **Notification interactive** après enregistrement avec options :
  - Ouvrir le fichier enregistré
  - Ouvrir le dossier contenant le fichier
- Pas de limite de taille de fichier

### 🎯 Interface utilisateur intuitive
- Sélection facile de la résolution
- Choix des périphériques audio et vidéo
- Timer en temps réel
- Indicateur d'enregistrement visuel
- Messages de statut clairs

## 📦 Installation

### 1. Cloner ou télécharger le projet

```bash
git clone <votre-repo>
cd claudecode
```

### 2. Charger l'extension dans Chrome

1. Ouvrez Chrome et allez à `chrome://extensions/`
2. Activez le **Mode développeur** (en haut à droite)
3. Cliquez sur **Charger l'extension non empaquetée**
4. Sélectionnez le dossier du projet (`claudecode`)
5. L'extension apparaît dans votre barre d'outils

## 🚀 Utilisation

### Configuration de l'enregistrement

1. **Cliquez sur l'icône de l'extension** dans votre barre d'outils Chrome

2. **Choisissez la résolution vidéo** :
   - 1080p (Full HD) - Recommandé pour la plupart des usages
   - 1440p (2K) - Qualité supérieure
   - 2160p (4K) - Qualité professionnelle maximale

3. **Choisissez le framerate** :
   - 30 FPS - Standard, fichiers plus légers
   - 60 FPS - Fluidité maximale pour les jeux/animations

4. **Configuration de la webcam** (optionnel) :
   - Cochez "Incrustation webcam (bas gauche)"
   - Sélectionnez votre webcam dans la liste déroulante

5. **Configuration audio** :
   - **Audio système (onglet)** : Pour capturer le son du navigateur
   - **Microphone** : Cochez et sélectionnez votre micro (casque, webcam, etc.)

### Démarrage de l'enregistrement

1. Cliquez sur **"Démarrer l'enregistrement"**
2. Sélectionnez ce que vous voulez partager :
   - **Onglet entier** : Recommandé pour l'audio du navigateur
   - **Fenêtre** : Capturez une application spécifique
   - **Écran entier** : Capturez tout votre écran
3. **Important** : Pour l'audio système, cochez "Partager l'audio de l'onglet"
4. L'enregistrement démarre avec le timer
5. Utilisez votre application normalement

### Fin de l'enregistrement

1. Cliquez sur **"Arrêter l'enregistrement"**
2. L'extension traite et télécharge automatiquement la vidéo
3. Une **notification** apparaît avec deux boutons :
   - **Ouvrir le fichier** : Lance la lecture de la vidéo
   - **Ouvrir le dossier** : Ouvre le dossier Téléchargements
4. Le fichier est nommé : `recording-[résolution]-[date-heure].webm`

## 📋 Cas d'usage

### 🎤 Démo d'agent IA vocal (ElevenLabs, etc.)

1. Ouvrez votre application avec l'agent vocal
2. Configuration :
   - Résolution : 1080p ou 1440p
   - Framerate : 30 FPS
   - Webcam : Activée (pour vous voir)
   - Audio système : Activé
   - Microphone : Sélectionnez votre micro casque
3. Lancez l'enregistrement et sélectionnez l'onglet
4. Interagissez avec l'agent vocal
5. Arrêtez et récupérez votre vidéo complète

### 🎮 Enregistrement de gameplay

1. Configuration :
   - Résolution : 1440p ou 4K
   - Framerate : 60 FPS
   - Webcam : Optionnelle
   - Audio système : Activé
   - Microphone : Optionnel pour les commentaires
2. Sélectionnez la fenêtre du jeu
3. Jouez normalement
4. Arrêtez quand vous voulez

### 📚 Tutoriel / Formation

1. Configuration :
   - Résolution : 1080p
   - Framerate : 30 FPS
   - Webcam : Activée (contact visuel avec les spectateurs)
   - Microphone : Activé
2. Sélectionnez l'écran ou la fenêtre
3. Présentez votre contenu
4. Arrêtez et récupérez la vidéo

### 💼 Présentation professionnelle

1. Configuration :
   - Résolution : 1440p ou 4K
   - Framerate : 30 FPS
   - Webcam : Activée
   - Microphone : Micro casque pour la meilleure qualité
   - Audio système : Si vous présentez des vidéos/sons
2. Partagez votre présentation
3. Enregistrez sans limite de durée

## 🎬 Caractéristiques techniques

### Formats et codecs
- **Format conteneur** : WebM
- **Codec vidéo** : VP9 (avec fallback VP8)
- **Codec audio** : Opus (128 kbps)
- **Bitrate vidéo** :
  - 4K (2160p) : 20 Mbps
  - 2K (1440p) : 12 Mbps
  - 1080p : 8 Mbps

### Optimisations
- **Chunks de 10 secondes** : Permet l'enregistrement illimité sans saturation mémoire
- **Canvas 2D** : Pour la composition écran + webcam
- **Web Audio API** : Mixing audio professionnel
- **RequestAnimationFrame** : Synchronisation parfaite des flux vidéo

### Taille des fichiers (estimations)
- **1080p @ 30 FPS** : ~3.6 GB/heure
- **1440p @ 30 FPS** : ~5.4 GB/heure
- **4K @ 30 FPS** : ~9 GB/heure
- **4K @ 60 FPS** : ~18 GB/heure

## 📁 Structure du projet

```
claudecode/
├── manifest.json          # Configuration extension (Manifest V3)
├── background.js          # Service worker pour notifications
├── popup.html             # Interface utilisateur
├── popup.css              # Styles de l'interface
├── popup.js               # Logique principale d'enregistrement
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── generate_icons.py      # Script de génération d'icônes
└── README.md              # Documentation
```

## 🔧 Technologies utilisées

- **Chrome Manifest V3** : Dernière version des extensions
- **MediaRecorder API** : Enregistrement vidéo natif
- **getUserMedia API** : Capture des périphériques
- **getDisplayMedia API** : Capture d'écran
- **Web Audio API** : Mixing audio professionnel
- **Canvas API** : Composition vidéo avec incrustation
- **Chrome Downloads API** : Téléchargement dans dossier système
- **Chrome Notifications API** : Notifications interactives
- **Chrome Storage API** : Stockage temporaire des métadonnées

## 🐛 Dépannage

### L'audio système ne fonctionne pas
- Sélectionnez un **onglet** (pas une fenêtre ou écran)
- Cochez "Partager l'audio de l'onglet" dans la popup Chrome
- Vérifiez que l'onglet produit effectivement du son

### Le microphone ne fonctionne pas
- Autorisez l'accès au microphone dans Chrome
- Vérifiez les paramètres de confidentialité de votre système
- Sélectionnez bien un microphone dans la liste déroulante

### La webcam ne s'affiche pas
- Autorisez l'accès à la webcam dans Chrome
- Sélectionnez bien une webcam dans la liste déroulante
- Vérifiez qu'aucune autre application n'utilise la webcam

### La vidéo est saccadée en 4K
- Réduisez la résolution à 1440p ou 1080p
- Passez à 30 FPS au lieu de 60 FPS
- Fermez les applications gourmandes en ressources
- Vérifiez que votre processeur supporte l'encodage VP9

### Le fichier ne se télécharge pas
- Vérifiez que vous avez suffisamment d'espace disque
- Autorisez les téléchargements dans Chrome
- Vérifiez les paramètres de téléchargement de Chrome

### La notification n'apparaît pas
- Autorisez les notifications pour l'extension dans Chrome
- Vérifiez les paramètres de notifications de votre système

## 💡 Astuces et bonnes pratiques

### Pour la meilleure qualité
- Utilisez la 4K uniquement si nécessaire (fichiers très volumineux)
- 1440p offre un excellent compromis qualité/taille
- 60 FPS uniquement pour les contenus avec mouvement rapide
- Sélectionnez toujours le bon périphérique audio

### Pour optimiser l'espace disque
- Utilisez 1080p @ 30 FPS pour la plupart des usages
- Arrêtez l'enregistrement dès que possible
- Supprimez les enregistrements ratés rapidement

### Pour convertir en MP4
Si vous avez besoin du format MP4 (plus compatible) :

**Avec FFmpeg** (gratuit, ligne de commande) :
```bash
ffmpeg -i recording-4K-2025-11-05.webm -c:v libx264 -crf 18 -c:a aac output.mp4
```

**Avec des outils en ligne** :
- [CloudConvert](https://cloudconvert.com/webm-to-mp4) (gratuit)
- [Online-Convert](https://www.online-convert.com/)

**Avec des logiciels** :
- HandBrake (gratuit, Windows/Mac/Linux)
- VLC Media Player (gratuit, option Convertir/Enregistrer)

## 📝 Limitations

### Limitations techniques
- L'enregistrement s'arrête si la popup est fermée (limitation Chrome)
- La webcam est toujours en bas à gauche (position fixe)
- Format WebM uniquement (conversion nécessaire pour MP4)

### Limitations de sécurité Chrome
- Impossible de capturer l'audio système complet (hors navigateur)
- Nécessite les permissions utilisateur pour chaque périphérique
- Les onglets en mode incognito peuvent avoir des restrictions

### Limitations matérielles
- L'enregistrement 4K @ 60 FPS nécessite un processeur puissant
- L'espace disque se remplit rapidement en 4K
- La RAM peut être sollicitée pour les très longs enregistrements

## 🚀 Améliorations futures possibles

- Position personnalisable de la webcam
- Taille ajustable de l'incrustation webcam
- Support du format MP4 direct
- Pause/Reprise de l'enregistrement
- Prévisualisation avant enregistrement
- Raccourcis clavier
- Annotations en temps réel
- Zoom sur une zone spécifique

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir des issues pour signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

MIT License - Utilisez et modifiez librement !

---

**Développé avec ❤️ pour les créateurs de contenu, développeurs et professionnels !**

**Version 2.0.0** - Enregistrement 4K illimité avec incrustation webcam
