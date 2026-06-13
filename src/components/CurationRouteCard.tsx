import Image from "next/image";
import Link from "next/link";
import type { CurationPathEntry } from "@/lib/curation-path";
import { getArtworkHorizontalPreviewSource } from "@/lib/image-layout";

export function CurationRouteCard({
  entry,
  routeLabel,
}: {
  entry: CurationPathEntry;
  routeLabel: string;
}) {
  const previewWork = entry.featuredWorks[0];

  return (
    <Link
      href="/route"
      className="group grid gap-4 border-t border-ink/10 py-5 transition-colors hover:border-cinnabar sm:grid-cols-[160px_minmax(0,1fr)]"
    >
      {previewWork && (
        <div className="floating-art relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={getArtworkHorizontalPreviewSource(previewWork)}
            alt=""
            fill
            aria-hidden="true"
            sizes="160px"
            className="object-cover grayscale-[10%] sepia-[8%] transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
            quality={74}
          />
        </div>
      )}
      <div className="self-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-rain">
          {routeLabel}
        </p>
        <h3 className="mt-2 text-xl leading-tight text-ink transition-colors group-hover:text-cinnabar">
          {entry.exhibition.pathLabel}
        </h3>
        <p className="mt-2 text-sm leading-6 text-rain">
          {entry.exhibition.pathDescription}
        </p>
      </div>
    </Link>
  );
}
