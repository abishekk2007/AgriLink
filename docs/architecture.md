# AgriLink — System Architecture & Technical Specifications

> **Project:** AgriLink — Market Intelligence for a Stronger Tomorrow  
> **Team:** Alpha Nexus  
> **Institution:** Panimalar Engineering College  
> **Core Principle:** Production-quality agricultural market intelligence based on verified government mandi records and deterministic, transparent business rules.

---

## 1. High-Level System Architecture

AgriLink is architected with a decoupled frontend and backend service structure. The user interface does not directly touch the database; all data flows securely through a validated REST API layer.

```mermaid
flowchart TD
    subgraph Data_Sources ["Government Mandi Feeds"]
        A1[AGMARKNET / DMI]
        A2[Open Government Data - data.gov.in]
        A3[CACP MSP Gazettes]
    end

    subgraph Ingestion_Pipeline ["Data Ingestion Engine"]
        B1[Data Ingestion Service]
        B2[Validation: Prices >= 0, Min <= Modal <= Max]
        B3[Name Normalization: Crop & APMC]
        B4[Deduplication & Audit Logger]
    end

    subgraph Persistence_Layer ["Database (PostgreSQL + Prisma)"]
        C1[(PostgreSQL Database)]
        C2[MarketPrice with Compound Indexes]
        C3[Commodity & MSP Tables]
        C4[State, District & APMC Tables]
        C5[PriceAlerts & ImportLogs]
    end

    subgraph Backend_Services ["Express REST API Layer (Node.js/TS)"]
        D1[Express API Server :5001]
        D2[Market Service]
        D3[Analytics Service]
        D4[Insight Service]
        D5[Alert Service & Background Checker]
        D6[Security: Helmet, CORS, RateLimiter, Zod]
    end

    subgraph Frontend_App ["AgriLink SaaS Web App (Next.js/React 19)"]
        E1[Dashboard Overview]
        E2[Market Prices Workspace]
        E3[Multi-Market Comparison]
        E4[Transport Net Realization]
        E5[Price Alerts Manager]
        E6[Rule-Based Insights Panel]
        E7[Tamil & Voice Search - Web Speech API]
    end

    subgraph End_User ["Target Beneficiaries"]
        F1[Farmers & FPOs]
        F2[APMC Traders & Agricultural Extension Officers]
    end

    Data_Sources --> B1
    B1 --> B2 --> B3 --> B4 --> C1
    C1 --> C2 & C3 & C4 & C5
    C1 <--> D1
    D1 --> D2 & D3 & D4 & D5
    D6 --> D1
    D1 <--> Frontend_App
    Frontend_App --> End_User
```

---

## 2. Data Ingestion Architecture & Provenance

The system enforces strict data verification before writing to PostgreSQL:

```mermaid
sequenceDiagram
    autonumber
    participant Feed as AGMARKNET Feed / DMI
    participant Ingest as DataImportService
    participant DB as PostgreSQL (Prisma)
    participant Log as PriceImportLog

    Feed->>Ingest: Ingest Daily Mandi Batch
    Note over Ingest: Validate non-negative prices
    Note over Ingest: Validate Min <= Modal <= Max
    Note over Ingest: Validate ISO date format
    Note over Ingest: Normalize Crop & APMC name aliases
    Ingest->>DB: Upsert into MarketPrice (compound unique key)
    Ingest->>Log: Record recordsImported, status & error details
    Ingest->>DB: Update DataSource lastUpdated timestamp
```

### Ingestion Validation Rules:
1. **Price Positivity**: `price >= 0`
2. **Order Consistency**: `minPrice <= modalPrice <= maxPrice` (auto-sorts inverted trader inputs).
3. **Strict Date Parsing**: Format must match `YYYY-MM-DD`.
4. **Duplicate Protection**: Compound unique constraint `[commodityId, marketId, date]`.

---

## 3. Database Entity Relationship Model (ERD)

```mermaid
erDiagram
    STATE ||--o{ DISTRICT : "has"
    DISTRICT ||--o{ MARKET : "contains"
    COMMODITY ||--o{ MARKET_PRICE : "priced in"
    MARKET ||--o{ MARKET_PRICE : "trades"
    DATA_SOURCE ||--o{ MARKET_PRICE : "provides"
    DATA_SOURCE ||--o{ PRICE_IMPORT_LOG : "records"
    COMMODITY ||--o{ MSP : "governed by"
    COMMODITY ||--o{ PRICE_ALERT : "alert on"
    MARKET ||--o{ PRICE_ALERT : "alert for"
    USER ||--o{ PRICE_ALERT : "owns"

    STATE {
        string id PK
        string name UK
        string code UK
    }

    DISTRICT {
        string id PK
        string name
        string stateId FK
    }

    MARKET {
        string id PK
        string name
        string code UK
        string districtId FK
        string address
        float latitude
        float longitude
    }

    COMMODITY {
        string id PK
        string name
        string code UK
        string category
        string defaultUnit
        string icon
        boolean isMspCovered
    }

    MARKET_PRICE {
        string id PK
        string commodityId FK
        string marketId FK
        date date
        float minPrice
        float maxPrice
        float modalPrice
        string unit
        string sourceId FK
    }

    PRICE_ALERT {
        string id PK
        string userId FK
        string commodityId FK
        string marketId FK
        float targetPrice
        string condition
        string status
        datetime triggeredAt
        string notes
    }

    MSP {
        string id PK
        string commodityId FK
        string season
        int year
        float price
        string unit
        string source
    }
```

---

## 4. Deterministic Analytics Engine Specifications

AgriLink deliberately avoids black-box AI guessing for market prices, relying instead on reproducible mathematical formulations:

### 1. Historical Trend Calculation
$$\text{Percentage Change} = \left(\frac{\text{Latest Price} - \text{First Price}}{\text{First Price}}\right) \times 100$$
- $\text{Change} \ge +1.5\% \implies \mathbf{UP}$ (Upward Trend)
- $\text{Change} \le -1.5\% \implies \mathbf{DOWN}$ (Softening Trend)
- $-1.5\% < \text{Change} < +1.5\% \implies \mathbf{STABLE}$ (Consolidation)

### 2. Price Position Percentile
$$\text{Percentile Rank} = \left(\frac{C_{\text{below}} + 0.5 \times C_{\text{equal}}}{N}\right) \times 100$$
- $\text{Percentile} \ge 66.6\% \implies \mathbf{UPPER\_RANGE}$
- $33.3\% \le \text{Percentile} < 66.6\% \implies \mathbf{MIDDLE\_RANGE}$
- $\text{Percentile} < 33.3\% \implies \mathbf{LOWER\_RANGE}$

### 3. Volatility Index (Coefficient of Variation)
$$CV = \left(\frac{\sigma}{\mu}\right) \times 100$$
- $CV < 8\% \implies \mathbf{LOW}$ (Steady Trading)
- $8\% \le CV \le 18\% \implies \mathbf{MEDIUM}$ (Moderate Fluctuation)
- $CV > 18\% \implies \mathbf{HIGH}$ (Rapid Price Swings)

### 4. Net Farmer Realization (Transport Calculator)
$$\text{Gross Market Value} = \text{Market Price} \times \text{Quantity (kg)}$$
$$\text{Total Transport Cost} = \text{Distance (km)} \times \text{Transport Rate (₹/km)}$$
$$\text{Net Realization} = \max(0, \text{Gross Market Value} - \text{Total Transport Cost})$$
$$\text{Net Realization per kg} = \frac{\text{Net Realization}}{\text{Quantity (kg)}}$$

---

## 5. Security & Reliability

- **Helmet**: Secures HTTP response headers against clickjacking, sniffing, and cross-site injection.
- **CORS**: Strict origin whitelist matching client port and local host.
- **Rate Limiting**: `express-rate-limit` prevents API brute-forcing (200 requests / 15 mins).
- **Zod Validation**: Strong runtime schema validation on all query parameters and request bodies.
- **Mock Fallback**: Frontend automatically switches to offline demo data if backend connection drops, with a visible "Demo Data" badge.

---

## 6. Future Machine Learning Forecasting Architecture

While the current system uses deterministic government data, the architecture is designed to support downstream ML forecasting services without altering the core database or client applications:

```mermaid
flowchart LR
    subgraph Core_DB ["AgriLink PostgreSQL"]
        M1[Cleaned Market Prices]
        M2[Historical 5-Year Mandi Data]
    end

    subgraph ML_Microservice ["Future ML Service (Python / FastAPI)"]
        F1[Feature Engineering: Lags, Rainfall, Seasonality]
        F2[Model Pipeline: XGBoost / LSTM / Prophet]
        F3[Confidence Interval Estimator]
    end

    subgraph API_Gateway ["AgriLink Gateway"]
        E1[GET /api/forecast]
    end

    subgraph UI ["AgriLink Dashboard"]
        U1[Forecasting Chart with Confidence Bands]
    end

    M1 & M2 --> F1 --> F2 --> F3 --> E1 --> U1
```
