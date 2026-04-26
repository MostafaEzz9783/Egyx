import { Pagination } from "@/components/Pagination";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { SeriesCard } from "@/components/SeriesCard";
import { InFeedAd } from "@/components/ads/InFeedAd";
import { buildMetadata } from "@/lib/seo";
import { getEnabledAd, getSeriesList } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "المسلسلات",
  description: "EgyX",
  path: "/series"
});

export default async function SeriesPage({
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

  const [{ series, genres, years, currentPage, totalPages }, infeedAd] = await Promise.all([
    getSeriesList(params),
    getEnabledAd("infeed")
  ]);

  return (
    <PublicShell>
      <SectionBox title="أحدث الحلقات">
        <form className="filters-grid mb-4">
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
          <button className="rounded-xl border border-accent bg-accent px-4 text-sm font-bold text-white">
            تطبيق الفلاتر
          </button>
        </form>

        {series.length ? (
          <div className="space-y-6">
            <div className="grid-cards">
              {series.map((item, index) => (
                <div key={item.id} className="contents">
                  <SeriesCard series={item} />
                  {(index + 1) % 6 === 0 ? (
                    <div className="col-span-full">
                      <InFeedAd code={infeedAd?.code} enabled={infeedAd?.enabled ?? true} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} pathname="/series" searchParams={params} />
          </div>
        ) : (
          <div className="rounded-xl border border-[#e6e9ef] bg-[#fafafa] p-6 text-center text-sm text-muted">
            لا توجد مسلسلات.
          </div>
        )}
      </SectionBox>
    </PublicShell>
  );
}
