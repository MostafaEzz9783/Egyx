import Image from "next/image";
import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { MovieCard } from "@/components/MovieCard";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { buildMetadata, buildMovieJsonLd } from "@/lib/seo";

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
      title: "فيلم غير موجود",
      description: "المحتوى المطلوب غير متاح.",
      path: `/movie/${params.slug}`
    });
  }

  return buildMetadata({
    title: movie.metaTitle || movie.title,
    description: movie.metaDescription || movie.description,
    path: `/movie/${movie.slug}`,
    image: movie.backdropUrl,
    keywords: movie.genres.map((item) => item.genre.name)
  });
}

export default async function MovieDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const movie = await getMovie(params.slug);

  if (!movie || movie.status !== ContentStatus.PUBLISHED) {
    notFound();
  }

  const relatedMovies = await db.movie.findMany({
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
  });

  const jsonLd = buildMovieJsonLd({
    title: movie.title,
    description: movie.description,
    image: movie.backdropUrl,
    url: absoluteUrl(`/movie/${movie.slug}`),
    datePublished: `${movie.year}-01-01`,
    genre: movie.genres.map((item) => item.genre.name),
    aggregateRating: movie.rating,
    duration: movie.duration
  });

  return (
    <PublicShell>
      <SectionBox title={movie.title}>
        <div className="grid gap-5 lg:grid-cols-[250px,minmax(0,1fr)]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-[18px] border border-[#e3e7ee] bg-[#f2f2f2]">
            <Image src={movie.posterUrl} alt={movie.title} fill sizes="250px" className="object-cover" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{movie.rating.toFixed(1)}</Badge>
              <Badge>{movie.year}</Badge>
              <Badge>{movie.language}</Badge>
              <Badge>{movie.country}</Badge>
              <Badge>{movie.duration} دقيقة</Badge>
            </div>
            <p className="text-sm leading-8 text-muted">{movie.description}</p>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((item) => (
                <Badge key={item.genre.id}>{item.genre.name}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/movie/${movie.slug}/watch`}>مشاهدة الآن</ButtonLink>
              <ButtonLink href="/movies" variant="secondary">
                العودة إلى الأفلام
              </ButtonLink>
            </div>
          </div>
        </div>
      </SectionBox>

      <SectionBox title="أفلام مشابهة" moreHref="/movies">
        <div className="grid-cards">
          {relatedMovies.map((relatedMovie) => (
            <MovieCard key={relatedMovie.id} movie={relatedMovie} />
          ))}
        </div>
      </SectionBox>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PublicShell>
  );
}
