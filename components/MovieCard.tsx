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
      <div className="overflow-hidden rounded-md border border-border bg-white shadow-sm transition group-hover:border-[#9cbce6]">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f2f2f2]">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 16vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute right-2 top-2 rounded-md bg-[#f7d96b] px-2 py-1 text-xs font-bold text-[#2a2a2a]">
            {movie.rating.toFixed(1)}
          </div>
        </div>
        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-[48px] text-sm font-bold leading-6 text-[#1f5fa9] group-hover:text-accent">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-[#777]">
            <span>{movie.year}</span>
            <span>{movie.duration} دقيقة</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
