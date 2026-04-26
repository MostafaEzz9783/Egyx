import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { signOutAdminAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const adminLinks = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/movies", label: "إدارة الأفلام" },
  { href: "/admin/series", label: "إدارة المسلسلات" },
  { href: "/admin/episodes", label: "إدارة الحلقات والمصادر" }
];

export default async function AdminProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <main className="page-shell py-10">
      <div className="grid gap-6 xl:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="rounded-3xl border border-border bg-panel/80 p-5">
          <p className="text-xs text-muted">لوحة التحكم</p>
          <h2 className="mt-2 text-2xl font-black text-foreground">{session.user.name}</h2>
          <div className="mt-6 space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl border border-transparent px-4 py-3 text-sm text-foreground transition hover:border-border hover:bg-[#f5f5f5] hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <form action={signOutAdminAction} className="mt-8">
            <button className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              تسجيل الخروج
            </button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </main>
  );
}
