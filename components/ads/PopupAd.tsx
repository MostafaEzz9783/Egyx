"use client";

import { useEffect, useRef } from "react";
import { adsConfig } from "@/config/ads";

type PopupAdProps = {
  code?: string | null;
  enabled?: boolean;
};

function mountScriptMarkup(container: HTMLDivElement, markup: string) {
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

export function PopupAd({ code, enabled = true }: PopupAdProps) {
  const scriptRef = useRef<HTMLDivElement | null>(null);
  const effectiveEnabled = adsConfig.enabled && (enabled || Boolean(adsConfig.popunderScriptCode));
  const effectiveCode = adsConfig.popunderScriptCode || code;

  useEffect(() => {
    if (!effectiveEnabled || !effectiveCode || !scriptRef.current) {
      return;
    }

    mountScriptMarkup(scriptRef.current, effectiveCode);

    return () => {
      if (scriptRef.current) {
        scriptRef.current.innerHTML = "";
      }
    };
  }, [effectiveCode, effectiveEnabled]);

  return <div ref={scriptRef} className="hidden" aria-hidden="true" />;
}
