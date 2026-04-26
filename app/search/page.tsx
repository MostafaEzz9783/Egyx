import { ContentStatus } from "@prisma/client";
import { EpisodeCard } from "@/components/EpisodeCard";
import { MovieCard } from "@/components/MovieCard";
import { PublicShell } from "@/components/PublicShell";
import { SearchBar } from "@/components/SearchBar";
import { SectionBox } from "@/components/SectionBox";
import { SeriesCard } from "@/components/SeriesCard";
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "البحث",
  description: "EgyX",
  path: "/search"
});

export default async function SearchPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const type = typeof searchParams.type === "string" ? searchParams.type : "all";

  const [movies, series, episodes] = query
    ? await Promise.all([
        type === "all" || type === "movies"
          ? db.movie.findMany({
              where: {
                status: ContentStatus.PUBLISHED,
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } }
                ]
              },
              include: {
                genres: { include: { genre: true } },
                _count: { select: { viewLogs: true } }
              },
              take: 12
            })
          : Promise.resolve([]),
        type === "all" || type === "series"
          ? db.series.findMany({
              where: {
                status: ContentStatus.PUBLISHED,
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } }
                ]
              },
              include: {
                genres: { include: { genre: true } },
                _count: { select: { episodes: true } }
              },
              take: 12
            })
          : Promise.resolve([]),
        type === "all" || type === "episodes"
          ? db.episode.findMany({
              where: {
                status: ContentStatus.PUBLISHED,
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } }
                ]
              },
              include: {
                series: true,
                season: true,
                _count: { select: { viewLogs: true } }
              },
              take: 12
            })
          : Promise.resolve([])
      ])
    : [[], [], []];

  return (
    <PublicShell>
      <SectionBox title="البحث">
        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr),280px]">
          <SearchBar className="w-full" />
          <form>
            <input type="hidden" name="q" value={query} />
            <div className="flex gap-3">
              <select name="type" defaultValue={type} className="input-like">
                <option value="all">كل الأنواع</option>
                <option value="movies">أفلام</option>
                <option value="series">مسلسلات</option>
                <option value="episodes">حلقات</option>
              </select>
              <button className="rounded-md border border-accent bg-accent px-4 text-sm font-bold text-white">
                تطبيق
              </button>
            </div>
          </form>
        </div>

        {!query ? null : (
          <div className="space-y-6">
            {(type === "all" || type === "movies") && movies.length ? (
              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">الأفلام</h3>
                <div className="grid-cards">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            ) : null}

            {(type === "all" || type === "series") && series.length ? (
              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">المسلسلات</h3>
                <div className="grid-cards">
                  {series.map((item) => (
                    <SeriesCard key={item.id} series={item} />
                  ))}
                </div>
              </div>
            ) : null}

            {(type === "all" || type === "episodes") && episodes.length ? (
              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">الحلقات</h3>
                <div className="grid-cards">
                  {episodes.map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </SectionBox>
    </PublicShell>
  );
}
