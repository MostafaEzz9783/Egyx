import Image from "next/image";
import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { MovieCard } from "@/components/MovieCard";
import { PublicShell } from "@/components/PublicShell";
import { SectionBox } from "@/components/SectionBox";
import { SeriesCard } from "@/components/SeriesCard";
import { InFeedAd } from "@/components/ads/InFeedAd";
import { getEnabledAd, getHomeData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ latestMovies, latestSeries, latestEpisodes, topMovies, genres }, infeedAd] = await Promise.all([
    getHomeData(),
    getEnabledAd("infeed")
  ]);
  const featuredMovie = latestMovies[0];

  return (
    <PublicShell>
      {featuredMovie ? (
        <section className="hero-shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="space-y-4">
                <span className="hero-badge">مختارات اليوم</span>
                <h1 className="hero-title">{featuredMovie.title}</h1>
                <div className="hero-meta">
                  <span>{featuredMovie.year}</span>
                  <span>{featuredMovie.duration} دقيقة</span>
                  <span>تقييم {featuredMovie.rating.toFixed(1)}</span>
                </div>
                <p className="max-w-3xl text-sm leading-8 text-[#5f6f86]">{featuredMovie.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/movie/${featuredMovie.slug}/watch`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-black text-white"
                >
                  مشاهدة الآن
                </Link>
                <Link
                  href={`/movie/${featuredMovie.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d7dce5] bg-white px-5 text-sm font-bold text-[#1f5fa9]"
                >
                  تفاصيل الفيلم
                </Link>
              </div>
            </div>

            <div className="hero-poster aspect-[2/3]">
              <Image src={featuredMovie.posterUrl} alt={featuredMovie.title} fill sizes="280px" className="object-cover" />
            </div>
          </div>
        </section>
      ) : null}

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

      <InFeedAd code={infeedAd?.code} enabled={infeedAd?.enabled ?? true} />

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

      <InFeedAd code={infeedAd?.code} enabled={infeedAd?.enabled ?? true} />

      <SectionBox title="التصنيفات">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}`}
              className="rounded-xl border border-[#e6e9ef] bg-[#fafafa] px-3 py-2 text-sm font-medium text-[#1f5fa9] hover:text-accent"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </SectionBox>
    </PublicShell>
  );
}
