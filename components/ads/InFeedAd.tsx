import { adsConfig } from "@/config/ads";
import { AdSlot } from "@/components/ads/AdSlot";

type InFeedAdProps = {
  code?: string | null;
  enabled?: boolean;
};

export function InFeedAd({ code, enabled = true }: InFeedAdProps) {
  return (
    <AdSlot
      code={code}
      enabled={adsConfig.enabled && enabled}
      fallbackLabel="مساحة إعلانية"
      minHeightClassName="min-h-[160px]"
    />
  );
}
