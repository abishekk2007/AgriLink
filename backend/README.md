# AgriLink - Agricultural Market Intelligence Platform Backend

Backend API for **AgriLink**, an agricultural market intelligence platform designed to empower farmers and market participants with real-time commodity prices, market comparison, rule-based decision support, price alerts, and transparent statistical analytics.

---

## Complete Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database / ORM**: PostgreSQL / Supabase, Prisma ORM
- **Security**: Helmet.js (HTTP security headers), CORS policy
- **HTTP Client**: Axios
- **Logging**: Morgan HTTP logger & structured console logger
- **Schema Validation**: Zod
- **Analytics Engine**: Deterministic statistical calculations (0% ML / No AI)
- **Dev Runner**: tsx

---

## Project Structure (Clean MVC Architecture)

```
backend/
│
├── prisma/
│   └── schema.prisma                # Database schema (MarketPrice, Crop, Market, Alert)
│
├── src/
│   ├── server.ts                    # Entrypoint, HTTP bootstrap & graceful shutdown
│   ├── app.ts                       # Express setup, middleware & security orchestration
│   │
│   ├── database/                    # Database connection & seed services
│   │   ├── prisma.ts                # Resilient Prisma ORM adapter & health check
│   │   └── seed.ts                  # Database seeder (crops, markets, prices, alerts)
│   │
│   ├── modules/                     # Domain modules
│   │   ├── comparison/              # Market Comparison Module (Phase 4)
│   │   │   ├── comparison.routes.ts # GET /api/markets/compare
│   │   │   ├── comparison.controller.ts
│   │   │   ├── comparison.service.ts
│   │   │   └── comparison.types.ts
│   │   │
│   │   ├── alerts/                  # Price Alert System (Phase 4)
│   │   │   ├── alert.routes.ts      # POST /api/alerts, GET /api/alerts
│   │   │   ├── alert.controller.ts
│   │   │   ├── alert.service.ts
│   │   │   └── alert.types.ts
│   │   │
│   │   └── prices/                  # Price History & Analytics (Phase 3)
│   │       ├── price.routes.ts      # GET /api/prices/history, GET /api/prices/analytics
│   │       ├── price.controller.ts
│   │       ├── price.service.ts
│   │       ├── price.types.ts
│   │       └── price.utils.ts
│   │
│   ├── routes/                      # Route definitions
│   │   ├── index.ts                 # Master API router (mounted at /api)
│   │   ├── health.routes.ts         # GET /api/health
│   │   ├── marketRoutes.ts          # GET /api/market/data, GET /api/market/test
│   │   └── insightRoutes.ts         # GET /api/insights (Phase 4)
│   │
│   ├── controllers/                 # HTTP controllers
│   │   ├── health.controller.ts
│   │   ├── marketController.ts
│   │   └── insightController.ts
│   │
│   ├── services/                    # Business logic layer
│   │   ├── health.service.ts
│   │   ├── marketDataService.ts
│   │   ├── analyticsService.ts
│   │   └── insightService.ts        # Rule-based farmer recommendations
│   │
│   ├── middleware/                  # Middleware pipeline
│   │   ├── errorHandler.ts          # Centralized error handler (API, DB, Zod, Unknown)
│   │   ├── notFound.middleware.ts   # 404 handler
│   │   ├── requestLogger.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── index.ts
│   │
│   ├── config/                      # Environment & security configuration
│   │   ├── env.config.ts            # Zod-validated environment variables
│   │   ├── apiConfig.ts             # External market API configuration
│   │   └── cors.config.ts           # CORS origin options
│   │
│   ├── utils/                       # Shared utilities
│   │   ├── apiClient.ts             # Axios client with interceptors & error mapping
│   │   ├── priceCalculator.ts       # Pure statistical calculator
│   │   ├── ApiError.ts              # Operational error class
│   │   ├── ApiResponse.ts           # Standard JSON response envelope
│   │   ├── asyncHandler.ts          # Async route wrapper
│   │   └── logger.ts                # Structured terminal logger
│   │
│   └── types/                       # TypeScript interfaces
│       ├── api.types.ts
│       ├── market.types.ts
│       └── common.types.ts
│
├── .env                             # Local environment configuration
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # Strict TypeScript configuration
└── README.md                        # Documentation
```

---

## Complete End-to-End Architecture Flow

```
                      Government Market API (Agmarknet / data.gov.in)
                                      │
                                      ▼
                             MarketDataService
                                      │
                                      ▼
                             PriceService (History)
                                      │
                     ┌────────────────┼────────────────┐
                     ▼                ▼                ▼
             AnalyticsService  ComparisonService  AlertService
                     │                │                │
                     └────────────────┼────────────────┘
                                      │
                                      ▼
                               InsightService
                                      │
                                      ▼
                        PostgreSQL Database (Prisma ORM)
                                      │
                                      ▼
                             Express REST APIs
                                      │
                                      ▼
                          Farmer Frontend Dashboard
```

---

## Database Schema (`prisma/schema.prisma`)

```prisma
model MarketPrice {
  id              String   @id @default(uuid())
  date            String
  state           String
  district        String
  market          String
  commodity       String
  minPrice        Float
  maxPrice        Float
  modalPrice      Float
  arrivalQuantity Float?   @default(0)
  createdAt       DateTime @default(now())

  @@index([commodity, market, date])
  @@index([state, commodity])
}

model Crop {
  id        String   @id @default(uuid())
  name      String   @unique
  category  String
  createdAt DateTime @default(now())
}

model Market {
  id        String   @id @default(uuid())
  name      String
  state     String
  district  String
  createdAt DateTime @default(now())

  @@unique([name, state, district])
}

model Alert {
  id          String   @id @default(uuid())
  crop        String
  market      String
  targetPrice Float
  createdAt   DateTime @default(now())
}
```

---

## API Endpoints Reference

### 1. Health & Status
* **`GET /api/health`**
  ```json
  {
    "success": true,
    "status": "healthy",
    "service": "AgriLink Backend"
  }
  ```

### 2. Live Agricultural Market Data
* **`GET /api/market/test`** — Tests connection to external agricultural market API.
* **`GET /api/market/data`** — Fetches current market records (Query: `commodity`, `state`, `district`, `market`).

### 3. Historical Prices & Analytics Engine
* **`GET /api/prices/history`**
  * **Query:** `crop` (required), `market` (required), `startDate`, `endDate`, `range` (`7d`, `30d`, `90d`)
  * **Response:**
    ```json
    {
      "success": true,
      "message": "Price history fetched successfully",
      "data": [
        {
          "date": "2026-09-01",
          "crop": "Tomato",
          "market": "Koyambedu",
          "minPrice": 30,
          "maxPrice": 45,
          "modalPrice": 38
        }
      ]
    }
    ```
* **`GET /api/prices/analytics`**
  * **Query:** `crop` (required), `market` (required), `startDate`, `endDate`
  * **Response:**
    ```json
    {
      "success": true,
      "data": {
        "latestPrice": 40,
        "highestPrice": 50,
        "highestDate": "2026-09-20",
        "lowestPrice": 35,
        "lowestDate": "2026-09-15",
        "averagePrice": 41,
        "trend": "UP",
        "percentageChange": 5.26
      }
    }
    ```

### 4. Market Comparison (Phase 4)
* **`GET /api/markets/compare`**
  * **Query:** `crop` (required), `date`, `markets` (comma-separated, e.g. `Koyambedu,Madurai`), `state`
  * **Example:** `GET /api/markets/compare?crop=Tomato&markets=Koyambedu,Madurai`
  * **Response:**
    ```json
    {
      "success": true,
      "message": "Market comparison generated successfully",
      "data": [
        { "market": "Koyambedu", "modalPrice": 40, "state": "Tamil Nadu" },
        { "market": "Madurai", "modalPrice": 36, "state": "Tamil Nadu" }
      ],
      "summary": {
        "crop": "Tomato",
        "date": "2026-09-25",
        "totalMarkets": 2,
        "highestMarket": "Koyambedu",
        "highestPrice": 40,
        "lowestMarket": "Madurai",
        "lowestPrice": 36,
        "priceSpread": 4,
        "averagePrice": 38
      }
    }
    ```

### 5. Farmer Decision Insights (Phase 4)
* **`GET /api/insights`**
  * **Query:** `crop` (required), `market` (required), `state`
  * **Example:** `GET /api/insights?crop=Tomato&market=Koyambedu`
  * **Response:**
    ```json
    {
      "success": true,
      "message": "Farmer insights generated successfully",
      "data": {
        "crop": "Tomato",
        "market": "Koyambedu",
        "insights": [
          "Current price (₹40/kg) is below the period average (₹41/kg). Consider short-term storage if feasible.",
          "Price is showing an increasing trend (+5.26%).",
          "Vashi has a higher modal price (₹42/kg), offering ₹2/kg more than Koyambedu."
        ],
        "metrics": {
          "latestPrice": 40,
          "averagePrice": 41,
          "highestPrice": 50,
          "trend": "UP",
          "percentageChange": 5.26,
          "bestAlternativeMarket": "Vashi",
          "bestAlternativePrice": 42
        }
      }
    }
    ```

### 6. Price Alert System (Phase 4)
* **`POST /api/alerts`**
  * **Body:**
    ```json
    {
      "crop": "Tomato",
      "market": "Koyambedu",
      "targetPrice": 40
    }
    ```
  * **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Price alert created successfully",
      "data": {
        "id": "alert_1790362617506_711om",
        "crop": "Tomato",
        "market": "Koyambedu",
        "targetPrice": 40,
        "currentPrice": 40,
        "isTriggered": true,
        "status": "TRIGGERED",
        "notificationMessage": "Alert Triggered! Current price (₹40/kg) has reached or exceeded your target (₹40/kg)."
      }
    }
    ```
* **`GET /api/alerts`** — Fetches all user alerts with updated prices and trigger states.

---

## Installation, Seeding & Execution

```bash
cd backend

# Install dependencies
npm install

# Seed initial crops, markets, prices, and alerts
npm run seed  # or node dist/database/seed.js

# Development Mode
npm run dev

# Production Build & Start
npm run build
npm start
```
