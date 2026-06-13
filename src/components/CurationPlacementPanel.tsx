import Image from "next/image";
import Link from "next/link";
import type { CurationRoutePlacement } from "@/lib/curation-path";
import { getArtworkHorizontalPreviewSource } from "@/lib/image-layout";

const routeLabels = ["Route I", "Route II", "Route III", "Route IV", "Route V", "Route VI"];

export function CurationPlacementPanel({
  placement,
}: {
  placement: CurationRoutePlacement;
}) {
  const currentPosition =
    placement.activeWorkIndex === undefined ? undefined : placement.activeWorkIndex + 1;

  return (
    <section className="page-x mx-auto mt-10 max-w-7xl border-t border-mist/70 pt-10">
      <div className="ink-panel grid gap-7 p-5 sm:p-6 lg:grid-cols-[0.58fr_1.42fr] lg:p-7">
        <div className="max-w-md">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-rain">
            Route Placement
          </p>
          <h2 className="mt-4 text-3xl leading-tight text-ink">
            {placement.entry.exhibition.pathLabel}
          </h2>
          <p className="mt-4 text-sm leading-7 text-ink/62">
            {placement.entry.exhibition.pathDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs uppercase tracking-[0.18em] text-rain">
            <span>{routeLabels[placement.routeIndex]}</span>
            {currentPosition && (
              <span>
                {String(currentPosition).padStart(2, "0")} /{" "}
                {String(placement.entry.featuredWorks.length).padStart(2, "0")}
              </span>
            )}
            <Link href="/route" className="transition-colors hover:text-cinnabar">
              Full Route
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {placement.entry.featuredWorks.map((work, index) => {
            const isActive = index === placement.activeWorkIndex;

            return (
              <Link
                key={work.slug}
                href={`/works/${work.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`group p-2 transition-colors ${
                  isActive
                    ? "text-cinnabar"
                    : "text-ink hover:text-cinnabar"
                }`}
              >
                <div className="floating-art relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getArtworkHorizontalPreviewSource(work)}
                    alt={work.titleEn}
                    fill
                    sizes="(min-width: 1024px) 18vw, 90vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    quality={78}
                  />
                </div>
                <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.18em] text-rain">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-base leading-tight text-ink transition-colors group-hover:text-cinnabar">
                  {work.titleEn}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
