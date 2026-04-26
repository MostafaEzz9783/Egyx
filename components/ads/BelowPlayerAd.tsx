import { adsConfig } from "@/config/ads";
import { AdSlot } from "@/components/ads/AdSlot";

type BelowPlayerAdProps = {
  code?: string | null;
  enabled?: boolean;
};

export function BelowPlayerAd({ code, enabled = true }: BelowPlayerAdProps) {
  return (
    <AdSlot
      code={code}
      enabled={adsConfig.enabled && enabled}
      fallbackLabel="إعلان أسفل المشغل"
      className="mt-4"
      minHeightClassName="min-h-[110px]"
    />
  );
}
