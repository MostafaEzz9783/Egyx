import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authenticateAdminAction } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const error = typeof searchParams.error === "string" ? searchParams.error : "";
  const callbackUrl =
    typeof searchParams.callbackUrl === "string" ? searchParams.callbackUrl : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ececec] px-4 py-10" dir="rtl">
      <Card className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#d92027]">EgyX</h1>
          <p className="mt-3 text-lg font-bold text-foreground">تسجيل دخول الإدارة</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            بيانات الدخول غير صحيحة.
          </div>
        ) : null}

        <form action={authenticateAdminAction} className="mt-6 space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
          <Input name="password" type="password" placeholder="كلمة المرور" required />
          <button className="h-11 w-full rounded-md border border-accent bg-accent text-sm font-bold text-white">
            دخول
          </button>
        </form>
      </Card>
    </main>
  );
}
