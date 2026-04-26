"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "الرئيسية", match: "/" },
  { href: "/search?q=ترند", label: "الترند", match: "/search", query: "ترند" },
  { href: "/search?q=جديد", label: "المضاف حديثًا", match: "/search", query: "جديد" },
  { href: "/movies", label: "أحدث الأفلام", match: "/movies" },
  { href: "/series", label: "أحدث الحلقات", match: "/series" },
  { href: "/search?q=كرتون", label: "أحدث الكرتون", match: "/search", query: "كرتون" }
];

export function RightSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <div className="sidebar-box p-0">
      <div className="sidebar-title px-4 pt-4">القائمة</div>
      <nav className="pb-2">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : link.query
                ? pathname === link.match && q.includes(link.query)
                : pathname === link.match || pathname.startsWith(`${link.match}/`);

          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "mx-3 mb-2 block rounded-md px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-accent text-white"
                  : "bg-[#f8f8f8] text-foreground hover:bg-[#f2f2f2] hover:text-accent"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
