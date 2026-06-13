import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getAllExhibitions,
  getExhibitionArtworks,
  getExhibitionBySlug,
  getExhibitionCoverArtwork,
  getNextExhibition,
} from "@/lib/exhibition-query";
import { ArtworkCard } from "@/components/ArtworkCard";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";
import { getArtworkGridSpanClass } from "@/lib/image-layout";
import { CurationTrail } from "@/components/CurationTrail";
import { getCurationPathForExhibition } from "@/lib/curation-path";

export async function generateStaticParams() {
  return getAllExhibitions().map((ex) => ({
    slug: ex.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ex = getExhibitionBySlug(params.slug);

  if (!ex) {
    return {
      title: "Exhibition Not Found",
    };
  }

  const coverArtwork = getExhibitionCoverArtwork(params.slug);

  return {
    title: ex.titleEn,
    description: ex.summary,
    openGraph: {
      title: ex.titleEn,
      description: ex.summary,
      images: coverArtwork ? [{ url: coverArtwork.thumbnail, alt: ex.titleEn }] : undefined,
    },
  };
}

export default function ExhibitionPage({ params }: { params: { slug: string } }) {
  const ex = getExhibitionBySlug(params.slug);
  
  if (!ex) {
    notFound();
  }

  const exWorks = getExhibitionArtworks(params.slug);
  const coverArtwork = getExhibitionCoverArtwork(params.slug);
  const nextEx = getNextExhibition(params.slug);
  const curationEntry = getCurationPathForExhibition(params.slug);
  const coverFrameClass =
    coverArtwork?.orientation === "landscape"
      ? "aspect-[3/2]"
      : coverArtwork && coverArtwork.aspectRatio < 0.6
        ? "aspect-[9/16] max-h-[620px]"
        : "aspect-[4/5] max-h-[620px]";

  return (
    <main className="min-h-screen overflow-hidden text-ink">
      <div className="page-x mx-auto max-w-7xl py-12 sm:py-16">
        <FadeIn delay={0.1}>
          <nav className="mb-16">
            <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber transition-colors text-sm tracking-widest uppercase">
              <ArrowLeft className="w-4 h-4" />
              <span>Index</span>
            </Link>
          </nav>

          <header
            className="mb-16 grid gap-10 overflow-hidden border-y border-ink/10 py-8 md:grid-cols-[1fr_0.62fr] md:items-center md:py-12"
            style={{ backgroundColor: ex.palette.background, color: ex.palette.foreground }}
          >
            <div className="flex-1 px-1">
              <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] opacity-60">
                Exhibition 0{ex.sortOrder + 1}
              </p>
              <h1 className="mb-4 text-5xl leading-none tracking-normal sm:text-6xl">{ex.titleEn}</h1>
              <h2 className="mb-8 text-2xl opacity-65">{ex.titleZh}</h2>
              <p className="max-w-xl text-lg leading-8 opacity-75">{ex.summary}</p>
              
              <div className="mt-8 flex flex-wrap gap-2">
                {ex.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-sm border px-2.5 py-1.5 font-sans text-xs leading-none tracking-wide"
                    style={{ borderColor: `${ex.palette.accent}66`, color: ex.palette.foreground }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                {Object.entries(ex.palette).map(([name, color]) => (
                  <div
                    key={name}
                    aria-label={`${name}: ${color}`}
                    className="h-8 w-8 rounded-full shadow-inner ring-1 ring-ink/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {coverArtwork && (
               <div
                 className={`floating-art relative mx-auto w-full max-w-md overflow-hidden ${coverFrameClass}`}
               >
                 <Image
                   src={coverArtwork.src}
                   alt={`${ex.titleEn} cover`}
                   fill
                   className={coverArtwork.orientation === "landscape" ? "object-cover" : "object-contain"}
                   sizes="(min-width: 1024px) 32vw, 90vw"
                   quality={100}
                   priority
                 />
               </div>
            )}
          </header>
        </FadeIn>

        <FadeIn delay={0.15} className="mx-auto mb-20 max-w-4xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-rain">Curator Note</p>
          <p className="text-xl leading-9 text-ink/72">{ex.curatorNote}</p>
        </FadeIn>

        <FadeInStagger className="mx-auto mt-20 columns-1 gap-12 md:columns-2">
          {exWorks.map((work) => (
            <FadeInStaggerItem
              key={work.slug}
              className={`mb-16 break-inside-avoid ${getArtworkGridSpanClass(work.orientation, "exhibition")}`}
            >
              <ArtworkCard artwork={work} variant="grid" />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        {curationEntry && (
          <FadeIn delay={0.2} className="mx-auto mt-24 max-w-5xl">
            <CurationTrail entry={curationEntry} />
          </FadeIn>
        )}

        {nextEx && (
          <FadeIn delay={0.3} className="mt-32 pt-16 border-t border-mist flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Next Exhibition</span>
            <Link href={`/exhibitions/${nextEx.slug}`} className="text-2xl font-serif hover:text-amber transition-colors">
              {nextEx.titleEn} &rarr;
            </Link>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
