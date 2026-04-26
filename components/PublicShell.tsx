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
        <div className="mt-4 grid gap-4 lg:grid-cols-[250px,minmax(0,1fr),220px]">
          <aside className="hidden lg:block lg:col-start-3">
            <div className="sticky top-24">
              <RightSidebar />
            </div>
          </aside>
          <section className="space-y-4 lg:col-start-2">{children}</section>
          <aside className="hidden lg:block lg:col-start-1">
            <div className="sticky top-24">
              <LeftSidebar sidebarAdCode={ads.sidebar?.code} sidebarAdEnabled={ads.sidebar?.enabled ?? true} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
