import type { MetadataRoute } from "next";
import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movies, series, episodes, genres] = await Promise.all([
    db.movie.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true }
    }),
    db.series.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true }
    }),
    db.episode.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        series: { select: { slug: true } },
        season: { select: { seasonNumber: true } }
      }
    }),
    db.genre.findMany({
      select: { slug: true }
    })
  ]);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date()
    },
    {
      url: absoluteUrl("/movies"),
      lastModified: new Date()
    },
    {
      url: absoluteUrl("/series"),
      lastModified: new Date()
    },
    {
      url: absoluteUrl("/search"),
      lastModified: new Date()
    },
    ...movies.flatMap((movie) => [
      {
        url: absoluteUrl(`/movie/${movie.slug}`),
        lastModified: movie.updatedAt
      },
      {
        url: absoluteUrl(`/movie/${movie.slug}/watch`),
        lastModified: movie.updatedAt
      }
    ]),
    ...series.map((item) => ({
      url: absoluteUrl(`/series/${item.slug}`),
      lastModified: item.updatedAt
    })),
    ...episodes.map((episode) => ({
      url: absoluteUrl(
        `/series/${episode.series.slug}/season/${episode.season.seasonNumber}/episode/${episode.episodeNumber}`
      ),
      lastModified: episode.updatedAt
    })),
    ...genres.map((genre) => ({
      url: absoluteUrl(`/genre/${genre.slug}`),
      lastModified: new Date()
    }))
  ];
}
