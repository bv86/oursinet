# 🖼️ Oursi.net Frontend

This is the frontend part of the Oursi.net project, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🌐 Multi-language support with i18n routing (`[locale]/` directory structure)
- 📄 Dynamic content from Strapi CMS
- 🎨 UI components built with Tailwind CSS and Radix UI
- 📱 Responsive design for all device sizes
- 🔍 Search functionality with debouncing
- 📊 Pagination for content lists
- 📝 Markdown rendering for rich text content

## 📁 Structure

```
next/
├── public/         # Static assets
├── src/
│   ├── app/        # Next.js app router pages
│   │   ├── [locale]/ # Internationalized routes
│   │   └── ...
│   ├── components/ # Reusable UI components
│   │   ├── blocks/ # Content block components
│   │   ├── layouts/ # Layout components
│   │   └── ui/     # Base UI components
│   ├── dictionaries/ # Translation files
│   └── lib/        # Utility functions and API helpers
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or newer)
- PNPM (v10.5.2 or newer)
- Running Strapi backend (either local or remote)

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server with Turbopack**

   ```bash
   pnpm dev
   ```

3. **Build for production**

   ```bash
   pnpm build
   ```

4. **Start production server**
   ```bash
   pnpm start
   ```

## ⚙️ Configuration

The frontend connects to the Strapi backend using environment variables. Create a `.env.local` file with:

```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```

## 🌐 Internationalization

The frontend supports multiple languages defined in `src/dictionaries/` and uses Next.js app router internationalization with the `[locale]` directory structure.

## 📚 Component System

The frontend uses a component-based architecture with:

- **Block components**: Dynamic content blocks rendered based on Strapi data
- **Layout components**: Page layouts like Header and Footer
- **UI components**: Base UI elements like buttons, cards, and inputs

## 🧪 Testing

Run the tests with:

```bash
pnpm test
```
