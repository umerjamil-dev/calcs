# Mal Pakistan — Retail Forecourt Distribution System

A distribution management system connecting **Retail Forecourts**, **Distributors**, and **Customer Service** in a streamlined order-to-settlement workflow.

---

## Business Flow

```
┌─────────────────┐
│  Retail         │
│  Forecourt      │
└────────┬────────┘
         │
         │ ① Place Order (Dedicated Ordering App)
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                           MAL PAKISTAN                                  │
│                     Customer Service — Order Received                   │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ ② Assign Order
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                         Dedicated Distributor                           │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
    ┌───────────┐
    │  Can      │
    │  Deliver? │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │           │
   YES         NO
    │           │
    │           └──→ Return to Customer Service
    │                → Assign Alternate Distributor
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Deliver Products                                                       │
│  • Published Retail Price                                               │
│  • 30 Days Credit                                                       │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                         RETAIL FORECOURT                                │
│                  Receive Products — Stamp & Sign Invoice                │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                           DISTRIBUTOR                                   │
│              Upload Signed Invoice (Proof of Delivery)                  │
│                         via Mobile App                                  │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                           MAL PAKISTAN                                  │
│              Customer Service — Verify Delivery with Forecourt          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
    ┌───────────────┐
    │  Delivery     │
    │  Confirmed?   │
    └───────┬───────┘
            │
    ┌───────┴───────┐
    │               │
   YES              NO
    │               │
    │               └──→ Investigate & Resolve Issue
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Close Cycle                                                             │
│                                                                         │
│  ─── Month-End Commercial Settlement ───                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Process Overview

1. **Order Placement** — Retail Forecourt places an order through the dedicated ordering app.
2. **Order Assignment** — Customer Service receives and assigns the order to a distributor.
3. **Delivery Decision** — Distributor accepts or declines; declined orders are reassigned.
4. **Product Delivery** — Distributor delivers at published retail price with 30-day credit terms.
5. **Invoice Sign-off** — Forecourt receives goods, stamps and signs the invoice.
6. **Proof of Delivery** — Distributor uploads the signed invoice via mobile app.
7. **Verification** — Customer Service verifies delivery completion with the forecourt.
8. **Cycle Closure** — Confirmed deliveries close the cycle; discrepancies are investigated.
9. **Settlement** — Month-end commercial settlement concludes the financial cycle.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand v5
- **Build:** Vite + tsc

---

## Getting Started

```bash
npm install
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
