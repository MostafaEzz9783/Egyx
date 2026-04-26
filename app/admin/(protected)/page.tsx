import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [movieCount, seriesCount, episodeCount, viewCount, drafts] = await Promise.all([
    db.movie.count(),
    db.series.count(),
    db.episode.count(),
    db.viewLog.count(),
    Promise.all([
      db.movie.count({ where: { status: ContentStatus.DRAFT } }),
      db.series.count({ where: { status: ContentStatus.DRAFT } }),
      db.episode.count({ where: { status: ContentStatus.DRAFT } })
    ])
  ]);

  const cards = [
    { label: "عدد الأفلام", value: movieCount },
    { label: "عدد المسلسلات", value: seriesCount },
    { label: "عدد الحلقات", value: episodeCount },
    { label: "عدد المشاهدات", value: viewCount }
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="section-title">نظرة عامة</h1>
        <p className="section-copy">لوحة متابعة سريعة لمؤشرات المحتوى المنشور والإدارة.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-6">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-3 text-4xl font-black text-foreground">{formatNumber(card.value)}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-black text-foreground">حالة المسودات</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-slate-900/50 p-4">
            <p className="text-sm text-muted">مسودات الأفلام</p>
            <p className="mt-2 text-2xl font-black text-foreground">{drafts[0]}</p>
          </div>
          <div className="rounded-2xl border border-border bg-slate-900/50 p-4">
            <p className="text-sm text-muted">مسودات المسلسلات</p>
            <p className="mt-2 text-2xl font-black text-foreground">{drafts[1]}</p>
          </div>
          <div className="rounded-2xl border border-border bg-slate-900/50 p-4">
            <p className="text-sm text-muted">مسودات الحلقات</p>
            <p className="mt-2 text-2xl font-black text-foreground">{drafts[2]}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
