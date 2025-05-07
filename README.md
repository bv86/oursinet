# 🐻 Oursi.net

This repository contains the code for the oursi.net website (my personal website), a modern web application built with Next.js and Strapi CMS.

## 🚀 Project Overview

Oursi.net is a full-stack web application with:

- 🖼️ **Next.js** frontend (v15) with TypeScript and Tailwind CSS
- 🗄️ **Strapi** headless CMS (v5) with PostgreSQL database
- 🐳 Docker containerization for easy deployment
- 📦 PNPM workspace for efficient package management

## 📁 Project Structure

The project is organized as a monorepo with the following structure:

```
oursinet/
├── next/           # Next.js frontend application
├── strapi/         # Strapi CMS backend
├── utils/          # Utility scripts for development
└── docker-compose.yml  # Docker configuration for local deployment
```

### Frontend (Next.js)

The frontend is built with Next.js 15, featuring:

- 🌐 Internationalization support
- 🧩 Component-based architecture with reusable UI components
- 📱 Responsive design with Tailwind CSS
- 📄 Dynamic content rendering from Strapi

### Backend (Strapi)

The backend uses Strapi CMS with:

- 📊 PostgreSQL database for content storage
- 🔒 User authentication and permissions
- 📝 Content types for articles, pages, and global components
- 🖼️ Media management for images and files

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [PNPM](https://pnpm.io/) (v10.5.2 or newer)
- [Docker](https://www.docker.com/) and Docker Compose (for containerized setup)

### Option 1: Local Development with PNPM

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/oursinet.git
   cd oursinet
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in the strapi directory
   cp strapi/.env.example strapi/.env
   ```

4. **Start PostgreSQL database**

   ```bash
   docker-compose up postgres -d
   ```

5. **Start both development servers**

   ```bash
   pnpm -r dev
   ```

6. **Access your applications:**
   - Frontend: <http://localhost:3000>
   - Strapi Admin: <http://localhost:1337/admin>

### Option 2: Docker Compose (Full Stack)

For testing the entire application in a production-like environment:

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/oursinet.git
   cd oursinet
   ```

2. **Set up environment variables**

   ```bash
   cp strapi/.env.example strapi/.env
   ```

3. **Build and start all services**

   ```bash
   docker-compose up -d
   ```

4. **Access your containerized applications:**
   - Frontend: <http://localhost:3000>
   - Strapi Admin: <http://localhost:1337/admin>

## 🧰 Useful Commands

### PNPM Commands

```bash
# Install all dependencies
pnpm install

# Lint all projects
pnpm lint

# Format all projects
pnpm format

# Fix linting issues
pnpm lint:fix

# Fix formatting issues
pnpm format:fix
```

### Next.js Commands (in next/ directory)

```bash
# Start development server with turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Strapi Commands (in strapi/ directory)

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database Utilities (in utils/ directory)

```bash
# Port-forward database (if needed)
./utils/port-forward.sh

# Sync database with latest dump
./utils/sync-db.sh
```

## ✨ Author

Created by Benoit VANNESSON.
