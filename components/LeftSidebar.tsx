import Link from "next/link";
import { SidebarAd } from "@/components/ads/SidebarAd";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", color: "bg-[#1877f2]" },
  { label: "Twitter", href: "https://twitter.com", color: "bg-[#1d9bf0]" },
  { label: "Instagram", href: "https://instagram.com", color: "bg-[#e4405f]" },
  { label: "YouTube", href: "https://youtube.com", color: "bg-[#ff0000]" }
];

const categories = [
  { label: "أفلام أجنبي", href: "/movies" },
  { label: "أفلام عربي", href: "/movies" },
  { label: "أفلام آسيوي", href: "/movies" },
  { label: "أفلام أنمي", href: "/movies" },
  { label: "أفلام كرتون", href: "/search?q=كرتون" },
  { label: "أفلام تركية", href: "/movies" },
  { label: "أفلام هندية", href: "/movies" },
  { label: "مسلسلات أجنبي", href: "/series" },
  { label: "مسلسلات عربي", href: "/series" },
  { label: "مسلسلات آسيوية", href: "/series" },
  { label: "مسلسلات أنمي", href: "/series" },
  { label: "مسلسلات كرتون", href: "/search?q=كرتون" },
  { label: "مسلسلات تركية", href: "/series" },
  { label: "برامج تلفزيونية", href: "/search?q=برامج" },
  { label: "عروض وحفلات", href: "/search?q=حفلات" }
];

type LeftSidebarProps = {
  sidebarAdCode?: string | null;
  sidebarAdEnabled?: boolean;
};

export function LeftSidebar({ sidebarAdCode, sidebarAdEnabled = true }: LeftSidebarProps) {
  return (
    <div className="ad-rail w-[200px]">
      <div className="sidebar-box">
        <h3 className="sidebar-title">تابع EgyX</h3>
        <div className="space-y-2">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-[#ececec] bg-[#fafafa] px-3 py-2 text-sm text-foreground hover:text-accent"
            >
              <span className={`h-3 w-3 rounded-full ${item.color}`} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-box">
        <h3 className="sidebar-title">الأقسام</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl border border-[#ececec] bg-[#fafafa] px-2 py-2 text-center text-[0.72rem] font-medium leading-5 text-[#1f5fa9] hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <SidebarAd code={sidebarAdCode} enabled={sidebarAdEnabled} />
    </div>
  );
}
