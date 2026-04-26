import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { MovieCard } from "@/components/MovieCard";
import { SeriesCard } from "@/components/SeriesCard";
import { buildMetadata } from "@/lib/seo";
import { db } from "@/lib/db";

async function getGenre(slug: string) {
  return db.genre.findUnique({
    where: { slug },
    include: {
      movieGenres: {
        where: { movie: { status: ContentStatus.PUBLISHED } },
        include: {
          movie: {
            include: {
              genres: { include: { genre: true } },
              _count: { select: { viewLogs: true } }
            }
          }
        }
      },
      seriesGenres: {
        where: { series: { status: ContentStatus.PUBLISHED } },
        include: {
          series: {
            include: {
              genres: { include: { genre: true } },
              _count: { select: { episodes: true } }
            }
          }
        }
      }
    }
  });
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const genre = await getGenre(params.slug);
  if (!genre) {
    return buildMetadata({
      title: "تصنيف غير موجود",
      description: "التصنيف المطلوب غير متاح.",
      path: `/genre/${params.slug}`
    });
  }

  return buildMetadata({
    title: `تصنيف ${genre.name}`,
    description: `تصفح أفضل الأفلام والمسلسلات ضمن تصنيف ${genre.name}.`,
    path: `/genre/${genre.slug}`
  });
}

export default async function GenrePage({
  params
}: {
  params: { slug: string };
}) {
  const genre = await getGenre(params.slug);
  if (!genre) {
    notFound();
  }

  return (
    <main className="page-shell py-10">
      <section className="mb-10">
        <h1 className="section-title">تصنيف {genre.name}</h1>
        <p className="section-copy">محتوى مرتبط بهذا التصنيف من الأفلام والمسلسلات المنشورة.</p>
      </section>

      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-foreground">الأفلام</h2>
        </div>
        <div className="grid-cards">
          {genre.movieGenres.map((entry) => (
            <MovieCard key={entry.movie.id} movie={entry.movie} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-foreground">المسلسلات</h2>
        </div>
        <div className="grid-cards">
          {genre.seriesGenres.map((entry) => (
            <SeriesCard key={entry.series.id} series={entry.series} />
          ))}
        </div>
      </section>
    </main>
  );
}
