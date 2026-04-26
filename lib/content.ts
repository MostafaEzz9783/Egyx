import { ContentStatus, Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { hashIp, isSafeEmbedUrl, parseOptionalNumber } from "@/lib/utils";

export const movieCardInclude = {
  genres: {
    include: {
      genre: true
    }
  },
  _count: {
    select: {
      viewLogs: true
    }
  }
} satisfies Prisma.MovieInclude;

export const seriesCardInclude = {
  genres: {
    include: {
      genre: true
    }
  },
  _count: {
    select: {
      episodes: true
    }
  }
} satisfies Prisma.SeriesInclude;

export const episodeInclude = {
  series: true,
  season: true,
  videoSources: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }]
  },
  _count: {
    select: {
      viewLogs: true
    }
  }
} satisfies Prisma.EpisodeInclude;

export async function getHomeData() {
  const [latestMovies, latestSeries, latestEpisodes, viewedMovies, genres] = await Promise.all([
    db.movie.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: movieCardInclude,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    db.series.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: seriesCardInclude,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    db.episode.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        series: true,
        season: true,
        _count: {
          select: {
            viewLogs: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    db.movie.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: movieCardInclude,
      take: 20
    }),
    db.genre.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  const topMovies = [...viewedMovies]
    .sort((first, second) => second._count.viewLogs - first._count.viewLogs)
    .slice(0, 8);

  return { latestMovies, latestSeries, latestEpisodes, topMovies, genres };
}

export async function getMovieList(params: Record<string, string | undefined>) {
  const page = Number(params.page || "1") || 1;
  const limit = 12;
  const genre = params.genre;
  const year = parseOptionalNumber(params.year);
  const minRating = parseOptionalNumber(params.rating);

  const where: Prisma.MovieWhereInput = {
    status: ContentStatus.PUBLISHED,
    ...(year ? { year } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
    ...(genre
      ? {
          genres: {
            some: {
              genre: {
                slug: genre
              }
            }
          }
        }
      : {})
  };

  const [movies, total, genres, years] = await Promise.all([
    db.movie.findMany({
      where,
      include: movieCardInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    db.movie.count({ where }),
    db.genre.findMany({ orderBy: { name: "asc" } }),
    db.movie.findMany({
      distinct: ["year"],
      where: { status: ContentStatus.PUBLISHED },
      select: { year: true },
      orderBy: { year: "desc" }
    })
  ]);

  return {
    movies,
    genres,
    years: years.map((item) => item.year),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    total
  };
}

export async function getSeriesList(params: Record<string, string | undefined>) {
  const page = Number(params.page || "1") || 1;
  const limit = 12;
  const genre = params.genre;
  const year = parseOptionalNumber(params.year);
  const minRating = parseOptionalNumber(params.rating);

  const where: Prisma.SeriesWhereInput = {
    status: ContentStatus.PUBLISHED,
    ...(year ? { year } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
    ...(genre
      ? {
          genres: {
            some: {
              genre: {
                slug: genre
              }
            }
          }
        }
      : {})
  };

  const [series, total, genres, years] = await Promise.all([
    db.series.findMany({
      where,
      include: seriesCardInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    db.series.count({ where }),
    db.genre.findMany({ orderBy: { name: "asc" } }),
    db.series.findMany({
      distinct: ["year"],
      where: { status: ContentStatus.PUBLISHED },
      select: { year: true },
      orderBy: { year: "desc" }
    })
  ]);

  return {
    series,
    genres,
    years: years.map((item) => item.year),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    total
  };
}

export async function getEnabledAd(position: string) {
  const positionAliases: Record<string, string[]> = {
    header: ["header"],
    sidebar: ["sidebar"],
    infeed: ["infeed", "in-feed"],
    player: ["player", "below-player", "below_player"],
    popup: ["popup"]
  };

  return db.adPlacement.findFirst({
    where: {
      position: {
        in: positionAliases[position] || [position]
      },
      enabled: true
    }
  });
}

export async function getEnabledAds(positions: string[]) {
  const entries = await Promise.all(
    positions.map(async (position) => [position, await getEnabledAd(position)] as const)
  );

  return Object.fromEntries(entries);
}

export async function recordView(input: { movieId?: string; episodeId?: string }) {
  const requestHeaders = headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const userAgent = requestHeaders.get("user-agent") || "unknown";

  await db.viewLog.create({
    data: {
      movieId: input.movieId,
      episodeId: input.episodeId,
      ipHash: hashIp(ip),
      userAgent
    }
  });
}

export function normalizeSources<T extends { sourceUrl: string }>(sources: T[]) {
  return sources.filter((source) => isSafeEmbedUrl(source.sourceUrl));
}
