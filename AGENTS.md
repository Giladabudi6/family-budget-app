# Antigravity Workspace Director

Welcome to the **Budget App** workspace. This file defines the global rules, tech stack, and conventions to ensure efficient, token-saving, and precise AI development.

---

## 1. Tech Stack Overview

- **Frontend Framework:** React 19 (Functional Components, Custom Hooks)
- **Bundler & Tooling:** Vite, ESLint
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` plugin, utility-first styling)
- **Icons:** Lucide React
- **Backend & Database:** Firebase Firestore (Real-time subscriptions and collections)
- **Deployment:** Vercel

---

## 2. Directory Structure

```text
budget-app/
├── AGENTS.md                 # This file - global guidelines & directory map
├── .agents/                  # AI Knowledge Base & Context
│   ├── rules/                # Automated rules (React, Firebase)
│   ├── dashboard/            # Dashboard context
│   ├── transactions/         # Transactions context
│   └── quick_tools/          # Quick tools (Schedule, Tasks, Shopping, Vouchers)
├── src/                      # Source Code
│   ├── components/           # UI Components (dashboard, features, layout, transactions)
│   ├── hooks/                # Firebase synchronizing custom hooks
│   ├── services/             # Firebase SDK setup
│   └── utils/                # Helper functions (calculations, formatting)
```

---

## 3. General Rules of Engagement

1. **Do Not Touch Unrelated Code:** Never rewrite or alter existing components, utilities, or styles unless explicitly requested by the user.
2. **Keep Context Small (Save Tokens):** 
   - Do not read whole directories or large files unless necessary.
   - Refer to `.agents/<module>/context.md` before analyzing code.
3. **Follow React 19 Guidelines:** Avoid obsolete APIs. Keep components functional, clean, and modular.
4. **Use Firestore Real-time Sync:** Ensure components consume state from custom hooks (`src/hooks/`) which manage the real-time Firebase subscription.

---

## 4. Self-Updating Documentation Rule

> [!IMPORTANT]
> **Whenever you create a new feature or subdirectory, or perform a major refactor of an existing module:**
> 1. You must create or update the corresponding Markdown documentation under `.agents/<feature_name>/` describing the feature's architecture, states, and files.
> 2. Document any new data schemas, hooks, or components created.
> 3. This ensures future agents can pick up the work instantly without reading all source files.

