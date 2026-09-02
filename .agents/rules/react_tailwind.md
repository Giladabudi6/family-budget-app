# React & Tailwind CSS Guidelines

Rules and conventions for React 19 and Tailwind CSS v4 development in this workspace.

---

## 1. React 19 Coding Standards

- **Functional Components:** Always use functional components with arrow functions (e.g., `const MyComponent = () => { ... }`).
- **Hook Placement:** Custom hooks must reside in `src/hooks/`. Keep UI components thin by delegating state sync and business logic to hooks.
- **Props Validation:** If TypeScript is not used, document props in a comment above the component, and handle defaults cleanly.
- **Side Effects:** Clean up all listeners, intervals, and subscriptions inside `useEffect` return statements to avoid memory leaks.

---

## 2. Tailwind CSS v4 Rules

- **Utility First:** Do not write custom CSS in CSS files unless styling custom animations or resetting styles. Use Tailwind utilities directly in `className`.
- **Tailwind v4 Integration:** This project uses `@tailwindcss/vite` (Tailwind CSS v4). Theme variables, custom utility classes, and @directives should be configured in `src/index.css` using CSS variables or standard Tailwind v4 syntax. Do not expect a `tailwind.config.js` to exist or be used.
- **Responsive Design:** Use prefix modifiers (`sm:`, `md:`, `lg:`) for responsive styling.
- **Interactive States:** Explicitly define `:hover`, `:focus`, and `:active` states using `hover:`, `focus:`, and `active:` classes.
- **Icons:** Use `lucide-react` for all iconography. Keep icon sizes consistent (typically `w-4 h-4` or `w-5 h-5`).

