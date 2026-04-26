"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  placeholder = "ابحث عن فيلم أو مسلسل أو ممثل...",
  className
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (deferredValue) {
      params.set("q", deferredValue);
    } else {
      params.delete("q");
    }
    params.delete("page");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.replace(url);
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [deferredValue, pathname, router, searchParams]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}
