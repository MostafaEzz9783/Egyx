import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { InFeedAd } from "@/components/ads/InFeedAd";
import { getEnabledAd, getMovieList } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "الأفلام",
  description: "EgyX",
  path: "/movies"
});

export default async function MoviesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = {
    genre: typeof searchParams.genre === "string" ? searchParams.genre : undefined,
    year: typeof searchParams.year === "string" ? searchParams.year : undefined,
    rating: typeof searchParams.rating === "string" ? searchParams.rating : undefined,
    page: typeof searchParams.page === "string" ? searchParams.page : undefined
  };

  const [{ movies, genres, years, currentPage, totalPages }, infeedAd] = await Promise.all([
    getMovieList(params),
    getEnabledAd("infeed")
  ]);

  return (
    <PublicShell>
      <SectionBox title="أحدث الأفلام">
        <form className="mb-4 grid gap-3 md:grid-cols-4">
          <select name="genre" defaultValue={params.genre || ""} className="input-like">
            <option value="">كل التصنيفات</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.slug}>
                {genre.name}
              </option>
            ))}
          </select>
          <select name="year" defaultValue={params.year || ""} className="input-like">
            <option value="">كل السنوات</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select name="rating" defaultValue={params.rating || ""} className="input-like">
            <option value="">كل التقييمات</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
          </select>
          <button className="rounded-md border border-accent bg-accent px-4 text-sm font-bold text-white">
            تطبيق الفلاتر
          </button>
        </form>

        {movies.length ? (
          <div className="space-y-6">
            <div className="grid-cards">
              {movies.map((movie, index) => (
                <div key={movie.id} className="contents">
                  <MovieCard movie={movie} />
                  {(index + 1) % 6 === 0 ? (
                    <div className="col-span-full">
                      <InFeedAd code={infeedAd?.code} enabled={infeedAd?.enabled ?? true} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} pathname="/movies" searchParams={params} />
          </div>
        ) : (
          <div className="rounded-md border border-border bg-[#fafafa] p-6 text-center text-sm text-muted">
            لا توجد أفلام.
          </div>
        )}
      </SectionBox>
    </PublicShell>
  );
}
