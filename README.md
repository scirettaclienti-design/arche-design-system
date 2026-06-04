# @scirettaclienti-design/arche-design-system

Design tokens, self-hosted fonts, and Tailwind preset for the Arche design system.

## Install

```bash
pnpm add @scirettaclienti-design/arche-design-system
```

Requires an `.npmrc` pointing the scope to GitHub Packages:

```
@scirettaclienti-design:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Usage

```ts
import "@scirettaclienti-design/arche-design-system/fonts/fonts.css";
import "@scirettaclienti-design/arche-design-system/tokens/index.css";
```

Tailwind:

```ts
import preset from "@scirettaclienti-design/arche-design-system/tailwind/preset";

export default { presets: [preset], content: [...] };
```

## Develop

```bash
pnpm install
pnpm build
```
