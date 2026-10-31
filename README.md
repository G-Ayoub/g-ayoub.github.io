# g-ayoub.github.io

Personal portfolio of Ayoub Ghaffour, built with [Astro](https://astro.build), React islands and [Motion](https://motion.dev).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type-check
npm run build    # static site in dist/
```

## Content

All copy lives in typed data files under `src/data/` — edit those, not the components:

- `profile.ts` — name, role, intro, stats, contact links
- `skills.ts`, `experience.ts`, `projects.ts`, `patents.ts`, `background.ts`

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
The repository's **Settings → Pages → Source** must be set to **GitHub Actions**.
