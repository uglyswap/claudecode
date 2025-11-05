# 🎥 Screen & Audio Recorder - Extension Chrome

Extension Chrome pour enregistrer votre écran, le son de votre microphone et l'audio du navigateur. Parfait pour créer des démos d'agents IA vocaux comme ElevenLabs !

## ✨ Fonctionnalités

- 🖥️ **Capture d'écran** : Enregistrez votre écran complet, une fenêtre ou un onglet
- 🎤 **Audio du microphone** : Capturez votre voix pendant l'enregistrement
- 🔊 **Audio du navigateur** : Enregistrez le son de l'onglet (important pour les agents vocaux)
- ⏱️ **Timer en temps réel** : Suivez la durée de votre enregistrement
- 💾 **Sauvegarde automatique** : La vidéo est téléchargée automatiquement au format WebM
- 🎨 **Interface intuitive** : Design moderne et facile à utiliser

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
5. L'extension apparaît dans votre barre d'outils !

## 🚀 Utilisation

### Démarrage rapide

1. **Cliquez sur l'icône de l'extension** dans votre barre d'outils Chrome
2. **Configurez vos sources audio** :
   - ✅ Cochez "Microphone" pour capturer votre voix
   - ✅ Cochez "Audio du navigateur" pour capturer le son de l'onglet
3. **Cliquez sur "Démarrer l'enregistrement"**
4. **Sélectionnez ce que vous voulez partager** :
   - **Onglet entier** : Recommandé pour capturer l'audio du navigateur
   - **Fenêtre** : Capturez une fenêtre spécifique
   - **Écran entier** : Capturez tout votre écran
5. **⚠️ Important pour l'audio du navigateur** : Cochez "Partager l'audio de l'onglet" dans la fenêtre de sélection
6. L'enregistrement démarre ! Un timer s'affiche
7. **Cliquez sur "Arrêter l'enregistrement"** quand vous avez terminé
8. La vidéo se télécharge automatiquement au format `.webm`

### Pour les démos d'agents vocaux ElevenLabs

1. Ouvrez votre application avec l'agent vocal ElevenLabs
2. Lancez l'extension et activez **Microphone** + **Audio du navigateur**
3. Cliquez sur "Démarrer l'enregistrement"
4. Sélectionnez l'**onglet** où se trouve votre agent vocal
5. **Cochez "Partager l'audio de l'onglet"** dans la popup Chrome
6. Interagissez avec votre agent vocal
7. Arrêtez l'enregistrement
8. Vous avez maintenant une vidéo complète avec votre voix et les réponses de l'agent !

## 🎬 Astuces pour un bon enregistrement

- **Audio du navigateur** : Sélectionnez toujours l'option "Onglet" (pas "Fenêtre" ou "Écran") et cochez "Partager l'audio de l'onglet"
- **Qualité** : La vidéo est enregistrée en 1080p à 30 FPS avec VP9/Opus
- **Format** : Les vidéos sont en `.webm`, compatible avec tous les navigateurs modernes
- **Conversion** : Si vous avez besoin de MP4, utilisez un outil comme [CloudConvert](https://cloudconvert.com/webm-to-mp4) ou FFmpeg

## 📁 Structure du projet

```
claudecode/
├── manifest.json          # Configuration de l'extension
├── popup.html             # Interface utilisateur
├── popup.css              # Styles de l'interface
├── popup.js               # Logique d'enregistrement
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── generate_icons.py      # Script de génération d'icônes
└── README.md              # Ce fichier
```

## 🔧 Technologies utilisées

- **Manifest V3** : Dernière version des extensions Chrome
- **MediaRecorder API** : Pour l'enregistrement vidéo
- **getUserMedia API** : Pour capturer le microphone
- **getDisplayMedia API** : Pour capturer l'écran
- **Web Audio API** : Pour mixer les sources audio

## 🐛 Dépannage

### L'audio du navigateur ne fonctionne pas
- ✅ Vérifiez que vous sélectionnez un **onglet** (pas une fenêtre)
- ✅ Cochez bien "Partager l'audio de l'onglet" dans la popup de sélection
- ✅ Assurez-vous que l'onglet a effectivement du son

### Le microphone ne fonctionne pas
- ✅ Autorisez l'accès au microphone quand Chrome vous le demande
- ✅ Vérifiez les paramètres de confidentialité de votre système

### La vidéo est saccadée
- ✅ Fermez les applications inutiles pour libérer des ressources
- ✅ Réduisez la taille de la fenêtre/onglet à enregistrer

## 📝 Limitations et Améliorations

### ✅ Améliorations récentes (v1.0.1)
- **Sauvegarde automatique** : L'enregistrement est maintenant sauvegardé automatiquement même si la popup se ferme accidentellement
- **Avertissement visible** : Un message d'avertissement vous rappelle de garder la popup ouverte pendant l'enregistrement
- **Capture améliorée** : Meilleure capture des enregistrements courts grâce à un timeslice optimisé (100ms)

### Limitations
- Pour une fiabilité maximale, gardez la popup ouverte pendant l'enregistrement (l'avertissement vous le rappellera)
- Le format WebM peut ne pas être compatible avec certains lecteurs vidéo anciens
- L'audio système (hors navigateur) ne peut pas être capturé pour des raisons de sécurité

## 🤝 Contribution

N'hésitez pas à ouvrir des issues ou des pull requests pour améliorer cette extension !

## 📄 Licence

MIT License - Utilisez librement !

---

**Fait avec ❤️ pour faciliter vos démos d'agents IA vocaux !**
