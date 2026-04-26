import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { BelowPlayerAd } from "@/components/ads/BelowPlayerAd";
import { MovieCard } from "@/components/MovieCard";
import { PopupAd } from "@/components/ads/PopupAd";
import { Player } from "@/components/Player";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { adsConfig } from "@/config/ads";
import { getEnabledAd, normalizeSources, recordView } from "@/lib/content";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

async function getMovie(slug: string) {
  return db.movie.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      videoSources: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }]
      },
      _count: { select: { viewLogs: true } }
    }
  });
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const movie = await getMovie(params.slug);
  if (!movie || movie.status !== ContentStatus.PUBLISHED) {
    return buildMetadata({
      title: "مشاهدة غير متاحة",
      description: "لا يمكن الوصول إلى صفحة المشاهدة.",
      path: `/movie/${params.slug}/watch`
    });
  }

  return buildMetadata({
    title: `مشاهدة ${movie.title}`,
    description: movie.metaDescription || movie.description,
    path: `/movie/${movie.slug}/watch`,
    image: movie.backdropUrl
  });
}

export default async function MovieWatchPage({
  params
}: {
  params: { slug: string };
}) {
  const movie = await getMovie(params.slug);
  if (!movie || movie.status !== ContentStatus.PUBLISHED) {
    notFound();
  }

  await recordView({ movieId: movie.id });

  const [relatedMovies, belowPlayerAd, popupAd] = await Promise.all([
    db.movie.findMany({
      where: {
        id: { not: movie.id },
        status: ContentStatus.PUBLISHED,
        genres: {
          some: {
            genreId: {
              in: movie.genres.map((item) => item.genreId)
            }
          }
        }
      },
      include: {
        genres: { include: { genre: true } },
        _count: { select: { viewLogs: true } }
      },
      take: 5
    }),
    getEnabledAd("player"),
    getEnabledAd("popup")
  ]);

  const sources = normalizeSources(movie.videoSources);
  if (!sources.length) {
    notFound();
  }

  return (
    <PublicShell>
      <SectionBox title={`مشاهدة ${movie.title}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="accent">{movie.rating.toFixed(1)}</Badge>
          <Badge>{movie.year}</Badge>
          <Badge>{movie.language}</Badge>
        </div>
        <Player sources={sources} title={movie.title} />
        <BelowPlayerAd code={belowPlayerAd?.code} enabled={belowPlayerAd?.enabled ?? true} />
        <PopupAd code={popupAd?.code} enabled={popupAd?.enabled ?? true} />
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={adsConfig.secondarySmartlink} target="_blank" rel="noopener noreferrer">
            تحميل
          </ButtonLink>
          <ButtonLink href={`/movie/${movie.slug}`} variant="secondary">
            تفاصيل الفيلم
          </ButtonLink>
          <ButtonLink href="/movies" variant="ghost">
            كل الأفلام
          </ButtonLink>
        </div>
      </SectionBox>

      <SectionBox title="محتوى مرتبط" moreHref="/movies">
        <div className="grid-cards">
          {relatedMovies.map((relatedMovie) => (
            <MovieCard key={relatedMovie.id} movie={relatedMovie} />
          ))}
        </div>
      </SectionBox>
    </PublicShell>
  );
}
