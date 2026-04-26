"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
      <div className="page-shell flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-2 flex items-center justify-end lg:order-3 lg:min-w-[220px]">
          <Link href="/" className="text-3xl font-black leading-none text-[#d92027]">
            EgyX
          </Link>
        </div>

        <div className="order-1 flex-1 lg:order-2 lg:px-4">
          <Suspense fallback={<div className="h-11 w-full rounded-md border border-border bg-white" />}>
            <SearchBar className="w-full" />
          </Suspense>
        </div>

        <div className="order-3 flex items-center gap-2 lg:order-1 lg:min-w-[240px]">
          <ButtonLink href="/admin/login" variant="ghost" className="border border-border text-foreground hover:border-accent">
            تسجيل دخول
          </ButtonLink>
          <ButtonLink href="/search?q=جديد" className="whitespace-nowrap">
            اشترك الآن
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
