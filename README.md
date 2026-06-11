# GraphPress

**Laravel + React + GraphQL Blog Platform**

A portfolio-ready full-stack blog with a **public-facing site**, **admin panel**, and a **hybrid REST + GraphQL** architecture. Built to demonstrate modern Laravel patterns, Lighthouse GraphQL, Inertia.js, Apollo Client, and production-style CRUD with validation, pagination, and analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-13-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![GraphQL](https://img.shields.io/badge/GraphQL-Lighthouse-E10098.svg)](https://lighthouse-php.com)

**Repository:** [github.com/DevAmirHub/graph-laravel-react-blog](https://github.com/DevAmirHub/graph-laravel-react-blog)

---

## Features

### Public site
- **Home** — landing page with tech stack and latest published posts (GraphQL)
- **Blog** — searchable, paginated list of published articles
- **Post detail** — full content, tags, approved comments
- Clean **public layout** (no admin sidebar)

### Admin panel
- **Dashboard** — entity counts, recent activity tables, Chart.js analytics
- **Posts** — create, edit, delete with cover upload, categories, tags, status
- **Categories & tags** — full CRUD with slug validation
- **Comments** — moderation (pending / approved / rejected)
- **Users** — account management
- **Settings** — profile, password, 2FA, appearance

### API & architecture
- **GraphQL** (Lighthouse) for reads and mutations
- **REST** for file uploads (`post-cover`, `avatar`)
- **Apollo Client** on the React frontend
- Custom validators for unique slug/email on update
- **GraphiQL** at `/graphiql` for API exploration

### Data & benchmarking
- Factories and seeders for realistic demo data
- `php artisan db:seed-heavy` — chunked bulk seeding (thousands of records) for pagination and dashboard testing

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript, Inertia.js v3 |
| GraphQL | Lighthouse, Apollo Client |
| Auth | Laravel Fortify (2FA, passkeys) |
| UI | Tailwind CSS 4, Radix UI |
| Charts | Chart.js, react-chartjs-2 |
| Database | SQLite (default) / MySQL |
| Tooling | Vite, Wayfinder, ESLint, Prettier, PHPUnit, PHPStan |

---

## Screenshots

> Add screenshots of the home page, blog, and dashboard here before publishing to portfolio.

| Home | Blog | Dashboard |
|------|------|-----------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## Getting started

### Requirements

- PHP 8.3+
- Composer
- Node.js 20+
- npm or pnpm

### Installation

```bash
git clone https://github.com/DevAmirHub/graph-laravel-react-blog.git
cd graph-laravel-react-blog

composer install
cp .env.example .env
php artisan key:generate

# SQLite is configured by default — creates database/database.sqlite automatically on migrate
php artisan migrate:fresh --seed

# Optional: large dataset for pagination / dashboard demos (~5 seconds)
php artisan db:seed-heavy --no-interaction

npm install
npm run dev
```

In a second terminal:

```bash
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000).

### Demo credentials

| | |
|---|---|
| Email | `test@example.com` |
| Password | `password` |

Bulk-seeded users use `bulk-user-{n}@seed.test` with password `password`.

---

## Routes

### Public

| URL | Description |
|-----|-------------|
| `/` | Home |
| `/blog` | Published posts |
| `/blog/{slug}` | Single post |
| `/login` | Admin login |
| `/register` | Register |

### Admin (authenticated)

| URL | Description |
|-----|-------------|
| `/dashboard` | Analytics dashboard |
| `/posts` | Manage posts |
| `/categories` | Manage categories |
| `/tags` | Manage tags |
| `/comments` | Moderate comments |
| `/users` | Manage users |

### API

| URL | Description |
|-----|-------------|
| `/graphql` | GraphQL endpoint |
| `/graphiql` | GraphiQL IDE |
| `POST /api/upload/post-cover` | Upload post cover (auth) |
| `POST /api/upload/avatar` | Upload avatar (auth) |

---

## Example GraphQL query

```graphql
query {
  posts(status: "published", first: 10) {
    data {
      id
      title
      slug
      excerpt
      author { name }
      category { name }
    }
    paginatorInfo {
      total
      currentPage
      lastPage
    }
  }
}
```

---

## Project structure

```
app/
├── GraphQL/Queries/          # Custom resolvers (e.g. DashboardAnalytics)
├── GraphQL/Validators/         # Mutation validators
└── Http/Controllers/Api/       # REST upload controllers

graphql/
├── types/                      # User, Post, Comment, Category, Tag, Dashboard
├── queries/
├── mutations/
└── inputs/

resources/js/
├── pages/                      # Inertia pages (home, blog, admin CRUD)
├── components/                 # UI components
├── graphql/                    # Apollo queries & mutations
├── layouts/                    # Public, app, auth layouts
└── types/                      # TypeScript types

database/
├── factories/
├── seeders/
└── seeders/HeavyDatabaseSeeder.php
```

---

## Scripts

```bash
# Frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run types:check  # TypeScript check
npm run lint         # ESLint

# Backend
php artisan test
vendor/bin/pint      # Code style
vendor/bin/phpstan analyse

# Seeding
php artisan migrate:fresh --seed
php artisan db:seed-heavy --users=5000 --posts=10000 --comments=20000 --no-interaction
```

---

## Roadmap

See [Roadmap](./Roadmap) for detailed phase status.

**Done:** setup, models, GraphQL CRUD, REST upload, admin panel, dashboard charts, public blog, heavy seeding.

**Planned:** role-based permissions (Spatie), public comment submission, category/tag filters on blog, REST vs GraphQL benchmark endpoint.

---

## Author

**Amir** — [DevAmirHub](https://github.com/DevAmirHub)

- GitHub: [@DevAmirHub](https://github.com/DevAmirHub)
- Website: [devamir.com](https://devamir.com)
- Email: [devamir99@gmail.com](mailto:devamir99@gmail.com)

---

## License

This project is open-sourced under the [MIT License](LICENSE).
