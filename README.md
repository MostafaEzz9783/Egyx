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
   - `GOOGLE_SITE_VERIFICATION`
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

## Google Search Console Setup

This project now supports Google verification metadata through the `GOOGLE_SITE_VERIFICATION` environment variable.

Example:

```env
GOOGLE_SITE_VERIFICATION="google-site-verification=YOUR_TOKEN_HERE"
```

### Important distinction

- `GOOGLE_SITE_VERIFICATION` inside the app helps with URL-prefix style verification through page metadata.
- Domain property verification in Google Search Console still requires a DNS TXT record at the root domain.
- In other words, project-side support is now ready, but root-domain ownership remains a DNS task outside the codebase.

## Search Console Roadmap

1. Set the production site URL correctly in `NEXTAUTH_URL`.
2. Add `GOOGLE_SITE_VERIFICATION` to Vercel project environment variables.
3. Redeploy the Vercel project so the verification meta is included in the HTML output.
4. Verify the website in Google Search Console using either:
   - URL-prefix property with the meta-based verification support in this app
   - Domain property with a DNS TXT record at the root domain
5. Submit `sitemap.xml` in Search Console after verification.
6. Monitor indexing, coverage, and enhancement reports.

## Notes

- Keep `.env` local and never commit real secrets.
- Prisma migrations are stored in `prisma/migrations`.
- Public pages only show published content.
