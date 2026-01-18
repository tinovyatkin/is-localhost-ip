# Repository Guidelines

## Project Structure & Module Organization

- `index.js`: library entrypoint (CommonJS). Exports `async function isLocalhost(ipOrHostname, canBind?)`.
- `index.d.ts`: TypeScript types for consumers.
- `__tests__/`: Node.js test runner suites (`*.test.js`).
- `coverage/`: generated coverage output (e.g., `coverage/lcov.info`).
- `.github/`: CI workflows and repository automation.

## Build, Test, and Development Commands

- `npm ci`: install dependencies (recommended for CI/clean installs).
- `npm test`: runs the Node test runner with coverage and writes `coverage/lcov.info`.
- `node --test __tests__/hosts.test.js`: run a single test file locally.
- `npm run lint`: runs `oxlint` with autofix (`--fix --fix-suggestions`).
- `npm run format`: formats the repo with `oxfmt` (see `.oxfmtrc.json`).
- `npm run prepare`: installs git hooks via `lefthook` (runs automatically on `npm install` in many setups).

## Coding Style & Naming Conventions

- Use 2-space indentation and keep lines within ~100 chars (enforced by `oxfmt`).
- Prefer Node built-ins with the `node:` protocol (e.g., `node:dns`, `node:net`).
- Keep the package zero-dependency: avoid adding runtime deps unless there’s a strong reason.
- Tests live in `__tests__/` and use descriptive filenames (e.g., `hosts-regexp.test.js`).

## Testing Guidelines

- Framework: Node’s built-in test runner (`node --test`), invoked via `npm test`.
- Add tests alongside changes, especially for boundary IP ranges and hostname validation.
- Keep tests deterministic; avoid relying on real public DNS when possible (prefer reserved TLDs and mocks).

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits (enforced by `commitlint`):
  - Format: `type(scope): subject` (scope optional)
  - Types include `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `perf`, `style`, `revert`, `build`, `ai`
  - No trailing period in the subject
  - Example: `fix: reject invalid hostname inputs`
- PRs should include: a clear description, linked issues (if any), and tests for behavior changes.

## Agent Notes (Optional)

- See `CLAUDE.md` for a quick architecture overview and common commands tailored for code assistants.
