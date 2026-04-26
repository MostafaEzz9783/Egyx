import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { MovieCard } from "@/components/MovieCard";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { SeriesCard } from "@/components/SeriesCard";
import { getHomeData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { latestMovies, latestSeries, latestEpisodes, topMovies, genres } = await getHomeData();

  return (
    <PublicShell>
      <SectionBox title="أحدث الأفلام" moreHref="/movies">
        <div className="grid-cards">
          {latestMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </SectionBox>

      <SectionBox title="أحدث المسلسلات" moreHref="/series">
        <div className="grid-cards">
          {latestSeries.map((item) => (
            <SeriesCard key={item.id} series={item} />
          ))}
        </div>
      </SectionBox>

      <SectionBox title="أحدث الحلقات" moreHref="/series">
        <div className="grid-cards">
          {latestEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </SectionBox>

      <SectionBox title="الأكثر مشاهدة" moreHref="/movies?rating=8">
        <div className="grid-cards">
          {topMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </SectionBox>

      <SectionBox title="التصنيفات">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}`}
              className="rounded-md border border-border bg-[#fafafa] px-3 py-2 text-sm text-[#1f5fa9] hover:text-accent"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </SectionBox>
    </PublicShell>
  );
}
