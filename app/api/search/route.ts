import { ContentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashIp, rateLimit } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const type = request.nextUrl.searchParams.get("type") || "all";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limitKey = hashIp(`${ip}:${type}`);
  const limiter = rateLimit(limitKey, 30, 60_000);

  if (!limiter.success) {
    return NextResponse.json(
      { message: "تم تجاوز الحد المسموح به للبحث. حاول لاحقًا." },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfter || 60) } }
    );
  }

  if (!query) {
    return NextResponse.json({ movies: [], series: [], episodes: [] });
  }

  const [movies, series, episodes] = await Promise.all([
    type === "all" || type === "movies"
      ? db.movie.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            title: { contains: query, mode: "insensitive" }
          },
          select: { id: true, title: true, slug: true, posterUrl: true },
          take: 8
        })
      : Promise.resolve([]),
    type === "all" || type === "series"
      ? db.series.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            title: { contains: query, mode: "insensitive" }
          },
          select: { id: true, title: true, slug: true, posterUrl: true },
          take: 8
        })
      : Promise.resolve([]),
    type === "all" || type === "episodes"
      ? db.episode.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            title: { contains: query, mode: "insensitive" }
          },
          include: { series: { select: { slug: true } }, season: { select: { seasonNumber: true } } },
          take: 8
        })
      : Promise.resolve([])
  ]);

  return NextResponse.json({ movies, series, episodes });
}
