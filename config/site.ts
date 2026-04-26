export const siteConfig = {
  name: "EgyX",
  shortName: "EgyX",
  description: "EgyX",
  url: process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  locale: "ar_SA",
  keywords: ["EgyX", "أفلام", "مسلسلات", "حلقات"],
  adminEmail: "admin@example.com",
  defaultPoster:
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
} as const;
