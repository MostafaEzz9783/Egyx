import { adsConfig } from "@/config/ads";
import { AdSlot } from "@/components/ads/AdSlot";

type SidebarAdProps = {
  code?: string | null;
  enabled?: boolean;
};

export function SidebarAd({ code, enabled = true }: SidebarAdProps) {
  return (
    <AdSlot
      code={adsConfig.sidebarBanner160x600Code || code}
      enabled={adsConfig.enabled && enabled}
      fallbackLabel="مساحة إعلانية جانبية"
      className="mt-4"
      minHeightClassName="min-h-[600px]"
    />
  );
}
