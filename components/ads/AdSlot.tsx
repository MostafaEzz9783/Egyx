"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";

type AdSlotProps = {
  code?: string | null;
  enabled?: boolean;
  fallbackLabel: string;
  className?: string;
  minHeightClassName?: string;
};

function mountAdMarkup(container: HTMLDivElement, markup: string) {
  container.innerHTML = markup;

  const scripts = Array.from(container.querySelectorAll("script"));
  for (const oldScript of scripts) {
    const newScript = document.createElement("script");

    for (const attribute of oldScript.attributes) {
      newScript.setAttribute(attribute.name, attribute.value);
    }

    if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }

    oldScript.parentNode?.replaceChild(newScript, oldScript);
  }
}

export function AdSlot({
  code,
  enabled = true,
  fallbackLabel,
  className = "",
  minHeightClassName = "min-h-[120px]"
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const hasCode = Boolean(code?.trim());

  useEffect(() => {
    if (!enabled || !hasCode || !adRef.current) {
      return;
    }

    mountAdMarkup(adRef.current, code as string);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, [code, enabled, hasCode]);

  if (!enabled) {
    return null;
  }

  return (
    <Card className={`overflow-hidden ${minHeightClassName} ${className}`}>
      <div className={`flex h-full w-full items-center justify-center p-4 text-center ${minHeightClassName}`}>
        {hasCode ? (
          <div
            ref={adRef}
            className="flex min-h-full w-full items-center justify-center rounded-md border border-dashed border-[#d8d8d8] bg-[#fafafa] p-4 text-sm text-[#444]"
          />
        ) : process.env.NODE_ENV === "development" ? (
          <div className="rounded-md border border-dashed border-[#d8d8d8] bg-[#fafafa] px-4 py-3 text-xs text-muted">
            {fallbackLabel}
          </div>
        ) : (
          <div aria-hidden="true" className="w-full" />
        )}
      </div>
    </Card>
  );
}
