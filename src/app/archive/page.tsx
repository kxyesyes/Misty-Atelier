import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";
import { FadeIn } from "@/components/FadeIn";
import { getAllArtworks } from "@/lib/artwork-query";
import { getAllExhibitions } from "@/lib/exhibition-query";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse Misty Atelier works by exhibition, mood, color, scene, and format.",
};

export default function ArchivePage() {
  const artworks = getAllArtworks();
  const exhibitions = getAllExhibitions();
  const importedCount = Math.max(0, artworks.length - 54);

  return (
    <main className="ink-paper-fibers min-h-screen text-ink">
      <div className="page-x mx-auto max-w-7xl py-10 sm:py-14">
        <FadeIn delay={0.1}>
          <nav className="mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-rain transition-colors hover:text-cinnabar"
            >
              <ArrowLeft className="h-4 w-4" />
              Index
            </Link>
          </nav>

          <header className="paper-grain mb-14 grid gap-8 border-y border-ink/10 py-10 md:grid-cols-[minmax(0,1fr)_360px] md:items-end md:py-12">
            <div>
              <p className="kicker mb-4">Archive · 画藏</p>
              <h1 className="max-w-3xl text-5xl leading-none tracking-normal sm:text-7xl">
                Weather-indexed works.
              </h1>
            </div>
            <p className="text-pretty text-base leading-8 text-ink/76">
              {artworks.length} works arranged by exhibition, visual mood, color memory,
              scene type, and image format. {importedCount} recent 9:16 additions are kept visible
              without changing the curated route.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ArchiveExplorer artworks={artworks} exhibitions={exhibitions} />
        </FadeIn>
      </div>
    </main>
  );
}
