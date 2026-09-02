# Budget App

A modern web application for household budget management, tracking expenses and incomes, managing tasks, shopping lists, and a weekly family schedule with real-time cloud synchronization.

## Tech Stack
* **Frontend:** React, Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Database & Sync:** Firebase Firestore (Real-time synchronization)[cite: 1]
* **Deployment:** Vercel[cite: 1]

## Core Features[cite: 1]
* **Financial Dashboard:** Monthly summaries, budget goals, and category expense analysis[cite: 1].
* **Transaction Management:** Add, delete, and filter expenses, incomes, and savings[cite: 1].
* **Quick Tools:**
  * **Weekly Schedule:** Plan current and next week's schedule with real-time sync[cite: 1].
  * **Task List:** Manage categorized household tasks[cite: 1].
  * **Smart Shopping List:** Toggle between editing and shopping modes with synchronized checklist items[cite: 1].
* **Recurring Payments & Vouchers:** Track fixed periodic payments and manage vouchers[cite: 1].

## Project Structure[cite: 1]
```text
budget-app/
├── src/
│   ├── components/
│   │   ├── dashboard/    # Summary, goals, and category components[cite: 1]
│   │   ├── features/     # Quick tools, tasks, shopping, and vouchers[cite: 1]
│   │   ├── layout/       # Layout wrappers and headers[cite: 1]
│   │   └── transactions/ # Forms and transaction list management[cite: 1]
│   ├── hooks/            # Custom hooks for state management and Firebase sync[cite: 1]
│   ├── services/         # Firebase service initialization[cite: 1]
│   └── utils/            # Helper functions, financial calculations, and categories[cite: 1]
├── public/               # Static assets and manifest[cite: 1]
└── package.json          # Project dependencies[cite: 1]