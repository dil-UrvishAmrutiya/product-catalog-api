# product-catalog-api

REST API for managing a product catalog, with [Socket.io](https://socket.io/) real-time events for creates, updates, deletions, and stock changes.

**Stack:** Node.js, Express, express-validator, CORS, Socket.io. Data is held **in memory** (no database); restarting the process clears all products.

## Requirements

- [Node.js](https://nodejs.org/) 18+ recommended

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Development (auto-restart on file changes):

```bash
npm run dev
```

The server listens on **port 3000** by default (`http://localhost:3000`).

## Health check

`GET /` — returns JSON confirming the API is running.

## REST API

Base path: `/api/products`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List products (optional query filters, see below) |
| `GET` | `/api/products/:id` | Get one product by ID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Replace/update a product |
| `PATCH` | `/api/products/:id/stock` | Update only `stockQuantity` |
| `DELETE` | `/api/products/:id` | Delete a product (responds with `204 No Content` on success) |

### List query parameters (`GET /api/products`)

| Parameter | Description |
|-----------|-------------|
| `category` | Filter by category (case-insensitive match) |
| `minPrice`, `maxPrice` | Numeric price range |
| `inStock` | `true` = stock > 0, `false` = stock === 0 |
| `search` | Substring match on `name` or `description` |
| `sortBy` | `price`, `name`, or `stockQuantity` |
| `order` | Use with `sortBy`: `asc` (default) or `desc` |

### Create / full update body (`POST`, `PUT`)

| Field | Required | Notes |
|-------|----------|--------|
| `name` | Yes | 1–200 characters |
| `description` | No | String |
| `category` | Yes | String |
| `price` | Yes | Number ≥ 0 |
| `stockQuantity` | Yes | Integer ≥ 0 |
| `sku` | Yes | Must be unique (case-insensitive) |
| `isActive` | No | Boolean; default `true` on create |

### Partial stock update (`PATCH /api/products/:id/stock`)

```json
{ "stockQuantity": 42 }
```

### Typical JSON responses

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": "message" }`
- Create: `201` with `data` = new product
- Not found: `404`
- Duplicate SKU: `409`

## WebSocket (Socket.io)

Connect a Socket.io client to the same host and port as the HTTP server (e.g. `http://localhost:3000`). CORS is set to allow any origin for Socket.io.

The server **broadcasts** the following event names. Each payload is wrapped as:

```json
{
  "event": "<event-name>",
  "timestamp": "<ISO-8601>",
  "data": { ... }
}
```

| Event | When |
|-------|------|
| `product-created` | New product created |
| `product-updated` | Product updated (full object in `data`) |
| `product-deleted` | Product removed (`data`: `{ id, name }`) |
| `stock-updated` | Stock changed (`data`: `id`, `name`, `oldStock`, `newStock`) |
| `out-of-stock` | Stock went from > 0 to 0 |
| `low-stock-alert` | Stock dropped below 10 (and was ≥ 10 before), and stock is still > 0 |

## Project layout

- `server.js` — HTTP server, Express app, Socket.io attachment
- `src/routes/products.js` — Product routes
- `src/controllers/productController.js` — HTTP handlers and event emission
- `src/services/productService.js` — In-memory product logic
- `src/middleware/validation.js` — express-validator rules
- `src/websocket/socketServer.js` — Socket.io setup
- `src/utils/logger.js` — Request and app logging

## License

Unspecified — add a `LICENSE` file if you need one.
