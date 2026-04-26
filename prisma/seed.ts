import { PrismaClient, ContentStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const genres = [
  { name: "أكشن", slug: "action" },
  { name: "دراما", slug: "drama" },
  { name: "كوميديا", slug: "comedy" },
  { name: "رعب", slug: "horror" },
  { name: "رومانسي", slug: "romance" },
  { name: "خيال علمي", slug: "sci-fi" },
  { name: "وثائقي", slug: "documentary" }
];

const movies = [
  ["مدينة الرماد", "city-of-ashes", 2024, 128, 8.1, "العربية", "مصر", ["أكشن", "دراما"]],
  ["ليلة في الميناء", "night-at-the-port", 2023, 112, 7.7, "العربية", "لبنان", ["دراما", "رومانسي"]],
  ["الطريق إلى زحل", "road-to-saturn", 2025, 135, 8.5, "العربية", "السعودية", ["خيال علمي", "أكشن"]],
  ["الظل الأخير", "last-shadow", 2022, 104, 7.4, "العربية", "الأردن", ["رعب", "دراما"]],
  ["موعد في الربيع", "spring-appointment", 2021, 109, 7.2, "العربية", "تونس", ["رومانسي", "كوميديا"]],
  ["الحدود البعيدة", "distant-borders", 2024, 121, 8.0, "العربية", "المغرب", ["أكشن", "خيال علمي"]],
  ["حكاية شارع النيل", "nile-street-story", 2020, 98, 6.9, "العربية", "مصر", ["كوميديا", "دراما"]],
  ["غرفة رقم سبعة", "room-seven", 2024, 117, 7.8, "العربية", "الكويت", ["رعب", "أكشن"]],
  ["ذاكرة البحر", "memory-of-the-sea", 2023, 126, 8.3, "العربية", "عمان", ["وثائقي", "دراما"]],
  ["نبض الصحراء", "pulse-of-the-desert", 2025, 131, 8.6, "العربية", "السعودية", ["أكشن", "رومانسي"]]
] as const;

const seriesData = [
  ["ممر الظلال", "shadow-corridor", 2024, 8.4, "العربية", "السعودية", ["أكشن", "دراما"]],
  ["بيت الموج", "house-of-waves", 2023, 7.9, "العربية", "الإمارات", ["رومانسي", "دراما"]],
  ["خارج المدار", "out-of-orbit", 2025, 8.7, "العربية", "مصر", ["خيال علمي", "أكشن"]],
  ["قضية منتصف الليل", "midnight-case", 2022, 7.8, "العربية", "الأردن", ["دراما", "رعب"]],
  ["وثائق المدينة", "city-files", 2024, 8.1, "العربية", "لبنان", ["وثائقي", "كوميديا"]]
] as const;

async function main() {
  await prisma.viewLog.deleteMany();
  await prisma.videoSource.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.seriesGenre.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.adPlacement.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.create({
    data: {
      name: "مدير المنصة",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const createdGenres = new Map<string, string>();
  for (const genre of genres) {
    const created = await prisma.genre.create({ data: genre });
    createdGenres.set(created.name, created.id);
  }

  const createdMovies: string[] = [];
  for (let index = 0; index < movies.length; index += 1) {
    const [title, slug, year, duration, rating, language, country, movieGenres] = movies[index];
    const movie = await prisma.movie.create({
      data: {
        title,
        slug,
        description: `فيلم ${title} يقدم تجربة سينمائية عربية بطابع بصري قوي، تتقاطع فيه الدراما مع التوتر والإيقاع السريع.`,
        posterUrl: `https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80&sig=${index + 1}`,
        backdropUrl: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80&sig=${index + 20}`,
        year,
        duration,
        rating,
        language,
        country,
        status: ContentStatus.PUBLISHED,
        metaTitle: `${title} | مشاهدة فيلم عربي`,
        metaDescription: `شاهد فيلم ${title} بجودة عالية مع أكثر من سيرفر تشغيل ووصف عربي كامل.`,
        genres: {
          create: movieGenres.map((genreName) => ({
            genre: {
              connect: {
                id: createdGenres.get(genreName)
              }
            }
          }))
        }
      }
    });

    createdMovies.push(movie.id);

    await prisma.videoSource.createMany({
      data: [
        {
          movieId: movie.id,
          sourceName: "سيرفر 1",
          sourceUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          quality: "1080p",
          language: "العربية",
          isPrimary: true,
          sortOrder: 1
        },
        {
          movieId: movie.id,
          sourceName: "سيرفر 2",
          sourceUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
          quality: "720p",
          language: "العربية",
          isPrimary: false,
          sortOrder: 2
        },
        {
          movieId: movie.id,
          sourceName: "سيرفر 3",
          sourceUrl: "https://player.vimeo.com/video/76979871",
          quality: "480p",
          language: "العربية",
          isPrimary: false,
          sortOrder: 3
        }
      ]
    });
  }

  const createdSeries = new Map<string, string>();
  for (let index = 0; index < seriesData.length; index += 1) {
    const [title, slug, year, rating, language, country, seriesGenres] = seriesData[index];
    const series = await prisma.series.create({
      data: {
        title,
        slug,
        description: `مسلسل ${title} يدمج السرد العربي الحديث مع شخصيات مركبة وتطورات ممتدة عبر الحلقات.`,
        posterUrl: `https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80&sig=${index + 40}`,
        backdropUrl: `https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80&sig=${index + 60}`,
        year,
        rating,
        language,
        country,
        status: ContentStatus.PUBLISHED,
        metaTitle: `${title} | مشاهدة مسلسل عربي`,
        metaDescription: `تعرف على مسلسل ${title} وشاهد الحلقات الكاملة بجودات متعددة.`,
        genres: {
          create: seriesGenres.map((genreName) => ({
            genre: {
              connect: {
                id: createdGenres.get(genreName)
              }
            }
          }))
        }
      }
    });

    createdSeries.set(slug, series.id);
  }

  const seasons = [
    { seriesSlug: "shadow-corridor", seasonNumber: 1, title: "ممر الظلال - الموسم الأول" },
    { seriesSlug: "house-of-waves", seasonNumber: 1, title: "بيت الموج - الموسم الأول" },
    { seriesSlug: "out-of-orbit", seasonNumber: 1, title: "خارج المدار - الموسم الأول" }
  ];

  const createdSeasons = new Map<string, string>();
  for (const season of seasons) {
    const created = await prisma.season.create({
      data: {
        seriesId: createdSeries.get(season.seriesSlug)!,
        seasonNumber: season.seasonNumber,
        title: season.title
      }
    });

    createdSeasons.set(`${season.seriesSlug}-${season.seasonNumber}`, created.id);
  }

  const episodePlan = [
    ["shadow-corridor", 1, 5],
    ["house-of-waves", 1, 5],
    ["out-of-orbit", 1, 5]
  ] as const;

  for (const [seriesSlug, seasonNumber, count] of episodePlan) {
    for (let episodeNumber = 1; episodeNumber <= count; episodeNumber += 1) {
      const seriesId = createdSeries.get(seriesSlug)!;
      const seasonId = createdSeasons.get(`${seriesSlug}-${seasonNumber}`)!;
      const series = seriesData.find((item) => item[1] === seriesSlug)!;
      const title = `${series[0]} - الحلقة ${episodeNumber}`;

      const episode = await prisma.episode.create({
        data: {
          title,
          slug: `${seriesSlug}-s${seasonNumber}e${episodeNumber}`,
          episodeNumber,
          description: `الحلقة ${episodeNumber} من مسلسل ${series[0]} تحمل تصاعدًا دراميًا وتكشف أسرارًا جديدة في مسار الأحداث.`,
          posterUrl: `https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80&sig=${seasonNumber * 100 + episodeNumber}`,
          duration: 48,
          status: ContentStatus.PUBLISHED,
          metaTitle: `${title} | مشاهدة الحلقة`,
          metaDescription: `شاهد ${title} بجودة عالية ومن خلال أكثر من سيرفر تشغيل.`,
          seriesId,
          seasonId
        }
      });

      await prisma.videoSource.createMany({
        data: [
          {
            episodeId: episode.id,
            sourceName: "سيرفر 1",
            sourceUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quality: "1080p",
            language: "العربية",
            isPrimary: true,
            sortOrder: 1
          },
          {
            episodeId: episode.id,
            sourceName: "سيرفر 2",
            sourceUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
            quality: "720p",
            language: "العربية",
            isPrimary: false,
            sortOrder: 2
          }
        ]
      });
    }
  }

  await prisma.adPlacement.createMany({
    data: [
      {
        name: "إعلان الهيدر",
        position: "header",
        enabled: true,
        code: "<a href='https://omg10.com/4/10927743' target='_blank' rel='noopener noreferrer' style='display:flex;min-height:90px;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(90deg,#e11d2e,#f97316);color:#fff;text-decoration:none;font-weight:700;font-size:18px;'>\u0625\u0639\u0644\u0627\u0646 \u0645\u0645\u0648\u0644 - \u0627\u0636\u063a\u0637 \u0647\u0646\u0627</a>"
      },
      {
        name: "إعلان الشريط الجانبي",
        position: "sidebar",
        enabled: true,
        code: "<a href='https://omg10.com/4/10927743' target='_blank' rel='noopener noreferrer' style='display:flex;min-height:280px;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(180deg,#111827,#ef4444);color:#fff;text-decoration:none;font-weight:700;font-size:20px;padding:16px;'>\u0625\u0639\u0644\u0627\u0646 \u062c\u0627\u0646\u0628\u064a \u0645\u0645\u0648\u0644</a>"
      },
      {
        name: "إعلان أسفل المشغل",
        position: "below-player",
        enabled: true,
        code: "<a href='https://omg10.com/4/10927743' target='_blank' rel='noopener noreferrer' style='display:flex;min-height:110px;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(90deg,#dc2626,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:18px;'>\u0625\u0639\u0644\u0627\u0646 \u0623\u0633\u0641\u0644 \u0627\u0644\u0645\u0634\u063a\u0644</a>"
      },
      {
        name: "إعلان داخل القوائم",
        position: "in-feed",
        enabled: true,
        code: "<a href='https://omg10.com/4/10927743' target='_blank' rel='noopener noreferrer' style='display:flex;min-height:160px;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(90deg,#0f172a,#2563eb);color:#fff;text-decoration:none;font-weight:700;font-size:18px;'>\u0625\u0639\u0644\u0627\u0646 \u062f\u0627\u062e\u0644 \u0627\u0644\u0634\u0628\u0643\u0629</a>"
      },
      {
        name: "إعلان منبثق",
        position: "popup",
        enabled: false,
        code: "<div class='text-sm'>\u0625\u0639\u0644\u0627\u0646 \u0645\u0646\u0628\u062b\u0642</div>"
      }
    ]
  });

  for (const movieId of createdMovies.slice(0, 6)) {
    await prisma.viewLog.create({
      data: {
        movieId,
        ipHash: `seed-movie-${movieId}`,
        userAgent: "seed-agent"
      }
    });
  }

  const seededEpisodes = await prisma.episode.findMany({ take: 8 });
  for (const episode of seededEpisodes) {
    await prisma.viewLog.create({
      data: {
        episodeId: episode.id,
        ipHash: `seed-episode-${episode.id}`,
        userAgent: "seed-agent"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

