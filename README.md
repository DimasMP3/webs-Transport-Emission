# Transport Emission Dashboard — Metropolia MRV

> **WRI Writing Test** · Software Engineer Intern  
> A centralized web platform for calculating and consolidating CO₂ emissions across road, rail, sea, and aviation transport sectors.

---

## Problem Statement

The National Transport Authority of Metropolia currently relies on **dozens of disconnected Excel files + VBA macros** to calculate transport emissions. This approach is:

- **Error-prone** — manual copy-paste across sheets introduces silent mistakes.
- **Not scalable** — Excel chokes beyond ~1M rows; adding a new city or fuel type means editing every workbook.
- **Not transparent** — no audit trail, no version history, no single source of truth.

This application replaces that workflow with a **single web-based platform** where users can upload raw data (CSV or Excel), have emissions calculated automatically using WRI-standard formulas, and export a consolidated master dataset.

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | 4 KPI summary cards, per-sector bar chart, donut/pie chart |
| **Multi-format Import** | Drag-and-drop `.csv`, `.xlsx`, `.xls` — auto-detects format, merges all sheets |
| **Emission Calculator** | Per-sector forms (Road, Rail, Sea, Aviation) with live CO₂ calculation |
| **Consolidated Export** | One-click download of all data as a single CSV master file |
| **Reports & Reference** | Displays all WRI formulas and emission factor constants for auditability |
| **Dark / Light Theme** | Theme toggle with localStorage persistence |
| **Responsive Sidebar** | Collapses to icon-only on mobile, expands on desktop |
| **Docker-ready** | Multi-stage Dockerfile for production deployment |

---

## Tech Stack & Decision Rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Industry-standard React meta-framework. API Routes can serve as a shared backend for both web and future mobile app (React Native) — avoiding duplicate backend code. |
| Language | **TypeScript** | Catches type errors at compile time; essential when dealing with numeric calculations where a `string` slipping into a formula can silently produce `NaN`. |
| Styling | **Tailwind CSS + shadcn/ui** | Utility-first CSS for rapid iteration. shadcn/ui provides accessible, composable components following Radix UI primitives — meets the "global-standard UI/UX" requirement. |
| Charts | **Recharts** | Declarative React charting library. Lightweight, tree-shakeable, and supports responsive containers out of the box. |
| CSV Parsing | **PapaParse** | Battle-tested CSV parser with streaming support (can handle 100MB+ files without freezing the browser). |
| Excel Parsing | **SheetJS (xlsx)** | Reads `.xlsx` and `.xls` natively in the browser. Merges all sheets into one consolidated array, solving the "fragmented Excel files" problem directly. |
| Containerization | **Docker** (multi-stage) | Reproducible builds, consistent environments, easy horizontal scaling via orchestrators (ECS, Cloud Run, K8s). |

---

## CO₂ Calculation Formulas

All formulas and emission factors are sourced from the **WRI Reference Workbook**.

### General Principle
```
CO₂ = Activity Data × Emission Factor (EF)
```

### Per-Sector Formulas

| Sector | Formula | Unit |
|---|---|---|
| **Road** | `Fuel_L = Vehicles × Avg_km/yr × FuelEconomy(L/100km) / 100` → `CO₂(t) = Fuel_L × EF / 1000` | kgCO₂/L |
| **Rail (Electric)** | `CO₂(t) = Electricity_kWh × EF / 1000` | kgCO₂/kWh |
| **Rail (Diesel)** | `CO₂(t) = Diesel_L × EF / 1000` | kgCO₂/L |
| **Sea** | `Fuel_ton = Distance_NM × FuelIntensity(t/NM)` → `CO₂(t) = Fuel_ton × EF` | tCO₂/ton_fuel |
| **Aviation** | `Fuel_kg = Fuel_L × Density(0.80 kg/L)` → `CO₂(t) = Fuel_kg × EF / 1000` | kgCO₂/kg |

### Emission Factors (Placeholder Values)

| Fuel Code | EF Value | Unit |
|---|---|---|
| GASOLINE | 2.31 | kgCO₂/liter |
| DIESEL | 2.65 | kgCO₂/liter |
| B35 | 1.61 | kgCO₂/liter |
| GRID_ELECTRICITY | 0.70 | kgCO₂/kWh |
| MARINE_DIESEL | 3.18 | tCO₂/ton_fuel |
| HFO_LFO | 3.17 | tCO₂/ton_fuel |
| LNG_LPG | 3.02 | tCO₂/ton_fuel |
| JET_FUEL | 3.16 | kgCO₂/kg_fuel |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard (composition root)
│   ├── calculator/page.tsx       # Per-sector calculator forms
│   ├── reports/page.tsx          # Formula reference & EF table
│   └── import/page.tsx           # Redirects to dashboard
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── dashboard/                # SummaryCards, EmissionChart, DataUploader, EmissionTable
│   ├── layout/                   # Sidebar, DashboardHeader
│   └── providers/                # ThemeProvider, ClientProviders
├── types/emission.ts             # Centralized TypeScript types
├── constants/emission-factors.ts # EF constants (single source of truth)
├── utils/calculator.ts           # Pure calculation functions
├── data/mock-data.ts             # Seed data mirroring WRI dummy dataset
└── lib/utils.ts                  # shadcn utility (cn)
```

**Design principles:**
- **Separation of concerns** — types, constants, calculations, and UI are in separate modules.
- **Pure functions** — `calculator.ts` has zero side effects; easy to unit test.
- **Thin page components** — `page.tsx` files only compose child components; no business logic.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Run Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t metropolia-mrv .
docker run -p 3000:3000 metropolia-mrv
```

---

## Scalability Strategy (100–1000× Users/Data)

The test requires demonstrating how the app can handle a **significant increase in usage**. Here is the architectural strategy:

### 1. Stateless Frontend (Horizontal Scaling)
The Next.js app is **stateless** — no server-side session or in-memory data. This means you can run N instances behind a load balancer (e.g., AWS ALB, Google Cloud Load Balancer) and scale horizontally with zero code changes.

```
                    ┌──────────────┐
  Users ──→ LB ──→  │  App Instance │  ×N (Docker containers)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Database    │  (BigQuery / ClickHouse)
                    └──────────────┘
```

### 2. Analytical Database (BigQuery or ClickHouse)
For production at scale, raw emission data should be stored in a **columnar analytical database**, not traditional row-based RDBMS:

| Criteria | BigQuery | ClickHouse |
|---|---|---|
| **Query speed on 100M+ rows** | Sub-second (serverless, auto-scales) | Sub-second (self-hosted, column-oriented) |
| **Cost model** | Pay-per-query (ideal for intermittent government reporting) | Fixed hosting cost (ideal for high-frequency dashboards) |
| **Recommended for** | Metropolia's use case (periodic reporting, variable load) | High-frequency real-time monitoring |

**Why not PostgreSQL?** At 1000× scale, Metropolia would have billions of historical emission records. Traditional RDBMS performs full row scans for aggregation queries (`SUM`, `GROUP BY`); columnar databases only read the columns needed, making them orders of magnitude faster for analytical workloads.

### 3. Background Processing (Queue-Based Ingestion)
At high volume, file uploads should be processed asynchronously:

```
Upload → Object Storage (S3/GCS) → Queue (SQS/Pub/Sub) → Worker → BigQuery
```

This decouples the upload UI from the heavy parsing/calculation work, preventing timeouts and ensuring reliability.

### 4. Docker + Orchestration
The included `Dockerfile` uses a multi-stage build producing a minimal production image. Deploy via:
- **Google Cloud Run** — auto-scales to zero, pay only for active requests.
- **AWS ECS / Fargate** — managed container orchestration.
- **Kubernetes** — for full control at enterprise scale.

---

## AI Tools Usage Disclosure

As required by the test instructions, the following AI tools were used during development:

| Tool | Purpose |
|---|---|
| **Google Gemini (Antigravity)** | Code generation, architecture design, debugging, and documentation writing. All generated code was reviewed, tested (`npm run lint`, `npm run build`), and adjusted to ensure correctness. |

**Decision rationale:** AI-assisted development was chosen to maximize output quality within the 6-hour time constraint. The AI was used as a pair programmer — generating boilerplate and suggesting architecture — while all domain-specific logic (WRI formulas, emission factors, data model) was validated manually against the provided reference workbook.

---

## License

This project was created as part of a WRI technical assessment.
