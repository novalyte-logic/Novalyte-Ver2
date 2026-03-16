# AGENTS.md

This document provides AI coding agents with essential context about the Novalyte-Ver2 codebase.

## Architecture

This is a full-stack TypeScript application with a React frontend and an Express backend.

- **Frontend**: A React single-page application located in the `src` directory. It uses Vite for bundling and development.
- **Backend**: An Express server in the `server` directory. It handles API requests, server-side validation, and communication with Supabase.
- **Database**: The application uses Supabase for its database, authentication, and real-time features. The database schema migrations are in `supabase/migrations`.

### Data Flow

- The frontend interacts with the backend through API endpoints defined in `server/routes`.
- The backend uses a Supabase client with admin privileges (`server/lib/supabaseAdmin.ts`) to interact with the database.
- The frontend also interacts directly with Supabase for some data operations and real-time updates, using a publishable key.
- Public forms and patient assessments are handled by the backend for server-side validation and persistence.

## Frontend

The frontend is a React application built with Vite.

- **Pages**: Top-level page components are in `src/pages`. These correspond to different URL routes.
- **Components**: Reusable UI components are organized in `src/components`.
- **Services**: Client-side logic for making API calls to the backend is in `src/services`. Each file corresponds to a backend route group (e.g., `src/services/clinic.ts` for `server/routes/clinic.ts`).
- **Authentication**: The frontend handles authentication using Supabase Auth. The UI for this is in `src/components/auth`.

## Backend

The backend is an Express server written in TypeScript.

- **Routes**: API endpoints are defined in `server/routes`. Each file groups related endpoints (e.g., `admin.ts`, `clinic.ts`).
- **Services**: Backend logic is in `server/lib`. This includes services for AI (`aiService.ts`), session management (`authSession.ts`), and the Supabase admin client (`supabaseAdmin.ts`).
- **Environment**: The backend configuration is managed through environment variables defined in `server/lib/env.ts`.

## Key Workflows

### Local Development

1.  Install dependencies: `npm install`
2.  Set up your `.env` file by copying `.env.example`.
3.  Apply the database migrations from `supabase/migrations`.
4.  Run the development server: `npm run dev`

### Building for Production

- Run `npm run build` to create a production-ready build in the `dist/` (frontend) and `server-dist/` (backend) directories.

### Running in Production

- Run `npm run start` to start the production server.

## External Services

- **Supabase**: Used for database, authentication, and real-time features.
- **Gemini**: The AI service for features like "Ask AI" is powered by Google's Gemini, configured in `server/lib/aiService.ts`.

## Conventions

- API routes are versioned implicitly by their file structure.
- Client-side services in `src/services` mirror the backend route structure in `server/routes`.
- Use the Supabase admin client in `server/lib/supabaseAdmin.ts` for all backend database operations.

