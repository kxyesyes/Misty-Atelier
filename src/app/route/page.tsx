import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { CurationTrail } from "@/components/CurationTrail";
import { FadeIn } from "@/components/FadeIn";
import { getHomeCurationPath } from "@/lib/curation-path";

const routeLabels = ["Route I", "Route II", "Route III", "Route IV", "Route V", "Route VI"];

export const metadata: Metadata = {
  title: "Curation Route",
  description: "A complete guided route through Misty Atelier's rooms, weather, studio hours, and distant fables.",
};

export default function RoutePage() {
  const curationPath = getHomeCurationPath();

  return (
    <main className="ink-paper-fibers min-h-screen text-ink">
      <div className="page-x mx-auto max-w-7xl py-10 sm:py-14">
        <FadeIn delay={0.1}>
          <nav className="mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-rain transition-colors hover:text-cinnabar"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Index</span>
            </Link>
          </nav>

          <header className="mb-16 grid gap-8 border-y border-ink/10 py-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,0.42fr)] lg:items-end">
            <div>
              <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-rain">
                Guided Archive
              </p>
              <h1 className="text-5xl leading-none tracking-normal sm:text-6xl">
                Curation Route
              </h1>
            </div>
            <p className="text-base leading-8 text-ink/68">
              A complete walk through Misty Atelier: begin with blue rooms, pass through rain,
              glass, seasons, and studio hours, then leave by the small fables at the edge of the archive.
            </p>
          </header>
        </FadeIn>

        <div className="grid gap-12">
          {curationPath.map((entry, index) => (
            <FadeIn key={entry.exhibition.slug} delay={0.08}>
              <CurationTrail
                entry={entry}
                compact={index > 0}
                routeLabel={routeLabels[index]}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}
