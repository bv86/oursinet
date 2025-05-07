# 🗄️ Oursi.net CMS (Strapi)

This directory contains the Strapi CMS backend for the Oursi.net project.

## ✨ Features

- 📊 PostgreSQL database integration
- 🔒 User authentication and permissions system
- 📝 Content types for articles, pages, and global components
- 🧩 Reusable component system for content blocks
- 🖼️ Media library for managing images and files
- 🌐 Multi-language content support

## 📁 Structure

```
strapi/
├── config/         # Configuration files
├── database/       # Database migrations
├── public/         # Public assets and uploaded files
└── src/
    ├── admin/      # Admin customizations
    ├── api/        # Content types and API endpoints
    │   ├── article/
    │   ├── global/
    │   ├── home-page/
    │   └── page/
    ├── components/ # Reusable content components
    │   ├── blocks/
    │   ├── elements/
    │   └── layouts/
    └── extensions/  # Plugin extensions
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or newer)
- PNPM (v10.5.2 or newer)
- PostgreSQL database (local or containerized)

### Getting Started

1. **Set up environment variables**

   Create a `.env` file in the strapi directory with the following variables:

   ```
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=your-app-keys
   API_TOKEN_SALT=your-token-salt
   ADMIN_JWT_SECRET=your-admin-jwt-secret
   TRANSFER_TOKEN_SALT=your-transfer-token-salt
   JWT_SECRET=your-jwt-secret

   # Database
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=strapi
   DATABASE_USERNAME=strapi_owner_user
   DATABASE_PASSWORD=strapi
   DATABASE_SSL=false
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Build for production**

   ```bash
   pnpm build

   ```

5. **Start the production server**

   ```bash
   pnpm start
   ```

## 📝 Content Structure

### Content Types

- **Articles**: Blog posts and news articles
- **Pages**: Generic content pages
- **Home Page**: Specific configuration for the home page
- **Global**: Site-wide settings and components

### Component System

The CMS uses a component-based content structure with:

- **Blocks**: Major content sections like hero sections, info blocks
- **Elements**: Smaller reusable elements like buttons and cards
- **Layouts**: Layout components for structuring content

## 🔄 Database Management

### Migrations

Database migrations are stored in the `database/migrations/` directory.

### Backup and Restore

Use the utility scripts in the `utils/` directory at the project root:

```bash
# Backup database
cd ..
./utils/sync-db.sh backup

# Restore database
./utils/sync-db.sh restore latest
```

## 🧰 Admin Panel

The Strapi Admin panel can be accessed at `http://localhost:1337/admin`. Create your first admin user when starting Strapi for the first time.

## 🔌 API Documentation

Once Strapi is running, API documentation is available at:

- REST API: `http://localhost:1337/documentation`
