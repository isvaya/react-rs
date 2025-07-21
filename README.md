# PokéApi React App

A React + TypeScript application for searching Pokémon via the [PokeAPI](https://pokeapi.co/).

## Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd <your-repo-folder>

# Install dependencies
npm install
```

> **Note:** Husky Git hooks will be set up automatically during install.

## Available Scripts

| Command               | Description                                                               |
|-----------------------|---------------------------------------------------------------------------|
| `npm run dev`         | Start Vite dev server (http://localhost:5173)                             |
| `npm run build`       | Compile TypeScript and build production bundle with Vite                  |
| `npm run preview`     | Preview the production build locally                                      |
| `npm run lint`        | Run ESLint to check code quality                                          |
| `npm run format`      | Run Prettier to format all files                                          |
| `npm run test`        | Launch Vitest in interactive mode                                         |
| `npm run test:run`    | Run all tests once                                                        |
| `npm run test:watch`  | Run Vitest in watch mode to re-run tests on file changes                  |
| `npm run test:ui`     | Launch Vitest with web-based UI                                           |
| `npm run coverage`    | Run tests with coverage report (blocks on failures if thresholds not met)  |

## Git Hooks (Husky)

- **pre-commit**  
  - `npm run lint`  
  - `npm run format`

- **pre-push**  
  - `npm run test`