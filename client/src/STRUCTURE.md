# Project Structure

This document explains the folder structure for the AI Maintenance Predictor Dashboard MVP.

## Structure Overview

```
src/
├── app/              # Application layer
│   ├── routes/       # Page components (Dashboard, Assets, AssetDetail)
│   └── router.tsx    # Routing configuration
│
├── components/       # Shared UI components
│   ├── RiskBadge/    # Green/Yellow/Red risk indicator
│   ├── Chart/        # Recharts wrapper components
│   ├── Layout/       # Page layout components
│   └── ...
│
├── hooks/            # Shared React hooks
│   ├── useApi.ts     # API request hooks
│   ├── useUpload.ts  # File upload hook
│   └── ...
│
├── lib/              # Reusable libraries & utilities
│   ├── api.ts        # API client (axios/fetch wrapper)
│   ├── formatters.ts # Data formatting utilities
│   └── validators.ts # CSV validation, etc.
│
├── types/            # TypeScript type definitions
│   ├── api.ts        # API response types
│   ├── asset.ts      # Asset-related types
│   └── ...
│
├── stores/           # State management (if needed)
│   └── workflow.ts   # Workflow state (upload/train/assess progress)
│
└── config/           # Configuration
    └── constants.ts  # API endpoints, risk thresholds, etc.
```

## Why This Structure?

### ✅ Appropriate for MVP

1. **Simple & Flat**: Only 3 pages means we don't need complex feature isolation
2. **Clear Separation**: Pages vs. shared components vs. utilities is easy to understand
3. **Easy to Navigate**: Developers can quickly find what they need
4. **Low Overhead**: No unnecessary abstraction layers

**But for this MVP:**
- Upload, Training, and Assessment are **one cohesive workflow**, not separate features
- Only 3 pages means minimal complexity
- No need for feature isolation yet
- Can always refactor to feature-based later if the project grows


## Folder Responsibilities

### `app/routes/`
Contains the 3 main page components:
- `Dashboard.tsx` - Main workflow (Upload → Train → Assess)
- `Assets.tsx` - Fleet overview table
- `AssetDetail.tsx` - Individual asset view with charts

### `components/`
Reusable UI components used across pages:
- `RiskBadge` - Visual risk indicator (Green/Yellow/Red)
- `Chart` - Wrapper components for Recharts
- `Layout` - Page layout, navigation, etc.
- `Button`, `Table`, etc. - Other shared UI elements

### `hooks/`
Custom React hooks for shared logic:
- `useApi` - API request handling
- `useUpload` - File upload logic
- `useAssets` - Asset data fetching

### `lib/`
Pure utility functions and API client:
- `api.ts` - Centralized API client
- `formatters.ts` - Date formatting, number formatting
- `validators.ts` - CSV validation, data validation

### `types/`
TypeScript type definitions shared across the app.

### `stores/`
Global state management (if needed). For MVP, might just track:
- Workflow progress (which step user is on)
- Current asset selection
- Training status

### `config/`
Configuration constants:
- API base URL
- Risk thresholds (Green/Yellow/Red boundaries)
- Chart configuration defaults

## Import Rules

Keep imports simple and clear:
- ✅ Pages import from `components/`, `hooks/`, `lib/`, `types/`
- ✅ Components import from `hooks/`, `lib/`, `types/`
- ✅ Hooks import from `lib/`, `types/`
- ❌ Avoid circular dependencies
- ❌ Don't import from `app/routes/` in shared code

But for now, **keep it simple and focused on delivering the MVP**.

