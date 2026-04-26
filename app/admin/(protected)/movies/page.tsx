import { createGenreAction, createMovieAction, createVideoSourceAction, deleteGenreAction, deleteMovieAction, deleteVideoSourceAction, updateMovieAction, updateVideoSourceAction } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export const dynamic = "force-dynamic";

function StatusSelect({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <select name={name} defaultValue={defaultValue || "DRAFT"} className="input-like">
      <option value="DRAFT">مسودة</option>
      <option value="PUBLISHED">منشور</option>
      <option value="ARCHIVED">مؤرشف</option>
    </select>
  );
}

export default async function AdminMoviesPage() {
  const [movies, genres] = await Promise.all([
    db.movie.findMany({
      include: {
        genres: { include: { genre: true } },
        videoSources: { orderBy: { sortOrder: "asc" } }
      },
      orderBy: { createdAt: "desc" }
    }),
    db.genre.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="section-title">إدارة الأفلام</h1>
        <p className="section-copy">إنشاء وتعديل وحذف الأفلام مع المصادر والتصنيفات.</p>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">إضافة فيلم جديد</h2>
        <form action={createMovieAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="title" placeholder="عنوان الفيلم" required />
          <Input name="slug" placeholder="slug اختياري" />
          <Input name="posterUrl" placeholder="رابط الملصق" required />
          <Input name="backdropUrl" placeholder="رابط الخلفية" />
          <Input name="year" type="number" placeholder="السنة" required />
          <Input name="duration" type="number" placeholder="المدة بالدقائق" required />
          <Input name="rating" type="number" step="0.1" placeholder="التقييم" required />
          <Input name="language" placeholder="اللغة" defaultValue="العربية" required />
          <Input name="country" placeholder="الدولة" required />
          <StatusSelect name="status" />
          <Input name="metaTitle" placeholder="عنوان SEO" className="md:col-span-2" />
          <textarea name="description" placeholder="الوصف" required className="input-like min-h-[120px] md:col-span-2 py-3" />
          <textarea name="metaDescription" placeholder="وصف SEO" className="input-like min-h-[100px] md:col-span-2 py-3" />
          <div className="md:col-span-2">
            <p className="mb-3 text-sm text-muted">التصنيفات</p>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <label key={genre.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                  <input type="checkbox" name="genreIds" value={genre.id} />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>
          <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-2">
            حفظ الفيلم
          </button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">إدارة التصنيفات</h2>
        <form action={createGenreAction} className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr),minmax(0,1fr),180px]">
          <Input name="name" placeholder="اسم التصنيف" required />
          <Input name="slug" placeholder="slug اختياري" />
          <button className="rounded-xl border border-accent bg-accent px-4 text-sm font-black text-slate-950">
            إضافة تصنيف
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3">
          {genres.map((genre) => (
            <form key={genre.id} action={deleteGenreAction}>
              <input type="hidden" name="id" value={genre.id} />
              <button className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-red-500/40 hover:text-red-300">
                حذف {genre.name}
              </button>
            </form>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {movies.map((movie) => (
          <Card key={movie.id} className="p-6">
            <form action={updateMovieAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={movie.id} />
              <Input name="title" defaultValue={movie.title} required />
              <Input name="slug" defaultValue={movie.slug} />
              <Input name="posterUrl" defaultValue={movie.posterUrl} required />
              <Input name="backdropUrl" defaultValue={movie.backdropUrl} />
              <Input name="year" type="number" defaultValue={movie.year} required />
              <Input name="duration" type="number" defaultValue={movie.duration} required />
              <Input name="rating" type="number" step="0.1" defaultValue={movie.rating} required />
              <Input name="language" defaultValue={movie.language} required />
              <Input name="country" defaultValue={movie.country} required />
              <StatusSelect name="status" defaultValue={movie.status} />
              <Input name="metaTitle" defaultValue={movie.metaTitle || ""} className="md:col-span-2" />
              <textarea name="description" defaultValue={movie.description} className="input-like min-h-[120px] md:col-span-2 py-3" required />
              <textarea name="metaDescription" defaultValue={movie.metaDescription || ""} className="input-like min-h-[100px] md:col-span-2 py-3" />
              <div className="md:col-span-2">
                <p className="mb-3 text-sm text-muted">التصنيفات الحالية</p>
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre) => (
                    <label key={genre.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        name="genreIds"
                        value={genre.id}
                        defaultChecked={movie.genres.some((item) => item.genreId === genre.id)}
                      />
                      {genre.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button className="h-11 rounded-xl border border-accent bg-accent px-5 text-sm font-black text-slate-950">
                  تحديث الفيلم
                </button>
              </div>
            </form>
            <form action={deleteMovieAction} className="mt-4">
              <input type="hidden" name="id" value={movie.id} />
              <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                حذف الفيلم
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-border bg-slate-950/40 p-4">
              <h3 className="text-lg font-bold text-foreground">مصادر تشغيل الفيلم</h3>
              <form action={createVideoSourceAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="movieId" value={movie.id} />
                <Input name="sourceName" placeholder="اسم المصدر" required />
                <Input name="sourceUrl" placeholder="رابط iframe" required />
                <Input name="quality" placeholder="الجودة" defaultValue="1080p" required />
                <Input name="language" placeholder="اللغة" defaultValue="العربية" required />
                <Input name="sortOrder" type="number" defaultValue={1} required />
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" name="isPrimary" /> تعيين كمصدر أساسي
                </label>
                <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-2">
                  إضافة مصدر
                </button>
              </form>

              <div className="mt-4 space-y-4">
                {movie.videoSources.map((source) => (
                  <div key={source.id} className="rounded-2xl border border-border p-4">
                    <form action={updateVideoSourceAction} className="grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="id" value={source.id} />
                      <input type="hidden" name="movieId" value={movie.id} />
                      <Input name="sourceName" defaultValue={source.sourceName} required />
                      <Input name="sourceUrl" defaultValue={source.sourceUrl} required />
                      <Input name="quality" defaultValue={source.quality} required />
                      <Input name="language" defaultValue={source.language} required />
                      <Input name="sortOrder" type="number" defaultValue={source.sortOrder} required />
                      <label className="flex items-center gap-2 text-sm text-muted">
                        <input type="checkbox" name="isPrimary" defaultChecked={source.isPrimary} />
                        المصدر الأساسي
                      </label>
                      <button className="h-11 rounded-xl border border-border bg-panel text-sm font-bold text-foreground md:col-span-2">
                        تحديث المصدر
                      </button>
                    </form>
                    <form action={deleteVideoSourceAction} className="mt-3">
                      <input type="hidden" name="id" value={source.id} />
                      <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                        حذف المصدر
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
