"use server";

import { AuthError } from "next-auth";
import { ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { isSafeEmbedUrl, sanitizeMultiline, sanitizeText, slugify } from "@/lib/utils";

const statusEnum = z.nativeEnum(ContentStatus);

const contentSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  posterUrl: z.string().url(),
  backdropUrl: z.string().url().optional(),
  year: z.coerce.number().int().min(1900).max(2100),
  rating: z.coerce.number().min(0).max(10),
  language: z.string().min(2),
  country: z.string().min(2),
  status: statusEnum,
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

const movieSchema = contentSchema.extend({
  duration: z.coerce.number().int().min(1)
});

const episodeSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  posterUrl: z.string().url(),
  duration: z.coerce.number().int().min(1),
  seriesId: z.string().min(1),
  seasonId: z.string().min(1),
  episodeNumber: z.coerce.number().int().min(1),
  status: statusEnum,
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

const sourceSchema = z.object({
  sourceName: z.string().min(2),
  sourceUrl: z.string().url(),
  quality: z.string().min(2),
  language: z.string().min(2),
  sortOrder: z.coerce.number().int().min(1),
  isPrimary: z.boolean().optional()
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return session;
}

function revalidateAll() {
  [
    "/",
    "/movies",
    "/series",
    "/search",
    "/admin",
    "/admin/movies",
    "/admin/series",
    "/admin/episodes"
  ].forEach((path) => revalidatePath(path));
}

async function connectGenres(genreIds: string[]) {
  return genreIds.map((genreId) => ({
    genre: {
      connect: {
        id: genreId
      }
    }
  }));
}

export async function authenticateAdminAction(formData: FormData) {
  const email = sanitizeText(formData.get("email"));
  const password = sanitizeText(formData.get("password"));
  const callbackUrl = sanitizeText(formData.get("callbackUrl")) || "/admin";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=credentials");
    }
    throw error;
  }
}

export async function signOutAdminAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function createGenreAction(formData: FormData) {
  await requireAdmin();
  const name = sanitizeText(formData.get("name"));
  const slugValue = sanitizeText(formData.get("slug"));

  if (name.length < 2) {
    return;
  }

  await db.genre.create({
    data: {
      name,
      slug: slugValue || slugify(name)
    }
  });

  revalidateAll();
}

export async function deleteGenreAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.genre.delete({
    where: { id }
  });

  revalidateAll();
}

export async function createMovieAction(formData: FormData) {
  await requireAdmin();
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    backdropUrl: sanitizeText(formData.get("backdropUrl")) || undefined,
    duration: sanitizeText(formData.get("duration")),
    year: sanitizeText(formData.get("year")),
    rating: sanitizeText(formData.get("rating")),
    language: sanitizeText(formData.get("language")),
    country: sanitizeText(formData.get("country")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = movieSchema.safeParse(rawData);
  if (!parsed.success) return;

  const title = parsed.data.title;
  const slug = sanitizeText(formData.get("slug")) || slugify(title);
  const genreIds = formData.getAll("genreIds").map((value) => sanitizeText(value)).filter(Boolean);

  await db.movie.create({
    data: {
      ...parsed.data,
      slug,
      backdropUrl: parsed.data.backdropUrl || parsed.data.posterUrl,
      genres: {
        create: await connectGenres(genreIds)
      }
    }
  });

  revalidateAll();
}

export async function updateMovieAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    backdropUrl: sanitizeText(formData.get("backdropUrl")) || undefined,
    duration: sanitizeText(formData.get("duration")),
    year: sanitizeText(formData.get("year")),
    rating: sanitizeText(formData.get("rating")),
    language: sanitizeText(formData.get("language")),
    country: sanitizeText(formData.get("country")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = movieSchema.safeParse(rawData);
  if (!parsed.success || !id) return;

  const title = parsed.data.title;
  const slug = sanitizeText(formData.get("slug")) || slugify(title);
  const genreIds = formData.getAll("genreIds").map((value) => sanitizeText(value)).filter(Boolean);

  await db.movie.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      backdropUrl: parsed.data.backdropUrl || parsed.data.posterUrl,
      genres: {
        deleteMany: {},
        create: await connectGenres(genreIds)
      }
    }
  });

  revalidateAll();
}

export async function deleteMovieAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.movie.delete({ where: { id } });
  revalidateAll();
}

export async function createSeriesAction(formData: FormData) {
  await requireAdmin();
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    backdropUrl: sanitizeText(formData.get("backdropUrl")) || undefined,
    year: sanitizeText(formData.get("year")),
    rating: sanitizeText(formData.get("rating")),
    language: sanitizeText(formData.get("language")),
    country: sanitizeText(formData.get("country")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = contentSchema.safeParse(rawData);
  if (!parsed.success) return;

  const slug = sanitizeText(formData.get("slug")) || slugify(parsed.data.title);
  const genreIds = formData.getAll("genreIds").map((value) => sanitizeText(value)).filter(Boolean);

  await db.series.create({
    data: {
      ...parsed.data,
      slug,
      backdropUrl: parsed.data.backdropUrl || parsed.data.posterUrl,
      genres: {
        create: await connectGenres(genreIds)
      }
    }
  });

  revalidateAll();
}

export async function updateSeriesAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    backdropUrl: sanitizeText(formData.get("backdropUrl")) || undefined,
    year: sanitizeText(formData.get("year")),
    rating: sanitizeText(formData.get("rating")),
    language: sanitizeText(formData.get("language")),
    country: sanitizeText(formData.get("country")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = contentSchema.safeParse(rawData);
  if (!parsed.success || !id) return;

  const slug = sanitizeText(formData.get("slug")) || slugify(parsed.data.title);
  const genreIds = formData.getAll("genreIds").map((value) => sanitizeText(value)).filter(Boolean);

  await db.series.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      backdropUrl: parsed.data.backdropUrl || parsed.data.posterUrl,
      genres: {
        deleteMany: {},
        create: await connectGenres(genreIds)
      }
    }
  });

  revalidateAll();
}

export async function deleteSeriesAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.series.delete({ where: { id } });
  revalidateAll();
}

export async function createSeasonAction(formData: FormData) {
  await requireAdmin();
  const seriesId = sanitizeText(formData.get("seriesId"));
  const title = sanitizeText(formData.get("title"));
  const seasonNumber = Number(sanitizeText(formData.get("seasonNumber")));

  if (!seriesId || !title || !Number.isFinite(seasonNumber)) {
    return;
  }

  await db.season.create({
    data: {
      seriesId,
      title,
      seasonNumber
    }
  });

  revalidateAll();
}

export async function updateSeasonAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  const title = sanitizeText(formData.get("title"));
  const seasonNumber = Number(sanitizeText(formData.get("seasonNumber")));

  if (!id || !title || !Number.isFinite(seasonNumber)) {
    return;
  }

  await db.season.update({
    where: { id },
    data: {
      title,
      seasonNumber
    }
  });

  revalidateAll();
}

export async function deleteSeasonAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.season.delete({ where: { id } });
  revalidateAll();
}

export async function createEpisodeAction(formData: FormData) {
  await requireAdmin();
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    duration: sanitizeText(formData.get("duration")),
    seriesId: sanitizeText(formData.get("seriesId")),
    seasonId: sanitizeText(formData.get("seasonId")),
    episodeNumber: sanitizeText(formData.get("episodeNumber")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = episodeSchema.safeParse(rawData);
  if (!parsed.success) return;

  const slug = sanitizeText(formData.get("slug")) || slugify(`${parsed.data.title}-${parsed.data.episodeNumber}`);

  await db.episode.create({
    data: {
      ...parsed.data,
      slug
    }
  });

  revalidateAll();
}

export async function updateEpisodeAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  const rawData = {
    title: sanitizeText(formData.get("title")),
    description: sanitizeMultiline(formData.get("description")),
    posterUrl: sanitizeText(formData.get("posterUrl")),
    duration: sanitizeText(formData.get("duration")),
    seriesId: sanitizeText(formData.get("seriesId")),
    seasonId: sanitizeText(formData.get("seasonId")),
    episodeNumber: sanitizeText(formData.get("episodeNumber")),
    status: sanitizeText(formData.get("status")) || ContentStatus.DRAFT,
    metaTitle: sanitizeText(formData.get("metaTitle")),
    metaDescription: sanitizeMultiline(formData.get("metaDescription"))
  };

  const parsed = episodeSchema.safeParse(rawData);
  if (!parsed.success || !id) return;

  const slug = sanitizeText(formData.get("slug")) || slugify(`${parsed.data.title}-${parsed.data.episodeNumber}`);

  await db.episode.update({
    where: { id },
    data: {
      ...parsed.data,
      slug
    }
  });

  revalidateAll();
}

export async function deleteEpisodeAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.episode.delete({ where: { id } });
  revalidateAll();
}

export async function createVideoSourceAction(formData: FormData) {
  await requireAdmin();
  const rawData = {
    sourceName: sanitizeText(formData.get("sourceName")),
    sourceUrl: sanitizeText(formData.get("sourceUrl")),
    quality: sanitizeText(formData.get("quality")),
    language: sanitizeText(formData.get("language")),
    sortOrder: sanitizeText(formData.get("sortOrder")),
    isPrimary: formData.get("isPrimary") === "on"
  };

  const parsed = sourceSchema.safeParse(rawData);
  const movieId = sanitizeText(formData.get("movieId"));
  const episodeId = sanitizeText(formData.get("episodeId"));

  if (!parsed.success || (!movieId && !episodeId) || !isSafeEmbedUrl(parsed.data.sourceUrl)) return;

  if (parsed.data.isPrimary) {
    if (movieId) {
      await db.videoSource.updateMany({ where: { movieId }, data: { isPrimary: false } });
    }
    if (episodeId) {
      await db.videoSource.updateMany({ where: { episodeId }, data: { isPrimary: false } });
    }
  }

  await db.videoSource.create({
    data: {
      ...parsed.data,
      movieId: movieId || null,
      episodeId: episodeId || null
    }
  });

  revalidateAll();
}

export async function updateVideoSourceAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  const rawData = {
    sourceName: sanitizeText(formData.get("sourceName")),
    sourceUrl: sanitizeText(formData.get("sourceUrl")),
    quality: sanitizeText(formData.get("quality")),
    language: sanitizeText(formData.get("language")),
    sortOrder: sanitizeText(formData.get("sortOrder")),
    isPrimary: formData.get("isPrimary") === "on"
  };

  const parsed = sourceSchema.safeParse(rawData);
  const movieId = sanitizeText(formData.get("movieId"));
  const episodeId = sanitizeText(formData.get("episodeId"));

  if (!parsed.success || !id || !isSafeEmbedUrl(parsed.data.sourceUrl)) return;

  if (parsed.data.isPrimary) {
    if (movieId) {
      await db.videoSource.updateMany({
        where: { movieId, id: { not: id } },
        data: { isPrimary: false }
      });
    }
    if (episodeId) {
      await db.videoSource.updateMany({
        where: { episodeId, id: { not: id } },
        data: { isPrimary: false }
      });
    }
  }

  await db.videoSource.update({
    where: { id },
    data: {
      ...parsed.data
    }
  });

  revalidateAll();
}

export async function deleteVideoSourceAction(formData: FormData) {
  await requireAdmin();
  const id = sanitizeText(formData.get("id"));
  if (!id) return;

  await db.videoSource.delete({ where: { id } });
  revalidateAll();
}
