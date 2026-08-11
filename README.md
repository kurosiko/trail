# Astro Starter Kit: Minimal

```sh
bun create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## Visitor counter

The Astro site remains a static build. `/api/visitors` is implemented separately
as a Cloudflare Pages Function in `functions/api/visitors.ts`, backed by D1.
Missing D1 or secret bindings never interrupt `astro build`; the counter returns
an unavailable response until its runtime bindings are configured.

To configure Cloudflare Pages:

1. Create a D1 database and apply `migrations/0001_visitor_counter.sql`.
2. Add the database to the Pages project as a D1 binding named `VISITOR_DB`.
3. Add an encrypted secret named `VISITOR_COUNTER_SECRET` with at least 32
   random characters.
4. Use `bun run build` as the build command and `dist` as the build directory.

For local Pages Functions development, copy `.dev.vars.example` to `.dev.vars`,
build the site, and run Wrangler with the D1 binding:

```sh
bun run build
bunx wrangler pages dev dist --d1 VISITOR_DB=<database-id>
```

The counter uses a signed HttpOnly cookie, a keyed hash of Cloudflare's client
IP header plus browser signals, D1 uniqueness constraints, same-origin checks,
and a D1-backed rate limit. No raw IP address is stored. Anonymous visitor
counts still cannot identify a person with absolute certainty: changing both
browser identity and network can result in another count.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
