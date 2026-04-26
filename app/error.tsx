"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-panel p-8 text-center">
          <p className="text-sm text-accent">حدث خطأ غير متوقع</p>
          <h1 className="mt-3 text-3xl font-black">تعذر تحميل الصفحة</h1>
          <p className="mt-4 text-sm leading-7 text-muted">{error.message}</p>
          <Button className="mt-6 w-full" onClick={() => reset()}>
            إعادة المحاولة
          </Button>
        </div>
      </body>
    </html>
  );
}
