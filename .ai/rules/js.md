---
paths:
  - resources/js/app.tsx
---

# Js

## Use negated glob array, not exclude, for Pages glob
`import.meta.glob` in rolldown-vite 8.x does NOT support the `exclude` option (silently ignored — test files still get bundled). Use the negated array form instead: `import.meta.glob(['./Pages/**/*.tsx', '!./Pages/**/*.test.tsx'])`. This keeps `*.test.tsx` files and their test-only deps (vitest/@testing-library) out of the production bundle.
