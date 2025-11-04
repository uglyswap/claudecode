#!/usr/bin/env python3
from PIL import Image, ImageDraw

def create_icon(size, filename):
    """Crée une icône pour l'extension de capture d'écran"""

    # Créer une image avec un fond dégradé violet
    img = Image.new('RGB', (size, size), '#764ba2')

    draw = ImageDraw.Draw(img)

    # Dessiner un cercle de fond blanc
    center = size // 2
    outer_radius = int(size * 0.4)
    inner_radius = int(size * 0.3)

    # Cercle extérieur blanc
    draw.ellipse(
        [center - outer_radius, center - outer_radius,
         center + outer_radius, center + outer_radius],
        fill='white',
        outline=None
    )

    # Cercle intérieur rouge (bouton d'enregistrement)
    draw.ellipse(
        [center - inner_radius, center - inner_radius,
         center + inner_radius, center + inner_radius],
        fill='#ef4444',
        outline=None
    )

    # Sauvegarder
    img.save(filename, 'PNG')
    print(f"✓ Créé: {filename}")

# Créer les 3 tailles d'icônes
create_icon(16, 'icons/icon16.png')
create_icon(48, 'icons/icon48.png')
create_icon(128, 'icons/icon128.png')

print("\n✅ Toutes les icônes ont été créées!")
