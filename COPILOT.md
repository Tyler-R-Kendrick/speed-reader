# GitHub Copilot Usage

This project prefers clean, idiomatic TypeScript. When using Copilot suggestions:

- Prioritize readable code with descriptive names and comments.
- Favour Lit patterns and functional helpers from existing modules.
- Ensure any generated markup includes proper ARIA labels and works on mobile screens.
- Add or update tests alongside any feature code.
- Run `npm run lint` and `npm test` to verify before committing.
- Respect the DRY, SRP and KISS principles. Refactor Boy Scout style and lean on the linter to catch smells from SonarJS and Unicorn. Run the linter when editing existing files and tidy up warnings as you go.
- Embrace Uncle Bob's Clean Code guidelines. Keep functions short, use expressive names, and aim for modular design.
