"use client";

import { useMemo } from "react";
import { adsConfig } from "@/config/ads";

type HeaderAdProps = {
  code?: string | null;
  enabled?: boolean;
};

export function HeaderAd({ code, enabled = true }: HeaderAdProps) {
  const headerBanner728Code = useMemo(
    () => adsConfig.headerBanner728Code?.trim() || code?.trim() || "",
    [code]
  );

  const iframeDocument = useMemo(
    () =>
      `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}body{display:flex;align-items:center;justify-content:center;width:100%;height:90px}</style></head><body>${headerBanner728Code}</body></html>`,
    [headerBanner728Code]
  );

  if (!enabled || !adsConfig.enabled) {
    return null;
  }

  return (
    <div className="section-box mb-4">
      <div className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden rounded-md border border-dashed border-[#e5e7eb] bg-[#fafafa]">
        {headerBanner728Code ? (
          <iframe
            title="Header Banner Ad"
            srcDoc={iframeDocument}
            width="728"
            height="90"
            frameBorder="0"
            scrolling="no"
            className="block h-[90px] w-full max-w-[728px] border-0"
          />
        ) : (
          <div aria-hidden="true" className="h-[90px] w-full max-w-[728px]" />
        )}
      </div>
    </div>
  );
}
