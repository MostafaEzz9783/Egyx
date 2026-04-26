import Link from "next/link";

type SectionBoxProps = {
  title: string;
  moreHref?: string;
  children: React.ReactNode;
};

export function SectionBox({ title, moreHref, children }: SectionBoxProps) {
  return (
    <section className="section-box">
      <div className="section-box-header">
        <h2 className="section-title">{title}</h2>
        {moreHref ? (
          <Link href={moreHref} className="section-more">
            المزيد »
          </Link>
        ) : (
          <span />
        )}
      </div>
      {children}
    </section>
  );
}
