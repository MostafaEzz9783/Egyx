"use client";

import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { adsConfig } from "@/config/ads";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Source = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  quality: string;
  language: string;
  isPrimary: boolean;
};

type PlayerProps = {
  sources: Source[];
  title: string;
};

type GateMode = "initial" | "fullscreen" | "open";

const initialGateMessage = "اضغط مرة أخرى للمتابعة";
const fullscreenGateMessage = "اضغط مرتين للعودة إلى المشاهدة";

function openUrlInNewTab(url?: string) {
  if (!url) {
    return false;
  }

  const popupWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (popupWindow) {
    return true;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  return true;
}

function openSmartlink() {
  return openUrlInNewTab(adsConfig.primarySmartlink) || openUrlInNewTab(adsConfig.secondarySmartlink);
}

function readSessionCount(key: string) {
  return Number(window.sessionStorage.getItem(key) || "0");
}

function writeSessionCount(key: string, value: number) {
  window.sessionStorage.setItem(key, String(value));
}

export function Player({ sources, title }: PlayerProps) {
  const orderedSources = useMemo(
    () =>
      [...sources].sort((first, second) => {
        if (first.isPrimary === second.isPrimary) {
          return 0;
        }
        return first.isPrimary ? -1 : 1;
      }),
    [sources]
  );
  const [activeSourceId, setActiveSourceId] = useState(orderedSources[0]?.id);
  const [gateMode, setGateMode] = useState<GateMode>(adsConfig.playerGate.enabled ? "initial" : "open");
  const [gateMessage, setGateMessage] = useState(initialGateMessage);
  const hadFullscreenRef = useRef(false);

  const activeSource = orderedSources.find((source) => source.id === activeSourceId) || orderedSources[0];
  const videoUrl = activeSource?.sourceUrl;

  useEffect(() => {
    if (!adsConfig.playerGate.enabled) {
      setGateMode("open");
      return;
    }

    const initialClicks = readSessionCount(adsConfig.playerGate.sessionKey);
    setGateMode(initialClicks >= adsConfig.playerGate.requiredClicksBeforeAccess ? "open" : "initial");
    setGateMessage(initialGateMessage);
  }, []);

  useEffect(() => {
    if (!adsConfig.fullscreenGate.enabled) {
      return;
    }

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        hadFullscreenRef.current = true;
        return;
      }

      if (!hadFullscreenRef.current) {
        return;
      }

      hadFullscreenRef.current = false;
      writeSessionCount(adsConfig.fullscreenGate.sessionKey, 0);
      setGateMode("fullscreen");
      setGateMessage(fullscreenGateMessage);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!activeSource) {
    return <Card className="p-6 text-center text-muted">لا توجد مصادر تشغيل متاحة لهذا المحتوى حتى الآن.</Card>;
  }

  function handleGateClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (gateMode === "open") {
      return;
    }

    if (gateMode === "initial") {
      const currentClicks = readSessionCount(adsConfig.playerGate.sessionKey);

      if (currentClicks >= adsConfig.playerGate.requiredClicksBeforeAccess) {
        setGateMode("open");
        return;
      }

      openSmartlink();
      writeSessionCount(adsConfig.playerGate.sessionKey, currentClicks + 1);

      setGateMessage(initialGateMessage);
      return;
    }

    const currentClicks = readSessionCount(adsConfig.fullscreenGate.sessionKey);

    if (currentClicks >= adsConfig.fullscreenGate.requiredClicksBeforeAccess) {
      setGateMode("open");
      return;
    }

    openSmartlink();
    writeSessionCount(adsConfig.fullscreenGate.sessionKey, currentClicks + 1);

    setGateMessage(fullscreenGateMessage);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-border bg-black shadow-sm">
        <div className="relative aspect-video">
          <iframe
            src={videoUrl}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute inset-0 h-full w-full"
          />
          {gateMode !== "open" ? (
            <button
              type="button"
              onClick={handleGateClick}
              className="absolute inset-0 z-10 flex cursor-pointer items-end justify-center bg-transparent p-4 text-center"
              aria-label={gateMessage}
            >
              <span className="rounded-md bg-black/70 px-4 py-2 text-sm font-medium text-white">{gateMessage}</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {orderedSources.map((source, index) => (
          <Button
            key={source.id}
            variant={source.id === activeSource.id ? "primary" : "secondary"}
            onClick={() => setActiveSourceId(source.id)}
          >
            {source.sourceName || `سيرفر ${index + 1}`} - {source.quality}
          </Button>
        ))}
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-4 text-sm text-muted">
        <span>المصدر الحالي: {activeSource.sourceName}</span>
        <span>الجودة: {activeSource.quality}</span>
        <span>اللغة: {activeSource.language}</span>
      </Card>
    </div>
  );
}
