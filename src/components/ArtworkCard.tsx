import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/data/artworks";
import { getArtworkFrameClass, getArtworkImageFitClass } from "@/lib/image-layout";

type ArtworkCardVariant = "feature" | "grid" | "related";

const copyByVariant: Record<ArtworkCardVariant, string> = {
  feature: "mt-3 max-w-sm text-sm leading-6 text-rain",
  grid: "mt-1 text-xs font-sans uppercase tracking-[0.16em] text-rain",
  related: "mt-1 text-xs font-sans uppercase tracking-[0.16em] text-rain",
};

export function ArtworkCard({
  artwork,
  variant = "grid",
  priority = false,
}: {
  artwork: Artwork;
  variant?: ArtworkCardVariant;
  priority?: boolean;
}) {
  const showDescription = variant === "feature";
  const frameClass = getArtworkFrameClass(artwork);
  const imageFitClass = getArtworkImageFitClass(artwork.orientation, "card");
  const compact = variant === "related";

  return (
    <Link
      href={`/works/${artwork.slug}`}
      className="group block break-inside-avoid focus-visible:outline-none"
    >
      <div
        className={`floating-art parallax-art relative mb-4 overflow-hidden bg-transparent transition duration-700 group-hover:-translate-y-1 ${frameClass}`}
      >
        <Image
          src={artwork.thumbnail}
          alt={artwork.titleEn}
          fill
          priority={priority}
          sizes={
            variant === "related"
              ? "(min-width: 1024px) 22vw, 45vw"
              : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          }
          className={`${imageFitClass} transition duration-1000 group-hover:scale-[1.025]`}
          quality={variant === "feature" ? 92 : 86}
        />
        {!compact && (
          <span className="museum-glass absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] translate-y-2 px-3 py-2 font-sans text-[10px] uppercase tracking-[0.18em] text-ink opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {artwork.titleEn}
          </span>
        )}
      </div>
      <h3 className="text-lg leading-tight text-ink transition-colors group-hover:text-amber">
        {artwork.titleEn}
      </h3>
      {variant !== "related" && <p className="mt-1 text-sm text-rain">{artwork.titleZh}</p>}
      {showDescription && <p className={copyByVariant[variant]}>{artwork.description}</p>}
    </Link>
  );
}
