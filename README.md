# EgyX

Arabic streaming/catalog platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Auth.js.

## Local Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Apply local development migrations:

```bash
npx prisma migrate dev
```

5. Seed sample data:

```bash
npx prisma db seed
```

6. Start development:

```bash
npm run dev
```

## Default Admin Login

- Email: `admin@example.com`
- Password: `Admin@12345`

## Production Deployment (Neon + Vercel)

1. Create a PostgreSQL database on Neon.
2. Copy the Neon connection string.
3. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Recommended build command:

```bash
npx prisma generate && next build
```

5. Run production migrations:

```bash
npx prisma migrate deploy
```

6. Seed production only once if needed:

```bash
npx prisma db seed
```

## Notes

- Keep `.env` local and never commit real secrets.
- Prisma migrations are stored in `prisma/migrations`.
- Public pages only show published content.
