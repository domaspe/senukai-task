# Senukai Task

A NestJS backend project for managing a shopping cart with promotions. Includes Docker setup and database migrations.

## Features
- Cart management (add, update, remove items)
- Promotion strategies (e.g., buy-one-get-one, percentage discount)
- MsSQL database with TypeORM
- Dockerized for easy setup

## How to start

### Prerequisites
- Node.js
- Docker & Docker Compose

### Setup

```sh
cp -n .env.example .env   # Creates .env file from `.env.example`
npm install
docker-compose up -d
```

### Scripts

```sh
npm run start:dev
```

Starts NestJS in development mode, automatically runs `docker-compose` and applies database migrations

## Project Structure
- `src/cart/` — Cart logic
- `src/promotions/` — Promotion strategies
- `src/database/entities/` — TypeORM entities
- `src/database/migrations/` - Migrations and seed data

## API Documentation (Swagger)
This project uses Swagger for interactive API documentation.

- After starting the server, visit: `http://localhost:3000/swagger`
- Explore and test endpoints directly from the browser.
