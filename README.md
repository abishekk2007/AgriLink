# AgriLink — Market Intelligence for a Stronger Tomorrow

[![Team](https://img.shields.io/badge/Team-Alpha_Nexus-emerald.svg)](https://github.com/abishekk2007/AgriLink)
[![Institution](https://img.shields.io/badge/Institution-Panimalar_Engineering_College-blue.svg)](https://panimalar.ac.in)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://typescriptlang.org)

AgriLink is a production-quality agricultural market intelligence platform engineered to empower farmers, agricultural cooperatives (FPOs), and regional traders with transparent, deterministic government mandi price observations (AGMARKNET).

---

## 🌟 Key Capabilities

1. **Official Mandi Price Analytics:** Daily modal, minimum, and maximum prices across APMCs in Tamil Nadu, Karnataka, and Maharashtra.
2. **Deterministic Trend Engine:** Verifiable price trajectories calculated as percentage deltas over custom date windows (7-day, 30-day, 90-day presets).
3. **Multi-Market Arbitrage & Comparison:** Side-by-side comparison of regional mandis (e.g. Koyambedu vs. Madurai vs. Coimbatore vs. Salem) with Recharts bar visualizations.
4. **Transport Net Realization Calculator:** Formulates realistic farmer net realization:
   $$\text{Net Realization} = \text{Gross Market Value} - (\text{Distance (km)} \times \text{Transport Rate (₹/km)})$$
5. **Government MSP Benchmarking:** Displays official statutory Minimum Support Prices (CACP) for covered crops (Paddy/Rice, Wheat, Maize) with difference indicators.
6. **Price Position & Percentile Gauge:** Classifies prices into Lower (0-33%), Middle (33-66%), and Upper (66-100%) historical tiers.
7. **Rule-Based Price Alerts:** Create custom triggers (`ABOVE` or `BELOW` threshold price) with automated background evaluation (`jobs/alertChecker.ts`).
8. **1-Click WhatsApp Sharing:** Cleanly formatted verified mandi cards ready to share with farmers without exposing private data.
9. **Tamil & Voice Search:** Native Tamil interface (`தமிழ்`) and Web Speech API recognition (e.g. *"Tomato price in Chennai"* / *"சென்னை தக்காளி விலை"*).
10. **Data Provenance & Audit Logs:** Ingestion audit logs tracking record counts and validation passes from AGMARKNET / data.gov.in.
11. **Zero AI Hallucinations:** Strictly rejects black-box ML speculation for market prices in the core system to protect farmers from risky predictions.

---

## 🏗️ Repository Architecture

```
AgriLink/
│
├── frontend/                     # Next.js 16 Web Application
│   ├── app/                      # App Router Pages
│   │   ├── page.tsx              # Dashboard (Overview & Mandi Tickers)
│   │   ├── market-prices/        # Market Prices Workspace
│   │   ├── compare/              # Multi-Market Comparison & Bar Chart
│   │   ├── alerts/               # Price Alerts Management
│   │   ├── insights/             # Rule-Based Insights & Volatility
│   │   ├── settings/             # Data Source Transparency & Units
│   │   └── globals.css           # Agricultural Theme Design System
│   ├── components/               # Modular UI Components
│   │   ├── Header.tsx            # Global Navigation & Language Toggle
│   │   ├── FilterPanel.tsx       # Search, Presets & Voice Recognition
│   │   ├── PriceChart.tsx        # Recharts Interactive Price History
│   │   ├── PriceStats.tsx        # Summary Metric Cards
│   │   ├── PricePosition.tsx     # Historical Percentile Gauge
│   │   ├── TransportCalculator.tsx # Net Realization Haulage Calculator
│   │   ├── MspCard.tsx           # Minimum Support Price Comparison
│   │   └── WhatsAppShareButton.tsx # Pre-Formatted WhatsApp Card
│   ├── hooks/
│   │   └── useSpeechRecognition.ts # Browser Web Speech API Hook
│   ├── lib/
│   │   ├── api/                  # Typed REST API Client
│   │   └── mock/                 # Resilient Offline Demo Data Fallback
│   └── utils/
│       └── translations.ts       # English & Tamil Localization Dictionaries
│
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # DB (Prisma), ENV, CORS Configuration
│   │   ├── controllers/          # HTTP Route Handlers
│   │   ├── routes/               # Modular API Routers
│   │   ├── services/             # Core Business & Analytical Logic
│   │   ├── repositories/         # Prisma Database Query Layer
│   │   ├── middleware/           # Error Handler, Rate Limiter, Validation
│   │   ├── validators/           # Zod Runtime Schemas
│   │   ├── utils/                # Mathematical & Date Utilities
│   │   ├── jobs/                 # Alert Checker Background Job
│   │   └── server.ts             # Express Server Entry Point
│   ├── prisma/
│   │   ├── schema.prisma         # PostgreSQL Schema & Indexes
│   │   └── seed.ts               # Realistic AGMARKNET Mandi Seed Script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/
│   └── architecture.md           # System Architecture & Mermaid Diagrams
│
├── README.md
└── .gitignore
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v26)
- **PostgreSQL**: Local or cloud PostgreSQL instance

---

### Step 1: Database Setup
1. Create PostgreSQL database:
   ```bash
   createdb agrilink_db
   ```
2. Configure `.env` in `backend/`:
   ```bash
   cd backend
   cp .env.example .env
   ```
   *Edit `DATABASE_URL` if needed:*
   ```env
   DATABASE_URL="postgresql://mac@localhost:5432/agrilink_db?schema=public"
   PORT=5001
   CLIENT_URL="http://localhost:3000"
   ```

---

### Step 2: Backend Setup & Database Seeding
```bash
cd backend
npm install

# Push Prisma Schema to PostgreSQL
npx prisma db push

# Seed realistic government mandi data (1,425+ records)
npm run prisma:seed

# Start Backend Dev Server
npm run dev
```
*Backend runs on `http://localhost:5001`.*

---

### Step 3: Frontend Setup & Dev Server
```bash
cd ../frontend
npm install

# Start Next.js Development Server
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 📡 REST API Documentation

### 1. Health Check
- **`GET /api/health`**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "agrilink-api",
    "database": "ok",
    "timestamp": "2026-09-26T04:25:57.573Z"
  }
}
```

### 2. Commodities
- **`GET /api/commodities`** — Lists all crops with categories and MSP coverage.
- **`GET /api/commodities/:id`** — Returns single commodity details.

### 3. Locations & Mandis
- **`GET /api/states`** — Lists states (Tamil Nadu, Karnataka, Maharashtra).
- **`GET /api/states/:stateId/districts`** — Districts for a given state.
- **`GET /api/districts/:districtId/markets`** — APMC mandis within a district.
- **`GET /api/markets`** — All active APMC markets.

### 4. Market Prices
- **`GET /api/market-prices`**  
  *Query Parameters:* `commodity`, `market`, `startDate`, `endDate`, `days`, `lang`  
  *Example:* `GET /api/market-prices?commodity=Tomato&market=Koyambedu&days=30`
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-09-26",
      "commodity": "Tomato",
      "market": "Koyambedu",
      "minPrice": 31.9,
      "maxPrice": 37.9,
      "modalPrice": 34.7,
      "unit": "₹/kg",
      "source": "AGMARKNET (DMI)"
    }
  ],
  "meta": {
    "stats": {
      "latestPrice": 34.7,
      "minPrice": 31.3,
      "maxPrice": 39.7,
      "avgPrice": 35.5,
      "percentageChange": 22.18,
      "trend": "UP",
      "pricePosition": "UPPER_RANGE",
      "percentile": 78
    }
  }
}
```

### 5. Multi-Market Comparison
- **`GET /api/market-prices/compare?commodity=Tomato&markets=Koyambedu,Madurai,Coimbatore&distanceKm=50&transportRatePerKm=12`**
```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "marketName": "Koyambedu",
        "latestPrice": 34.7,
        "netRealization": 34.1,
        "priceChange": 22.18
      },
      {
        "marketName": "Coimbatore",
        "latestPrice": 32.9,
        "netRealization": 32.3,
        "priceChange": 16.67
      }
    ],
    "metrics": {
      "highestPrice": 34.7,
      "lowestPrice": 29.7,
      "priceDifference": 5.0
    }
  }
}
```

### 6. Rule-Based Insights
- **`POST /api/insights/analyze`**  
  *Body:* `{ "commodityName": "Tomato", "marketName": "Koyambedu", "lang": "en" }`

### 7. Price Alerts Engine
- **`POST /api/alerts`** — Create a price alert rule.
- **`GET /api/alerts`** — Fetch user alerts.
- **`POST /api/alerts/check`** — Manually trigger background alert evaluator against latest prices.

---

## 🤖 Future Machine Learning Roadmap

As defined in `docs/architecture.md`, the current system uses deterministic calculations. Future ML microservices (e.g. temporal sequence models like LSTM, XGBoost, or Prophet) will connect downstream via the existing:
```
GET /api/forecast
```
without changing frontend or database architectures.

---

## 👥 Project Team & Credits

- **Project:** AgriLink — Market Intelligence for a Stronger Tomorrow
- **Team:** Alpha Nexus
- **Institution:** Panimalar Engineering College, Chennai, Tamil Nadu
- **Lead Developer:** Lead Full-Stack Engineer

---

## 📄 License
This project is developed for educational and research purposes under the ISC License.
