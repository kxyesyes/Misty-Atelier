import Image from "next/image";
import Link from "next/link";
import type { CurationPathEntry } from "@/lib/curation-path";
import {
  getArtworkHorizontalPreviewFrameClass,
  getArtworkHorizontalPreviewImageClass,
  getArtworkHorizontalPreviewSource,
  shouldUseArtworkHorizontalPreviewBackdrop,
} from "@/lib/image-layout";

export function CurationTrail({
  entry,
  compact = false,
  routeLabel,
}: {
  entry: CurationPathEntry;
  compact?: boolean;
  routeLabel?: string;
}) {
  return (
    <section className="border-y border-ink/10 py-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-rain">
            {routeLabel ?? "Curation Path"}
          </p>
          <h2 className={compact ? "text-2xl leading-tight" : "text-3xl leading-tight"}>
            {entry.exhibition.pathLabel}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/62">
            {entry.exhibition.pathDescription}
          </p>
        </div>
        <Link
          href={`/exhibitions/${entry.nextExhibition.slug}`}
          className="font-sans text-xs uppercase tracking-[0.18em] text-rain transition-colors hover:text-amber"
        >
          Next: {entry.nextExhibition.titleEn}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {entry.featuredWorks.map((work) => (
          <Link key={work.slug} href={`/works/${work.slug}`} className="group block">
            {/*
              Wide previews are generated assets, not CSS crops: portrait originals stay
              intact while outpainted sides provide the horizontal composition.
            */}
            <div
              className={`floating-art relative overflow-hidden ${getArtworkHorizontalPreviewFrameClass(
                work.orientation,
              )}`}
            >
              {shouldUseArtworkHorizontalPreviewBackdrop(work.orientation, Boolean(work.wideThumbnail)) && (
                <Image
                  src={work.thumbnail}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(min-width: 1024px) 22vw, 90vw"
                  className="scale-110 object-cover opacity-20 blur-lg saturate-75"
                  quality={60}
                />
              )}
              <Image
                src={getArtworkHorizontalPreviewSource(work)}
                alt={work.titleEn}
                fill
                sizes="(min-width: 1024px) 22vw, 90vw"
                className={`z-10 ${getArtworkHorizontalPreviewImageClass(
                  work.orientation,
                  Boolean(work.wideThumbnail),
                )} transition duration-700 group-hover:scale-[1.04]`}
              />
            </div>
            <p className="mt-3 text-lg leading-tight text-ink transition-colors group-hover:text-amber">
              {work.titleEn}
            </p>
            {work.caption && (
              <p className="mt-2 text-sm leading-6 text-rain">
                {work.caption}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
