# Riepilogo — archè design system

**Stato:** v0.1.0 pubblicato su GitHub Packages.
**Ultima sessione:** 2026-06-04.

Questo file serve a riprendere il lavoro in una sessione futura: aprire la cartella `~/arche-design-system`, leggere questo file, e tutto il contesto è recuperato.

---

## 1. Identità del package

| Campo | Valore |
|---|---|
| Nome | `@scirettaclienti-design/arche-design-system` |
| Versione | `0.1.0` (dist-tag `latest`) |
| Registry | `https://npm.pkg.github.com` |
| Access | `restricted` (solo collaboratori del repo possono installare) |
| Tarball shasum | `28a0b6956908ff059ebbe704c0358599edfc28ce` |
| URL pacchetto | https://github.com/scirettaclienti-design/arche-design-system/packages |

## 2. Repo Git

| Campo | Valore |
|---|---|
| Locale | `~/arche-design-system` |
| Remoto | `https://github.com/scirettaclienti-design/arche-design-system.git` (HTTPS, non SSH) |
| Branch | `main` → tracks `origin/main` |
| Commit iniziale | `a298c5f` — "feat: design system v0.1.0 — tokens, fonts, tailwind preset" |
| Tag | `v0.1.0` (annotato, pushato) |

**Perché HTTPS e non SSH:** la chiave `~/.ssh/id_ed25519` non era autorizzata su GitHub. Auth HTTPS usa il token `gh` CLI (`gho_...`) automaticamente.

## 3. Stack & versioni installate

- **pnpm 11.5.1** (installato in `~/.local/bin` via `corepack enable --install-directory ~/.local/bin`, niente sudo)
- **unbuild ^2.0.0** (bundler)
- **typescript ^5.4.0** (resolved 5.9.3)
- **tailwindcss ^3.4.0** (resolved 3.4.19) — devDep, solo per tipare il preset

## 4. Struttura cartella

```
arche-design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.css        (palette inchiostro/bone/oro)
│   │   ├── typography.css    (fluid type scale, eyebrow utility)
│   │   ├── spacing.css       (band/block/stack, colonne max-width)
│   │   ├── motion.css        (ease curves, durations, reduced-motion)
│   │   └── index.css         (importa tutto + fonts.css + base globals + grain inline)
│   ├── fonts/
│   │   ├── fonts.css         (12 @font-face, latin subset, font-display: swap)
│   │   ├── bodoni-moda/      (2 woff2: normal + italic, font-weight: 400 700)
│   │   ├── cormorant-garamond/ (2 woff2: normal + italic, font-weight: 400 600)
│   │   └── spectral/         (8 woff2: 300/400/500/600 × normal/italic, file distinti)
│   ├── tailwind/preset.ts    (mappa tutti i token su classi Tailwind via CSS vars)
│   └── index.ts              (re-export tailwindPreset)
├── dist/                     (gitignored, rigenerato da unbuild)
├── package.json
├── tsconfig.json
├── build.config.ts           (unbuild config)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml       (allowBuilds.esbuild: false)
├── .npmrc                    (scope mapping, NO token)
├── .gitignore                (node_modules, dist, .DS_Store, *.log, .pnpm-store)
└── README.md
```

**Asset rimossi:** `src/assets/grain.svg` è stato eliminato. Il grain ora è inline come data-URI dentro `src/tokens/index.css` (filtro fractalNoise SVG su `body::before`).

## 5. Ottimizzazione font

22 woff2 → **12 woff2** sfruttando le axis variabili di Google:
- **Bodoni Moda**: tutte e 4 le pesature (400/500/600/700) servivano lo stesso file binario per stile. Collassate a 2 file (normal + italic) con `font-weight: 400 700`.
- **Cormorant Garamond**: stesso pattern. 2 file con `font-weight: 400 600`.
- **Spectral**: 8 file distinti, lasciati invariati.

Totale on-disk: 276 KB.

## 6. Build & publish

### Build locale
```bash
cd ~/arche-design-system
pnpm build         # genera dist/
# oppure se pnpm non in PATH:
./node_modules/.bin/unbuild
```

Output atteso in `dist/`:
- `index.{mjs,cjs}` + `index.d.{ts,mts,cts}`
- `tailwind/preset.{mjs,cjs}` + `tailwind/preset.d.{ts,mts,cts}`
- Totale ~9.5 KB

### Publish nuova versione
```bash
# 1. bump version in package.json
# 2. commit + tag
git tag -a vX.Y.Z -m "design system vX.Y.Z"
git push origin main && git push origin vX.Y.Z
# 3. publish (prepublishOnly rilancia pnpm build da solo)
pnpm publish --no-git-checks
```

## 7. Auth GitHub Packages

- **`~/arche-design-system/.npmrc`** (locale, COMMITTATO): solo scope mapping
  ```
  @scirettaclienti-design:registry=https://npm.pkg.github.com
  ```
- **`~/.npmrc`** (globale, MAI committato): contiene il token PAT classico
  ```
  //npm.pkg.github.com/:_authToken=ghp_***
  ```
  Il token deve avere scope `write:packages` (e `read:packages` per installare).

**ATTENZIONE:** ci sono due token GitHub distinti su questa macchina:
- `gho_...` → token OAuth della CLI `gh` (scopes: `gist, read:org, repo`) — NON pubblica package
- `ghp_...` → PAT classico in `~/.npmrc` — questo è quello che pubblica

## 8. Come installare il package (lato consumer)

Il consumer ha bisogno di un `.npmrc` con:
```
@scirettaclienti-design:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
(GITHUB_TOKEN con scope `read:packages`)

Poi:
```bash
pnpm add @scirettaclienti-design/arche-design-system
```

Uso tipico:
```ts
import "@scirettaclienti-design/arche-design-system/tokens";   // CSS globale + fonts
import preset from "@scirettaclienti-design/arche-design-system/tailwind";

// tailwind.config.ts
export default { presets: [preset], content: [...] };
```

## 9. Cose ancora aperte (non bloccano nulla)

1. **`! gh auth refresh -s read:packages`** — da eseguire interattivamente. Aggiunge lo scope `read:packages` al token `gh` CLI, così `gh api .../packages/...` funziona. Senza, il package è pubblicato bene comunque, solo gli script di verifica via `gh` ritornano 403.

2. **`chmod 600 ~/.npmrc`** — il file con il token è 644 di default (leggibile da altri utenti della macchina). Comando consigliato per blindarlo. Non l'ho lanciato perché tocca i permessi su un file globale.

3. **Rotazione del PAT** — il token `ghp_...` è stato pastato in chat durante il setup. Se la trascrizione potrebbe finire in archivi/log, ruotalo su https://github.com/settings/tokens dopo la pubblicazione finale.

4. **`pnpm-workspace.yaml`** — contiene `allowBuilds.esbuild: false`. esbuild è dipendenza transitiva di unbuild e ha postinstall script (rebuild nativo). Abbiamo scelto di negarli: il binario prebuilt che arriva nel tarball npm basta. Se in futuro unbuild dà errori su una piattaforma diversa (ARM64 Linux ecc.), valutare `true`.

## 10. Riferimenti rapidi

```bash
# Check stato repo
cd ~/arche-design-system && git status && git log --oneline -5

# Check package live sul registry
npm view @scirettaclienti-design/arche-design-system --registry=https://npm.pkg.github.com

# Verifica auth token presente (non stampa il valore)
grep -c '^//npm.pkg.github.com/:_authToken=' ~/.npmrc
```

## 11. Per Claude nelle prossime sessioni

Se l'utente riapre la cartella e chiede di continuare:
- Leggi questo file per il contesto
- Lo stato del codice è "corrente": il code è committato a `a298c5f` e v0.1.0 è pubblicato
- Il prossimo passo logico è: bump versione per nuovi token/cambi, o aggiungere primitives/componenti React/Vue se la roadmap si estende
- `prepublishOnly` rilancia il build da solo; bastano `git tag` + `pnpm publish --no-git-checks`
