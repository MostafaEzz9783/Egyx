import { HeaderAd } from "@/components/ads/HeaderAd";
import { Footer } from "@/components/Footer";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Navbar } from "@/components/Navbar";
import { RightSidebar } from "@/components/RightSidebar";
import { getEnabledAds } from "@/lib/content";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const ads = await getEnabledAds(["header", "sidebar"]);

  return (
    <>
      <Navbar />
      <main className="page-shell py-4 lg:py-5">
        <HeaderAd code={ads.header?.code} enabled={ads.header?.enabled ?? true} />

        <div className="public-layout mt-4">
          <aside className="public-layout-left">
            <div className="sticky top-24">
              <LeftSidebar sidebarAdCode={ads.sidebar?.code} sidebarAdEnabled={ads.sidebar?.enabled ?? true} />
            </div>
          </aside>

          <section className="public-layout-center">{children}</section>

          <aside className="public-layout-right">
            <div className="sticky top-24">
              <RightSidebar sidebarAdCode={ads.sidebar?.code} sidebarAdEnabled={ads.sidebar?.enabled ?? true} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
