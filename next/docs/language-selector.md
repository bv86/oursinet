# Sélecteur de Langue - Documentation

## Aperçu

Ce projet inclut un sélecteur de langue dans le header qui permet aux utilisateurs de basculer entre le français et l'anglais. Le système est entièrement intégré avec l'internationalisation (i18n) de Next.js.

## Fonctionnalités

### 🌐 Sélection de langue

- **Langues supportées** : Français (fr) et Anglais (en)
- **Interface visuelle** : Drapeaux et noms de langue
- **Conservation du chemin** : Le changement de langue préserve la page actuelle

### ♿ Accessibilité

- **Support clavier complet** : Navigation avec Tab, Entrée, Espace et Échap
- **ARIA labels** : Support des lecteurs d'écran
- **Focus management** : Gestion appropriée du focus clavier
- **Indicateurs visuels** : États hover, focus et actif

### 🎨 Interface utilisateur

- **Design cohérent** : Utilise les couleurs du thème sidebar
- **Animations fluides** : Transitions CSS pour les interactions
- **Fermeture intelligente** : Fermeture automatique en cliquant à l'extérieur
- **Indicateur de sélection** : Marque visuelle pour la langue active

## Architecture

### Composants

#### `LanguageSelector.tsx`

Composant client React qui gère :

- L'état d'ouverture/fermeture du menu
- La navigation entre les langues
- Les interactions clavier et souris
- L'accessibilité

#### `Header.tsx`

Header principal qui :

- Reçoit le locale actuel en prop
- Intègre le sélecteur de langue
- Maintient la mise en page responsive

### Configuration

#### Langues disponibles (`config.ts`)

```typescript
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
```

#### Dictionnaires de traduction

- `dictionaries/en.json` : Traductions anglaises
- `dictionaries/fr.json` : Traductions françaises

Structure ajoutée pour le sélecteur :

```json
{
  "language": {
    "select": "Select language / Choisir la langue",
    "english": "English",
    "french": "Français"
  }
}
```

## Utilisation

### Intégration dans le layout

```tsx
// app/[locale]/layout.tsx
<Header data={header} locale={locale} />
```

### Navigation

Le sélecteur modifie automatiquement l'URL :

- `/en/blog` → `/fr/blog` (français)
- `/fr/about` → `/en/about` (anglais)

## Personnalisation

### Ajouter une nouvelle langue

1. **Mettre à jour la configuration**

```typescript
// config.ts
export const locales = ['en', 'fr', 'es'] as const;
```

2. **Créer le dictionnaire**

```json
// dictionaries/es.json
{
  "language": {
    "select": "Seleccionar idioma",
    "english": "English",
    "french": "Français",
    "spanish": "Español"
  }
}
```

3. **Ajouter les constantes dans le sélecteur**

```typescript
// LanguageSelector.tsx
const languageNames = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
} as const;

const languageFlags = {
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
} as const;
```

### Modifier l'apparence

Le composant utilise les variables CSS du thème :

- `--sidebar` : Couleur de fond
- `--sidebar-foreground` : Couleur du texte
- `--sidebar-accent` : Couleur d'accent (hover/focus)
- `--sidebar-border` : Couleur des bordures

## Test

Une page de test est disponible à `/[locale]/test-language` pour vérifier :

- Le fonctionnement du sélecteur
- L'accessibilité
- Les animations
- La navigation

## Support navigateur

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ Support mobile complet
- ✅ Compatibilité lecteurs d'écran (NVDA, JAWS, VoiceOver)

## Notes de développement

- Le composant utilise `'use client'` car il gère l'état local
- La navigation utilise le router Next.js pour les transitions fluides
- Le middleware Next.js gère automatiquement la redirection des URLs sans locale
