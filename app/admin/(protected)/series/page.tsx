import { createSeasonAction, createSeriesAction, deleteSeasonAction, deleteSeriesAction, updateSeasonAction, updateSeriesAction } from "@/app/admin/actions";
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

export default async function AdminSeriesPage() {
  const [series, genres, seasons] = await Promise.all([
    db.series.findMany({
      include: {
        genres: { include: { genre: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    db.genre.findMany({ orderBy: { name: "asc" } }),
    db.season.findMany({
      include: { series: true },
      orderBy: [{ series: { title: "asc" } }, { seasonNumber: "asc" }]
    })
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="section-title">إدارة المسلسلات والمواسم</h1>
        <p className="section-copy">إضافة المسلسلات وربط المواسم بها من داخل لوحة موحدة.</p>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">إضافة مسلسل جديد</h2>
        <form action={createSeriesAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="title" placeholder="عنوان المسلسل" required />
          <Input name="slug" placeholder="slug اختياري" />
          <Input name="posterUrl" placeholder="رابط الملصق" required />
          <Input name="backdropUrl" placeholder="رابط الخلفية" />
          <Input name="year" type="number" placeholder="السنة" required />
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
            حفظ المسلسل
          </button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">إضافة موسم جديد</h2>
        <form action={createSeasonAction} className="mt-5 grid gap-4 md:grid-cols-3">
          <select name="seriesId" className="input-like">
            {series.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <Input name="seasonNumber" type="number" placeholder="رقم الموسم" required />
          <Input name="title" placeholder="عنوان الموسم" required />
          <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-3">
            إضافة الموسم
          </button>
        </form>
      </Card>

      <div className="space-y-6">
        {series.map((item) => (
          <Card key={item.id} className="p-6">
            <form action={updateSeriesAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <Input name="title" defaultValue={item.title} required />
              <Input name="slug" defaultValue={item.slug} />
              <Input name="posterUrl" defaultValue={item.posterUrl} required />
              <Input name="backdropUrl" defaultValue={item.backdropUrl} />
              <Input name="year" type="number" defaultValue={item.year} required />
              <Input name="rating" type="number" step="0.1" defaultValue={item.rating} required />
              <Input name="language" defaultValue={item.language} required />
              <Input name="country" defaultValue={item.country} required />
              <StatusSelect name="status" defaultValue={item.status} />
              <Input name="metaTitle" defaultValue={item.metaTitle || ""} className="md:col-span-2" />
              <textarea name="description" defaultValue={item.description} className="input-like min-h-[120px] md:col-span-2 py-3" required />
              <textarea name="metaDescription" defaultValue={item.metaDescription || ""} className="input-like min-h-[100px] md:col-span-2 py-3" />
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre) => (
                    <label key={genre.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        name="genreIds"
                        value={genre.id}
                        defaultChecked={item.genres.some((genreEntry) => genreEntry.genreId === genre.id)}
                      />
                      {genre.name}
                    </label>
                  ))}
                </div>
              </div>
              <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-2">
                تحديث المسلسل
              </button>
            </form>
            <form action={deleteSeriesAction} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                حذف المسلسل
              </button>
            </form>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">المواسم الحالية</h2>
        <div className="mt-4 space-y-4">
          {seasons.map((season) => (
            <div key={season.id} className="rounded-2xl border border-border p-4">
              <form action={updateSeasonAction} className="grid gap-4 md:grid-cols-3">
                <input type="hidden" name="id" value={season.id} />
                <Input value={season.series.title} readOnly />
                <Input name="seasonNumber" type="number" defaultValue={season.seasonNumber} required />
                <Input name="title" defaultValue={season.title} required />
                <button className="h-11 rounded-xl border border-border bg-panel text-sm font-bold text-foreground md:col-span-3">
                  تحديث الموسم
                </button>
              </form>
              <form action={deleteSeasonAction} className="mt-3">
                <input type="hidden" name="id" value={season.id} />
                <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                  حذف الموسم
                </button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
