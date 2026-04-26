import { createEpisodeAction, createVideoSourceAction, deleteEpisodeAction, deleteVideoSourceAction, updateEpisodeAction, updateVideoSourceAction } from "@/app/admin/actions";
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

export default async function AdminEpisodesPage() {
  const [episodes, series, seasons] = await Promise.all([
    db.episode.findMany({
      include: {
        series: true,
        season: true,
        videoSources: { orderBy: { sortOrder: "asc" } }
      },
      orderBy: { createdAt: "desc" }
    }),
    db.series.findMany({ orderBy: { title: "asc" } }),
    db.season.findMany({
      include: { series: true },
      orderBy: [{ series: { title: "asc" } }, { seasonNumber: "asc" }]
    })
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="section-title">إدارة الحلقات ومصادر الفيديو</h1>
        <p className="section-copy">إدارة الحلقات وسيرفرات التشغيل بشكل مباشر.</p>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">إضافة حلقة جديدة</h2>
        <form action={createEpisodeAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <select name="seriesId" className="input-like">
            {series.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select name="seasonId" className="input-like">
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.series.title} - الموسم {season.seasonNumber}
              </option>
            ))}
          </select>
          <Input name="title" placeholder="عنوان الحلقة" required />
          <Input name="slug" placeholder="slug اختياري" />
          <Input name="episodeNumber" type="number" placeholder="رقم الحلقة" required />
          <Input name="duration" type="number" placeholder="المدة بالدقائق" required />
          <Input name="posterUrl" placeholder="رابط صورة الحلقة" required />
          <StatusSelect name="status" />
          <Input name="metaTitle" placeholder="عنوان SEO" className="md:col-span-2" />
          <textarea name="description" placeholder="الوصف" required className="input-like min-h-[120px] md:col-span-2 py-3" />
          <textarea name="metaDescription" placeholder="وصف SEO" className="input-like min-h-[100px] md:col-span-2 py-3" />
          <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-2">
            حفظ الحلقة
          </button>
        </form>
      </Card>

      <div className="space-y-6">
        {episodes.map((episode) => (
          <Card key={episode.id} className="p-6">
            <form action={updateEpisodeAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={episode.id} />
              <select name="seriesId" defaultValue={episode.seriesId} className="input-like">
                {series.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <select name="seasonId" defaultValue={episode.seasonId} className="input-like">
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.series.title} - الموسم {season.seasonNumber}
                  </option>
                ))}
              </select>
              <Input name="title" defaultValue={episode.title} required />
              <Input name="slug" defaultValue={episode.slug} />
              <Input name="episodeNumber" type="number" defaultValue={episode.episodeNumber} required />
              <Input name="duration" type="number" defaultValue={episode.duration} required />
              <Input name="posterUrl" defaultValue={episode.posterUrl} required />
              <StatusSelect name="status" defaultValue={episode.status} />
              <Input name="metaTitle" defaultValue={episode.metaTitle || ""} className="md:col-span-2" />
              <textarea name="description" defaultValue={episode.description} className="input-like min-h-[120px] md:col-span-2 py-3" required />
              <textarea name="metaDescription" defaultValue={episode.metaDescription || ""} className="input-like min-h-[100px] md:col-span-2 py-3" />
              <button className="h-11 rounded-xl border border-accent bg-accent text-sm font-black text-slate-950 md:col-span-2">
                تحديث الحلقة
              </button>
            </form>
            <form action={deleteEpisodeAction} className="mt-4">
              <input type="hidden" name="id" value={episode.id} />
              <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                حذف الحلقة
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-border bg-slate-950/40 p-4">
              <h3 className="text-lg font-bold text-foreground">مصادر الفيديو</h3>
              <form action={createVideoSourceAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="episodeId" value={episode.id} />
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
                {episode.videoSources.map((source) => (
                  <div key={source.id} className="rounded-2xl border border-border p-4">
                    <form action={updateVideoSourceAction} className="grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="id" value={source.id} />
                      <input type="hidden" name="episodeId" value={episode.id} />
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
