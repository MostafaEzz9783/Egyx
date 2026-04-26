import Image from "next/image";
import Link from "next/link";
import { Movie } from "@prisma/client";

type MovieCardProps = {
  movie: Movie & {
    genres: { genre: { id: string; name: string; slug: string } }[];
    _count: { viewLogs: number };
  };
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-[18px] border border-[#dfe4ec] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition duration-200 group-hover:-translate-y-1 group-hover:border-[#b8cde8]">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#eef2f7]">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 48vw, (max-width: 1200px) 25vw, 170px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute right-2 top-2 rounded-lg bg-[#f6d45b] px-2 py-1 text-xs font-black text-[#2a2a2a] shadow-sm">
            {movie.rating.toFixed(1)}
          </div>
        </div>

        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-[54px] text-[0.98rem] font-black leading-6 text-[#1f5fa9] group-hover:text-accent">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-[0.78rem] text-[#6b7280]">
            <span>{movie.year}</span>
            <span>{movie.duration} دقيقة</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
