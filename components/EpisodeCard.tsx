import Image from "next/image";
import Link from "next/link";

type EpisodeCardProps = {
  episode: {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    episodeNumber: number;
    duration: number;
    season: { seasonNumber: number };
    series: { title: string; slug: string };
    _count?: { viewLogs: number };
  };
};

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      href={`/series/${episode.series.slug}/season/${episode.season.seasonNumber}/episode/${episode.episodeNumber}`}
      className="group block"
    >
      <div className="h-full overflow-hidden rounded-md border border-border bg-white shadow-sm transition group-hover:border-[#9cbce6]">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f2f2f2]">
          <Image
            src={episode.posterUrl}
            alt={episode.title}
            fill
            sizes="(max-width: 768px) 48vw, (max-width: 1200px) 25vw, 170px"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute right-2 top-2 rounded-md bg-[#f7d96b] px-2 py-1 text-xs font-bold text-[#2a2a2a]">
            {episode.episodeNumber}
          </div>
        </div>
        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-[52px] text-[0.95rem] font-bold leading-6 text-[#1f5fa9] group-hover:text-accent">
            {episode.title}
          </h3>
          <div className="text-[0.78rem] text-[#777]">{episode.series.title}</div>
          <div className="flex items-center justify-between text-[0.78rem] text-[#777]">
            <span>الموسم {episode.season.seasonNumber}</span>
            <span>{episode.duration} دقيقة</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
