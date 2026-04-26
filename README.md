# منصة المشاهدة العربية

منصة بث عربية مبنية بـ Next.js 14 App Router وTypeScript وTailwind CSS وPrisma وPostgreSQL وAuth.js.

## المزايا

- واجهة عربية كاملة مع RTL.
- صفحات عامة للأفلام والمسلسلات والحلقات وصفحات مشاهدة متعددة السيرفرات.
- لوحة إدارة محمية لتعديل المحتوى والتصنيفات والمواسم والحلقات ومصادر الفيديو.
- نظام إعلانات قابل للتفعيل والتعطيل مع أماكن عرض متعددة.
- SEO ديناميكي مع Metadata وOpen Graph وTwitter Cards وJSON-LD وSitemap وRobots.
- بيانات Seed عربية جاهزة لتجربة النظام مباشرة.

## المتطلبات

- Node.js 18.18+ أو 20+
- PostgreSQL

## الإعداد

1. انسخ ملف البيئة:

```bash
cp .env.example .env
```

2. حدّث `DATABASE_URL` و`NEXTAUTH_SECRET`.

3. ثبّت الحزم:

```bash
npm install
```

4. ولّد Prisma Client:

```bash
npx prisma generate
```

5. أنشئ الجداول:

```bash
npx prisma migrate dev
```

6. حمّل البيانات التجريبية:

```bash
npx prisma db seed
```

7. شغّل المشروع:

```bash
npm run dev
```

## بيانات الدخول الافتراضية

- البريد: `admin@example.com`
- كلمة المرور: `Admin@12345`

## النشر على Vercel

- أضف متغيرات البيئة نفسها على Vercel.
- استخدم PostgreSQL متوافقًا مع Prisma.
- نفّذ `prisma generate` أثناء البناء و`prisma migrate deploy` في بيئة الإنتاج.

## ملاحظات تقنية

- المسودات لا تظهر في الصفحات العامة.
- تسجيلات المشاهدة تُحفظ عند فتح صفحات المشاهدة.
- البحث يملك Rate Limit بسيط داخل الذاكرة مناسب كبداية ويمكن استبداله لاحقًا بـ Redis.
