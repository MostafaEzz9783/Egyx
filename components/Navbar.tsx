"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9d9d9] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
      <div className="page-shell flex min-h-[72px] flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-2 flex items-center justify-end lg:order-3 lg:w-[220px] lg:flex-none">
          <Link href="/" className="text-[2rem] font-black leading-none tracking-tight text-[#d92027]">
            EgyX
          </Link>
        </div>

        <div className="order-1 flex flex-1 justify-center lg:order-2">
          <Suspense fallback={<div className="h-11 w-full max-w-[760px] rounded-xl border border-[#d8dce5] bg-white" />}>
            <SearchBar className="w-full max-w-[760px]" />
          </Suspense>
        </div>

        <div className="order-3 flex items-center justify-start gap-2 lg:order-1 lg:w-[220px] lg:flex-none">
          <ButtonLink href="/admin/login" variant="ghost" className="border border-[#d9d9d9] text-foreground hover:border-accent">
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
