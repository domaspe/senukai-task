# Senukai Task

A NestJS backend project for managing a shopping cart with promotions. Includes Docker setup and database migrations.

## Features
- Cart management (add, update, remove items)
- Configurable promotions (buy-x-get-y, percentage discount)
- MsSQL database with TypeORM
- Dockerized for easy setup

## How to start

### Prerequisites
- Node.js 22.11.0 or higher
- npm 10.9.0 or higher
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

## Project structure
- `src/cart/` — Cart logic
- `src/promotions/` — Promotion strategies
- `src/database/entities/` — TypeORM entities
- `src/database/migrations/` - Migrations and seed data


## Products

The following products are available (with their IDs):

| Product ID | Name        | Price  | Promotion                                        |
|------------|-------------|--------|--------------------------------------------------|
| 1          | Plaktukas   | 9.99   | None                                             |
| 2          | Atsuktuvas  | 4.99   | Perki vieną, antrą gauni nemokamai - Atsuktuvas  |
| 3          | Grąžtas     | 49.99  | None                                             |
| 4          | Pjūklas     | 24.99  | None                                             |
| 5          | Replės      | 7.99   | None                                             |

## Promotion System

### Promotion Levels

The promotion system operates on two distinct levels with a specific application order:

#### Item level promotions
- **Applied first** to individual products (Perki vieną, antrą gauni nemokamai - Atsuktuvas)
- Modify the price of specific items in the cart

#### Cart level promotions  
- **Applied second** to the entire cart total (10% nuolaida užsakymams virš 75€)
- Calculate discounts based on the **already discounted** cart total from item-level promotions


## Example usage

1. **Create a cart:**
   
   `POST /cart` → `{ "id": 1 }`

2. **Add 2 Atsuktuvas (ID: 2) to cart:**
  
    `POST /cart/1/items` with `{ "productId": 2, "quantity": 2 }`

3. **Add other products to reach 75€ and get 10% discount:**
   
   Add products so the total exceeds 75€.

4. **Check the total of the cart**
   
   `GET /cart/1` will show the discount applied.

## API documentation (Swagger)
This project uses Swagger for interactive API documentation.

- After starting the server, visit: `http://localhost:3000/swagger`
- Explore and test endpoints directly from the browser.
