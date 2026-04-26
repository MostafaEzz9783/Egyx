import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm text-accent">404</p>
        <h1 className="mt-3 text-4xl font-black text-foreground">المحتوى غير موجود</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          ربما تم حذف المحتوى أو لم يعد منشورًا. يمكنك العودة إلى الواجهة الرئيسية أو متابعة التصفح.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">العودة للرئيسية</ButtonLink>
          <Link
            href="/movies"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm text-foreground"
          >
            تصفح الأفلام
          </Link>
        </div>
      </div>
    </main>
  );
}
