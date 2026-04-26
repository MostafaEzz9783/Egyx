import Image from "next/image";
import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { EpisodeCard } from "@/components/EpisodeCard";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { SeriesCard } from "@/components/SeriesCard";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { buildMetadata, buildSeriesJsonLd } from "@/lib/seo";

async function getSeries(slug: string) {
  return db.series.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      seasons: {
        include: {
          episodes: {
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { episodeNumber: "asc" },
            include: {
              series: true,
              season: true,
              _count: { select: { viewLogs: true } }
            }
          }
        },
        orderBy: { seasonNumber: "asc" }
      }
    }
  });
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const series = await getSeries(params.slug);
  if (!series || series.status !== ContentStatus.PUBLISHED) {
    return buildMetadata({
      title: "مسلسل غير موجود",
      description: "المحتوى المطلوب غير متاح.",
      path: `/series/${params.slug}`
    });
  }

  return buildMetadata({
    title: series.metaTitle || series.title,
    description: series.metaDescription || series.description,
    path: `/series/${series.slug}`,
    image: series.backdropUrl,
    keywords: series.genres.map((item) => item.genre.name)
  });
}

export default async function SeriesDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const series = await getSeries(params.slug);
  if (!series || series.status !== ContentStatus.PUBLISHED) {
    notFound();
  }

  const latestEpisodes = series.seasons.flatMap((season) => season.episodes).slice(-6).reverse();

  const relatedSeries = await db.series.findMany({
    where: {
      id: { not: series.id },
      status: ContentStatus.PUBLISHED,
      genres: {
        some: {
          genreId: {
            in: series.genres.map((item) => item.genreId)
          }
        }
      }
    },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { episodes: true } }
    },
    take: 5
  });

  const jsonLd = buildSeriesJsonLd({
    title: series.title,
    description: series.description,
    image: series.backdropUrl,
    url: absoluteUrl(`/series/${series.slug}`),
    datePublished: `${series.year}-01-01`,
    genre: series.genres.map((item) => item.genre.name),
    aggregateRating: series.rating
  });

  return (
    <PublicShell>
      <SectionBox title={series.title}>
        <div className="grid gap-4 lg:grid-cols-[220px,minmax(0,1fr)]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-[#f2f2f2]">
            <Image src={series.posterUrl} alt={series.title} fill sizes="220px" className="object-cover" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{series.rating.toFixed(1)}</Badge>
              <Badge>{series.year}</Badge>
              <Badge>{series.language}</Badge>
              <Badge>{series.country}</Badge>
              <Badge>{series.seasons.length} مواسم</Badge>
            </div>
            <p className="text-sm leading-8 text-muted">{series.description}</p>
            <div className="flex flex-wrap gap-2">
              {series.genres.map((item) => (
                <Badge key={item.genre.id}>{item.genre.name}</Badge>
              ))}
            </div>
          </div>
        </div>
      </SectionBox>

      <SectionBox title="أحدث الحلقات" moreHref="/series">
        <div className="grid-cards">
          {latestEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </SectionBox>

      <SectionBox title="المواسم والحلقات">
        <div className="space-y-5">
          {series.seasons.map((season) => (
            <div key={season.id} className="rounded-md border border-border bg-[#fafafa] p-4">
              <h3 className="mb-3 text-lg font-bold text-foreground">{season.title}</h3>
              <div className="grid-cards">
                {season.episodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionBox>

      <SectionBox title="مسلسلات مشابهة" moreHref="/series">
        <div className="grid-cards">
          {relatedSeries.map((item) => (
            <SeriesCard key={item.id} series={item} />
          ))}
        </div>
      </SectionBox>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PublicShell>
  );
}
