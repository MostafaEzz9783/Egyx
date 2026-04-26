import { ContentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeMultiline, sanitizeText, slugify } from "@/lib/utils";

function parseStatus(status: unknown) {
  return typeof status === "string" && status in ContentStatus
    ? (status as ContentStatus)
    : ContentStatus.DRAFT;
}

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") || "12");
  const genre = request.nextUrl.searchParams.get("genre");
  const yearParam = request.nextUrl.searchParams.get("year");
  const ratingParam = request.nextUrl.searchParams.get("rating");
  const year = yearParam ? Number(yearParam) : undefined;
  const rating = ratingParam ? Number(ratingParam) : undefined;

  const where = {
    status: ContentStatus.PUBLISHED,
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
      : {}),
    ...(typeof year === "number" && Number.isFinite(year) ? { year } : {}),
    ...(typeof rating === "number" && Number.isFinite(rating) ? { rating: { gte: rating } } : {})
  };

  const [items, total] = await Promise.all([
    db.movie.findMany({
      where,
      include: {
        genres: { include: { genre: true } },
        _count: { select: { viewLogs: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: (Math.max(page, 1) - 1) * limit,
      take: limit
    }),
    db.movie.count({ where })
  ]);

  return NextResponse.json({
    items,
    page,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json();
  const genreIds: string[] = Array.isArray(body.genreIds)
    ? body.genreIds.map((value: unknown) => sanitizeText(String(value)))
    : [];

  const movie = await db.movie.create({
    data: {
      title: sanitizeText(body.title),
      slug: sanitizeText(body.slug) || slugify(sanitizeText(body.title)),
      description: sanitizeMultiline(body.description),
      posterUrl: sanitizeText(body.posterUrl),
      backdropUrl: sanitizeText(body.backdropUrl) || sanitizeText(body.posterUrl),
      year: Number(body.year),
      duration: Number(body.duration),
      rating: Number(body.rating),
      language: sanitizeText(body.language),
      country: sanitizeText(body.country),
      status: parseStatus(body.status),
      metaTitle: sanitizeText(body.metaTitle),
      metaDescription: sanitizeMultiline(body.metaDescription),
      genres: {
        create: genreIds.map((genreId) => ({
          genre: {
            connect: { id: genreId }
          }
        }))
      }
    }
  });

  return NextResponse.json(movie, { status: 201 });
}
