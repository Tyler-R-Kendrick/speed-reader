# OpenAI Codex Guidelines

This repository uses TypeScript and Lit to build web components, a browser extension, and a small PWA demo. When modifying code you should:

- Keep the codebase accessible and mobile friendly. Follow WCAG 2.1 AA guidelines and prefer responsive, mobile‑first layout techniques.
- Use the `webcomponents` package as the source of truth for the RSVP player component. Tests live under `webcomponents/src` and must pass via `npm test`.
- Run `npm run lint` before committing. The linter checks TypeScript code with ESLint (including `lit-a11y`) and CSS with Stylelint.
- New lint rules using SonarJS and Unicorn enforce software craftsmanship. Fix or disable warnings to keep code clean, DRY, and easy to maintain.
- Practice the Boy Scout Rule: whenever you touch code, run the linters and clean up any warnings you encounter.
- Follow Uncle Bob's Clean Code and Architecture guidelines. Keep modules small, respect SRP, and avoid needless repetition.
- When adding new features, include unit tests and ensure existing tests keep ≥90% coverage.
- GitHub Actions run `npm run lint` and `npm test`. Make sure they succeed locally before pushing.

