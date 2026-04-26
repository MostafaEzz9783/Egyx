import { adsConfig } from "@/config/ads";
import { AdSlot } from "@/components/ads/AdSlot";

type HeaderAdProps = {
  code?: string | null;
  enabled?: boolean;
};

export function HeaderAd({ code, enabled = true }: HeaderAdProps) {
  return (
    <AdSlot
      code={code}
      enabled={adsConfig.enabled && enabled}
      fallbackLabel="مساحة إعلانية علوية"
      className="mt-4"
      minHeightClassName="min-h-[90px]"
    />
  );
}
