import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Maximize2 } from "lucide-react";
import {
  getAdjacentArtworks,
  getAllArtworks,
  getArtworkBySlug,
  getRelatedArtworks,
} from "@/lib/artwork-query";
import { getExhibitionBySlug } from "@/lib/exhibition-query";
import { getRecipeNoteByArtworkSlug } from "@/lib/recipe-query";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ArtworkInfoPanel } from "@/components/ArtworkInfoPanel";
import { CurationPlacementPanel } from "@/components/CurationPlacementPanel";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/FadeIn";
import type { Artwork } from "@/data/artworks";
import { getArtworkImageFitClass } from "@/lib/image-layout";
import { getCurationRouteForArtwork } from "@/lib/curation-path";

export async function generateStaticParams() {
  return getAllArtworks().map((artwork) => ({
    slug: artwork.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const work = getArtworkBySlug(params.slug);

  if (!work) {
    return {
      title: "Work Not Found",
    };
  }

  return {
    title: work.titleEn,
    description: work.description,
    openGraph: {
      title: work.titleEn,
      description: work.description,
      images: [{ url: work.thumbnail, alt: work.titleEn }],
    },
  };
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const work = getArtworkBySlug(params.slug);

  if (!work) {
    notFound();
  }

  const exhibition = getExhibitionBySlug(work.exhibition);
  const note = getRecipeNoteByArtworkSlug(work.slug);
  const relatedWorks = getRelatedArtworks(work.slug, 4);
  const adjacentWorks = getAdjacentArtworks(work.slug);
  const curationPlacement = getCurationRouteForArtwork(work.slug);

  return (
    <main className="min-h-screen overflow-hidden pb-24 text-ink">
      <div className="page-x relative mx-auto grid max-w-7xl gap-12 py-8 sm:py-12 lg:grid-cols-[minmax(360px,0.62fr)_minmax(0,1.05fr)] lg:gap-20 lg:py-16">
        <FadeIn delay={0.1} className="contents">
          <nav className="absolute left-5 top-6 z-10 sm:left-8 md:left-12 md:top-12">
            <Link
              href={`/exhibitions/${work.exhibition}`}
              className="museum-glass inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em] text-rain transition-colors hover:text-amber"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{exhibition?.titleEn}</span>
            </Link>
          </nav>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-12 lg:sticky lg:top-8 lg:order-2 lg:mt-0 lg:h-[calc(100vh-4rem)]">
          <div className="relative flex h-full min-h-[68vh] items-center justify-center">
            <Image
              src={work.src}
              alt={work.titleEn}
              width={1400}
              height={1800}
              className={`floating-art h-auto max-h-[92vh] w-full ${getArtworkImageFitClass(work.orientation, "detail")}`}
              quality={100}
              priority
            />
            <a
              href={work.src}
              target="_blank"
              rel="noreferrer"
              className="museum-glass absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 px-3 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-rain transition-colors hover:text-amber"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Open Full Image
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.5} className="lg:order-1 lg:py-28">
          <ArtworkInfoPanel artwork={work} exhibition={exhibition} recipeNote={note} />
        </FadeIn>
      </div>

      <FadeIn className="page-x mx-auto mt-4 grid max-w-7xl gap-4 border-t border-mist/70 pt-8 sm:grid-cols-2">
        <AdjacentArtworkLink label="Previous Work" artwork={adjacentWorks.previous} />
        <AdjacentArtworkLink label="Next Work" artwork={adjacentWorks.next} align="right" />
        {curationPlacement && (
          <Link
            href={`/exhibitions/${curationPlacement.entry.nextExhibition.slug}`}
            className="font-sans text-xs uppercase tracking-[0.2em] text-rain transition-colors hover:text-amber sm:col-span-2 sm:justify-self-center"
          >
            Continue path: {curationPlacement.entry.nextExhibition.titleEn}
          </Link>
        )}
      </FadeIn>

      {curationPlacement && (
        <FadeIn delay={0.08}>
          <CurationPlacementPanel placement={curationPlacement} />
        </FadeIn>
      )}

      {relatedWorks.length > 0 && (
        <FadeInStagger className="page-x mx-auto mt-12 w-full max-w-7xl border-t border-mist/70 pt-14">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-rain">Continue Viewing</p>
              <h2 className="text-3xl leading-tight text-ink">Related Works</h2>
            </div>
            <Link href={`/exhibitions/${work.exhibition}`} className="text-sm text-rain transition-colors hover:text-amber">
              Return to {exhibition?.titleEn}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
            {relatedWorks.map((relatedWork) => (
              <FadeInStaggerItem key={relatedWork.slug}>
                <ArtworkCard artwork={relatedWork} variant="related" />
              </FadeInStaggerItem>
            ))}
          </div>
        </FadeInStagger>
      )}
    </main>
  );
}

function AdjacentArtworkLink({
  label,
  artwork,
  align = "left",
}: {
  label: string;
  artwork?: Artwork;
  align?: "left" | "right";
}) {
  if (!artwork) return <div />;

  return (
    <Link
      href={`/works/${artwork.slug}`}
      className={`group museum-glass flex items-center gap-4 p-3 transition-colors hover:text-amber ${
        align === "right" ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-mist/20">
        <Image
          src={artwork.thumbnail}
          alt={artwork.titleEn}
          fill
          sizes="64px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-rain">{label}</p>
        <p className="mt-2 text-lg leading-tight text-ink transition-colors group-hover:text-amber">
          {artwork.titleEn}
        </p>
      </div>
    </Link>
  );
}
