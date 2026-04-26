"use client";

import { useEffect, useMemo, useRef } from "react";
import { adsConfig } from "@/config/ads";

type HeaderAdProps = {
  code?: string | null;
  enabled?: boolean;
};

function executeScripts(container: HTMLDivElement) {
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

export function HeaderAd({ code, enabled = true }: HeaderAdProps) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const headerBanner728Code = useMemo(
    () => adsConfig.headerBanner728Code?.trim() || code?.trim() || "",
    [code]
  );

  useEffect(() => {
    if (!enabled || !adsConfig.enabled || !headerBanner728Code || !adRef.current) {
      return;
    }

    console.log("HeaderAd loaded", headerBanner728Code);
    executeScripts(adRef.current);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, [enabled, headerBanner728Code]);

  if (!enabled || !adsConfig.enabled || !headerBanner728Code) {
    return null;
  }

  return (
    <div className="mt-4 flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#d8d8d8] bg-white p-4 shadow-sm">
      <div
        ref={adRef}
        className="flex min-h-[90px] w-full items-center justify-center"
        dangerouslySetInnerHTML={{ __html: headerBanner728Code }}
      />
    </div>
  );
}
