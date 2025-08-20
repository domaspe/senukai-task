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
cp -n .env.example .env   # Creates .env file from .env.example
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


## API Usage & Endpoints

### Products
The following products are available (with their IDs):

| Product ID | Name        | Price  | Promotion                |
|------------|-------------|--------|--------------------------|
| 1          | Plaktukas   | 9.99   | None                     |
| 2          | Atsuktuvas  | 4.99   | Buy One Get One Free     |
| 3          | Grąžtas     | 49.99  | None                     |
| 4          | Pjūklas     | 24.99  | None                     |
| 5          | Replės      | 7.99   | None                     |

**Promotions:**
- **Buy One Get One Free**: Applies to Atsuktuvas (ID: 2). Add two or more to cart to get every second one free.
- **10% Discount**: Applies to the whole cart if the total (before discount) is over 75€.

### Example Usage

1. **Create a cart:**
   
   `POST /cart` → `{ "id": 1 }`

2. **Add 2 Atsuktuvas (ID: 2) to cart:**
  
    `POST /cart/1/items` with `{ "productId": 2, "quantity": 2 }`

3. **Add other products to reach 75€ and get 10% discount:**
   
   Add products so the total exceeds 75€.

4. **Check the total of the cart**
   
   `GET /cart/1` will show the discount applied.

## API Documentation (Swagger)
This project uses Swagger for interactive API documentation.

- After starting the server, visit: `http://localhost:3000/swagger`
- Explore and test endpoints directly from the browser.
