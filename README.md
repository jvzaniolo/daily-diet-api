# Node.js Daily Diet API

Built with Express, Node.js, Drizzle ORM, SQLite, Zod, TypeScript

## Development

You must use `pnpm` instead of `npm` to account for issues with `better-sqlite3` as [mentioned here](https://github.com/WiseLibs/better-sqlite3/issues/146#issuecomment-1977504296)

1. Install dependencies

```bash
pnpm install
```

2. Run locally

```bash
pnpm dev
```

3. Check Drizzle Studio

```bash
npx drizzle-kit studio
```

4. Build

```bash
pnpm build
```

5. Run production

```bash
node dist/server.js
```
