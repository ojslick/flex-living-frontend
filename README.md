## Flex Living Frontend

A React + TypeScript application that provides:
- A manager-facing Reviews Dashboard (filtering, sorting, insights, approvals)
- A public Property Detail page (approved reviews only)

This app consumes the backend at `VITE_API_BASE_URL` or a local dev proxy.

### Tech Stack

- React 19, TypeScript
- Vite 7 (dev/build), SWC React plugin
- styled-components 6 (theming + global styles)
- react-router-dom 6
- Vitest + @testing-library/react + jsdom
- ESLint 9

### Project Structure

```
frontend/
  src/
    components/
      dashboard/            # Dashboard UI and tests
      property/             # Property page UI
      trends/               # Trend/insight widgets
      ui/                   # Reusable primitives (Button, Card, Badge, Layout)
    lib/
      api.ts               # API client (uses VITE_API_BASE_URL or /api proxy)
      filters.ts           # Filtering/sorting, insights, trends, alerts
      format.ts            # Formatting helpers
      propertyData.ts      # Mock property details
      types.ts             # Frontend types
    pages/
      Dashboard/           # Reviews dashboard page
      PropertyDetail/      # Property detail page
    styles/
      theme.ts             # Design tokens (colors, radii, spacing, etc.)
      global.ts            # Global CSS reset and utilities
    test/                  # Test setup utilities
  vite.config.ts           # Dev server proxy for /api → http://localhost:3001
  vitest.config.ts         # Test config
```

### Environment

In production, point the app to your deployed backend (Railway):

```
VITE_API_BASE_URL=https://flex-living-assessment-backend.railway.app/api
```

Notes:
- In development, if `VITE_API_BASE_URL` is not set, requests fall back to `/api` and Vite proxies `/api` to `http://localhost:3001` (see `vite.config.ts`).
- `src/lib/api.ts` trims any trailing slash and builds URLs like `${VITE_API_BASE_URL}/reviews/hostaway`.

### Getting Started

Prerequisites: Node 18+ and npm

Install:
```
npm install
```

Run dev server:
```
npm run dev
```
- App: `http://localhost:5173`
- API proxied from `/api` → `http://localhost:3001`

Build for production:
```
npm run build
```

Preview production build locally:
```
npm run preview
```

Lint:
```
npm run lint
```

Tests:
```
npm run test          # watch UI
npm run test:run      # headless
npm run test:coverage # coverage report
```

### Architecture & Data Flow

- API client: `src/lib/api.ts`
  - Base URL: `VITE_API_BASE_URL` or `/api`
  - Endpoints used:
    - `GET /reviews/hostaway` → normalized reviews + aggregations
    - `GET /reviews/google` → optional Google aggregated reviews
    - `POST /reviews/:id/approve` → toggle approval
    - `GET /reviews/approvals` → approvals map

- Dashboard page: `src/pages/Dashboard`
  - Loads reviews for the selected channel (Hostaway by default)
  - Applies `lib/filters.ts` to filter, sort, paginate
  - Derives insights: category stats, monthly trends, recurring issues, performance alerts
  - Optimistic approval toggling via `toggleApprove()` and local state update

- Property Detail page: `src/pages/PropertyDetail`
  - Loads all reviews, then displays approved reviews for the targeted `propertyId`
  - Enriches UI with mock property metadata (`lib/propertyData.ts`)
  - Supports smooth-scroll to reviews when navigated from the dashboard

### UI & Design System

- Theme tokens in `styles/theme.ts` (colors, spacing, radii, shadows, typography, breakpoints)
- Global reset/utilities in `styles/global.ts`
- Reusable UI primitives in `components/ui` (Button, Card, Badge, Layout)
- Trend widgets in `components/trends` (category grid, timeline, recurring issues, performance alerts)

### Testing

- Unit tests for lib utilities (filters, formatting, property data)
- Component tests for dashboard and UI primitives
- Setup: `vitest` + Testing Library with `jsdom`

Run headless tests with coverage:
```
npm run test:coverage
```

### Deployment

- Ensure the backend is reachable and set `VITE_API_BASE_URL` accordingly
- Build the frontend with `npm run build` (outputs to `frontend/dist`)
- Serve `dist/` with any static host (e.g., Railway static, Netlify, Vercel). The app will call the backend defined by `VITE_API_BASE_URL`.

### Troubleshooting

- API 404/Network Error:
  - Verify `VITE_API_BASE_URL` (production) or that the backend dev server runs on `http://localhost:3001` (development).
  - Check CORS on backend if calling from a non-local origin.

- Empty data on dashboard:
  - Hostaway sandbox may return empty; backend falls back to mock data. Ensure backend is reachable.

- Approvals not persisting:
  - Approval state is in-memory on the backend for demo purposes and resets on restart.

## Environment

Set the API base URL for production deployments (e.g., Railway):

```
VITE_API_BASE_URL=https://flex-living-assessment-backend.railway.app/api
```

If not set, the app falls back to `/api` and the Vite dev server proxies requests to `http://localhost:3001` per `vite.config.ts`.
