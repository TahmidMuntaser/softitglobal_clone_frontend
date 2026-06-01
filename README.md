# SoftITGlobal Clone Frontend

Next.js frontend for the SoftITGlobal ecommerce clone. This app is the user-facing layer that will connect to a Django + DRF backend for authentication, product data, cart, checkout, and account features.

## Tech Stack

- Next.js 15
- React 19
- Node.js
- CSS for global styling
- Django REST Framework backend integration

## Setup From A Fork

1. Fork this repository on GitHub.
2. Clone your fork locally.
3. Open the project folder in your editor.
4. Install dependencies with `npm install`.
5. Start the frontend with `npm run dev`.
6. Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run the Next.js linter

## Project Structure

- `src/app` - App Router pages and route groups
- `src/components` - shared UI and feature components
- `src/features` - feature-based frontend modules
- `src/services` - API and backend communication helpers
- `src/hooks` - reusable React hooks
- `src/contexts` - React context providers
- `src/store` - application state management
- `src/lib` - helper utilities
- `src/constants` - shared constants
- `src/types` - shared type definitions
- `public` - static assets
- `tests` - unit and end-to-end test folders

## Backend Connection

This frontend is intended to consume a Django REST API. The API base URL and environment values can be added later when the backend endpoints are ready.
