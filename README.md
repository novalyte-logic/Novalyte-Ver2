# Novalyte Ver2

This app now uses Supabase for auth, data storage, and realtime subscriptions.

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set:
   `VITE_SUPABASE_URL`
   `VITE_SUPABASE_PUBLISHABLE_KEY`
   `SUPABASE_SECRET_KEY`
   `GEMINI_API_KEY`
3. Apply the SQL in [supabase/migrations/20260315090000_documents_compat.sql](/Users/jamilyakasai/Novalyte-Ver2/supabase/migrations/20260315090000_documents_compat.sql) to your Supabase project.
4. In Supabase Auth:
   add `http://localhost:3000` and `http://127.0.0.1:3000` to redirect URLs
   enable the Google provider if you want clinic, workforce, and admin Google sign-in
5. Run the app:
   `npm run dev`

## MCP

- Workspace MCP config is in [.vscode/mcp.json](/Users/jamilyakasai/Novalyte-Ver2/.vscode/mcp.json).
- Codex also needs a successful `codex mcp login supabase` OAuth flow before Supabase MCP tools are available in-session.

## Architecture

- Browser auth uses Supabase Auth with Google OAuth.
- Browser reads and writes use a Firestore-compatible document layer backed by the `public.documents` table.
- Express API routes use a server-only Supabase secret key for privileged admin and workforce operations.
- Realtime updates use Supabase Realtime on the `documents` table.

## Notes

- The old Firebase config files are no longer used.
- The Supabase SQL migration is required before the app can read or write data successfully.
