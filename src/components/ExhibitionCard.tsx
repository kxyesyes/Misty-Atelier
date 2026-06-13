import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/data/artworks";
import type { Exhibition } from "@/data/exhibitions";

export function ExhibitionCard({
  exhibition,
  coverArtwork,
}: {
  exhibition: Exhibition;
  coverArtwork?: Artwork;
}) {
  const isLandscapeCover = coverArtwork?.orientation === "landscape";

  return (
    <Link
      href={`/exhibitions/${exhibition.slug}`}
      className="group grid h-full min-h-[250px] overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        color: exhibition.palette.foreground,
      }}
    >
      <div
        className={
          isLandscapeCover
            ? "grid h-full items-start gap-5 p-5"
            : "grid h-full items-start gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_122px]"
        }
      >
        {coverArtwork && (
          <div
            className={`floating-art relative overflow-hidden ${
              isLandscapeCover ? "order-first aspect-[3/2]" : "aspect-[3/4] self-start"
            }`}
          >
            <Image
              src={coverArtwork.thumbnail}
              alt={exhibition.titleEn}
              fill
              sizes={isLandscapeCover ? "(min-width: 1024px) 30vw, 90vw" : "122px"}
              className="object-cover transition duration-700 group-hover:scale-105"
              quality={88}
            />
          </div>
        )}

        <div className="museum-glass flex h-full flex-col justify-between px-4 py-3">
          <div>
            <p
              className="mb-4 text-xs font-sans font-semibold uppercase tracking-[0.22em]"
              style={{ color: exhibition.palette.accent }}
            >
              0{exhibition.sortOrder + 1}
            </p>
            <h3 className="text-2xl leading-tight">{exhibition.titleEn}</h3>
            <p className="mt-2 text-sm opacity-65">{exhibition.titleZh}</p>
          </div>
          <p className="mt-8 text-sm leading-6 opacity-75">{exhibition.summary}</p>
        </div>
      </div>
    </Link>
  );
}
