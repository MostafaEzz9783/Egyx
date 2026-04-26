import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { BelowPlayerAd } from "@/components/ads/BelowPlayerAd";
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

async function getEpisode(seriesSlug: string, seasonNumber: number, episodeNumber: number) {
  return db.episode.findFirst({
    where: {
      episodeNumber,
      status: ContentStatus.PUBLISHED,
      season: { seasonNumber },
      series: { slug: seriesSlug, status: ContentStatus.PUBLISHED }
    },
    include: {
      series: true,
      season: true,
      videoSources: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }]
      }
    }
  });
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; seasonNumber: string; episodeNumber: string };
}) {
  const episode = await getEpisode(params.slug, Number(params.seasonNumber), Number(params.episodeNumber));

  if (!episode) {
    return buildMetadata({
      title: "حلقة غير موجودة",
      description: "صفحة الحلقة المطلوبة غير متاحة.",
      path: `/series/${params.slug}/season/${params.seasonNumber}/episode/${params.episodeNumber}`
    });
  }

  return buildMetadata({
    title: episode.metaTitle || episode.title,
    description: episode.metaDescription || episode.description,
    path: `/series/${episode.series.slug}/season/${episode.season.seasonNumber}/episode/${episode.episodeNumber}`,
    image: episode.posterUrl
  });
}

export default async function EpisodeWatchPage({
  params
}: {
  params: { slug: string; seasonNumber: string; episodeNumber: string };
}) {
  const episode = await getEpisode(params.slug, Number(params.seasonNumber), Number(params.episodeNumber));

  if (!episode) {
    notFound();
  }

  await recordView({ episodeId: episode.id });

  const [previousEpisode, nextEpisode, belowPlayerAd, popupAd] = await Promise.all([
    db.episode.findFirst({
      where: {
        seasonId: episode.seasonId,
        status: ContentStatus.PUBLISHED,
        episodeNumber: { lt: episode.episodeNumber }
      },
      orderBy: { episodeNumber: "desc" }
    }),
    db.episode.findFirst({
      where: {
        seasonId: episode.seasonId,
        status: ContentStatus.PUBLISHED,
        episodeNumber: { gt: episode.episodeNumber }
      },
      orderBy: { episodeNumber: "asc" }
    }),
    getEnabledAd("player"),
    getEnabledAd("popup")
  ]);

  const sources = normalizeSources(episode.videoSources);
  if (!sources.length) {
    notFound();
  }

  return (
    <PublicShell>
      <SectionBox title={episode.title}>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="accent">الحلقة {episode.episodeNumber}</Badge>
          <Badge>{episode.series.title}</Badge>
          <Badge>الموسم {episode.season.seasonNumber}</Badge>
        </div>

        <p className="mb-4 text-sm leading-8 text-muted">{episode.description}</p>

        <Player sources={sources} title={episode.title} />
        <BelowPlayerAd code={belowPlayerAd?.code} enabled={belowPlayerAd?.enabled ?? true} />
        <PopupAd code={popupAd?.code} enabled={popupAd?.enabled ?? true} />

        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={adsConfig.secondarySmartlink} target="_blank" rel="noopener noreferrer">
            تحميل
          </ButtonLink>
          {previousEpisode ? (
            <ButtonLink
              href={`/series/${episode.series.slug}/season/${episode.season.seasonNumber}/episode/${previousEpisode.episodeNumber}`}
              variant="secondary"
            >
              الحلقة السابقة
            </ButtonLink>
          ) : null}
          {nextEpisode ? (
            <ButtonLink
              href={`/series/${episode.series.slug}/season/${episode.season.seasonNumber}/episode/${nextEpisode.episodeNumber}`}
            >
              الحلقة التالية
            </ButtonLink>
          ) : null}
          <ButtonLink href={`/series/${episode.series.slug}`} variant="ghost">
            العودة إلى المسلسل
          </ButtonLink>
        </div>
      </SectionBox>
    </PublicShell>
  );
}
