import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { getExhibitionCoverArtwork, getFeaturedExhibitions } from "@/lib/exhibition-query";
import { getFeaturedArtworks } from "@/lib/artwork-query";
import { getAllRecipeNotes } from "@/lib/recipe-query";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ExhibitionCard } from "@/components/ExhibitionCard";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/FadeIn";
import { LanyardClient } from "@/components/Lanyard/LanyardClient";
import { CurationRouteCard } from "@/components/CurationRouteCard";
import { CurationTrail } from "@/components/CurationTrail";
import { getHomeCurationPath } from "@/lib/curation-path";

export default function Home() {
  const heroArtworks = getFeaturedArtworks(3);
  const featuredArtworks = getFeaturedArtworks(6);
  const exhibitions = getFeaturedExhibitions();
  const recipeNotes = getAllRecipeNotes();
  const curationPath = getHomeCurationPath();
  const routeLabels = ["Route I", "Route II", "Route III", "Route IV", "Route V", "Route VI"];

  return (
    <main className="ink-paper-fibers min-h-screen overflow-hidden text-ink">
      <nav className="page-x mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 py-7 text-xs font-sans uppercase tracking-[0.22em] sm:flex-row sm:items-center">
        <Link href="/" className="font-bold transition-colors hover:text-cinnabar">
          {site.name}
        </Link>
        <div className="flex flex-wrap gap-x-7 gap-y-3 text-rain">
          {site.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="font-medium transition-colors hover:text-cinnabar">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="immersive-theatre page-x paper-grain relative mx-auto min-h-[calc(100vh-88px)] max-w-7xl overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-x-0 top-12 -z-10 h-[68vh] opacity-18">
          <Image
            src={heroArtworks[0].src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover blur-2xl scale-110"
          />
        </div>

        <FadeIn delay={0.1} className="relative z-10 grid min-h-[72vh] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-end gap-5">
              <span className="seal-mark">烟雨</span>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.26em] text-rain">
                Immersive Theatre
              </p>
            </div>
            <h1 className="flex items-start gap-6 text-balance text-6xl leading-[0.88] tracking-normal sm:text-7xl lg:text-[clamp(5rem,9vw,6rem)]">
              <span className="vertical-title text-[0.92em] leading-none text-cinnabar">烟雨阁</span>
              <span>Misty Atelier</span>
            </h1>
            <div className="ink-divider my-8" />
            <p className="max-w-xl text-lg leading-8 text-rain sm:text-xl">
              A quiet index of illustrated rooms, weather, and seasonal light.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">
              Misty Atelier is a fictional visual archive for quiet interiors, soft weather,
              seasonal stations, and distant fables.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/route"
                className="border border-ink bg-ink px-4 py-3 font-sans text-xs uppercase tracking-[0.18em] text-paper transition-colors hover:border-cinnabar hover:bg-cinnabar"
              >
                Open Full Route
              </Link>
              <Link
                href="#exhibitions"
                className="border border-ink/15 px-4 py-3 font-sans text-xs uppercase tracking-[0.18em] text-rain transition-colors hover:border-cinnabar hover:text-ink"
              >
                Browse Rooms
              </Link>
            </div>
          </div>

        <FadeInStagger className="relative min-h-[560px]">
          {heroArtworks.map((work, index) => {
            const placement = [
              "left-0 top-8 h-[78%] w-[58%] lg:left-[6%]",
              "right-[4%] top-0 h-[48%] w-[36%]",
              "bottom-8 right-[18%] h-[38%] w-[28%]",
            ][index];

            return (
              <FadeInStaggerItem
                key={work.slug}
                className={`group absolute floating-art parallax-art overflow-hidden ${placement}`}
              >
                <Link href={`/works/${work.slug}`} className="relative block h-full">
                  <Image
                    src={work.src}
                    alt={work.titleEn}
                    fill
                    priority={index === 0}
                    quality={100}
                    sizes="(min-width: 1024px) 46vw, 90vw"
                    className="object-contain grayscale-[12%] sepia-[8%] transition duration-1000 group-hover:scale-[1.02] group-hover:grayscale-0"
                  />
                  <span className="ink-panel absolute bottom-4 left-4 max-w-[80%] px-3 py-2 font-sans text-[10px] uppercase tracking-[0.18em] text-ink opacity-0 transition-opacity group-hover:opacity-100">
                    {work.titleEn}
                  </span>
                </Link>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>
        </FadeIn>
      </section>

      <section id="curation-path" className="page-x section-y mx-auto max-w-7xl">
        <FadeIn delay={0.1} className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
              <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rain">
                Guided Archive
              </p>
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Six routes through light, weather, and small fables.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-rain">
            The archive reads best as a walk: begin in blue rooms, cross rain and glass,
            then leave by season, studio, and fable.
          </p>
        </FadeIn>
        <div className="grid gap-8">
          {curationPath.slice(0, 1).map((entry, index) => (
            <CurationTrail
              key={entry.exhibition.slug}
              entry={entry}
              compact={false}
              routeLabel={routeLabels[index]}
            />
          ))}
          <div className="grid gap-x-8 lg:grid-cols-2">
            {curationPath.slice(1).map((entry, index) => (
              <CurationRouteCard
                key={entry.exhibition.slug}
                entry={entry}
                routeLabel={routeLabels[index + 1]}
              />
            ))}
          </div>
          <Link
            href="/route"
            className="justify-self-start border border-ink/15 px-4 py-3 font-sans text-xs uppercase tracking-[0.18em] text-rain transition-colors hover:border-cinnabar hover:text-ink"
          >
            View All Routes
          </Link>
        </div>
      </section>

      <section id="exhibitions" className="section-y">
        <div className="page-x mx-auto max-w-7xl">
          <FadeIn delay={0.1} className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rain">Exhibitions</p>
              <h2 className="text-3xl leading-tight sm:text-4xl">Six quiet rooms for the archive.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-rain">
              Each section is arranged by atmosphere first: light, weather, season, studio,
              and the small myths that live beyond the room.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {exhibitions.map((exhibition) => (
              <FadeInStaggerItem key={exhibition.slug}>
                <ExhibitionCard
                  exhibition={exhibition}
                  coverArtwork={getExhibitionCoverArtwork(exhibition.slug)}
                />
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      <section className="page-x section-y mx-auto max-w-7xl border-t border-ink/10">
        <FadeIn delay={0.1} className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rain">Selections</p>
            <h2 className="text-3xl leading-tight sm:text-4xl">Six works that hold the V1 tone.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-rain">
            These pieces set the archive&apos;s first read: blue rooms, rain, glass, snow,
            studio clarity, and distant fable.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtworks.map((work) => (
            <FadeInStaggerItem key={work.slug}>
              <ArtworkCard artwork={work} variant="feature" />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </section>

      <section id="recipe-notes" className="bg-ink text-paper">
        <div className="page-x section-y mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <FadeIn>
            <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-cinnabar">Recipe Notes</p>
            <h2 className="text-3xl leading-tight sm:text-4xl">Small notes behind the atmosphere.</h2>
          </FadeIn>

          <FadeInStagger className="grid gap-4 sm:grid-cols-2">
            {recipeNotes.map((note) => (
              <FadeInStaggerItem key={note.slug}>
                <Link
                  href={`/works/${note.slug}`}
                  className="ink-panel block p-5 transition-colors hover:text-cinnabar"
                >
                  <p className="text-sm font-sans font-bold uppercase tracking-[0.18em] text-cinnabar">{note.title}</p>
                  <p className="mt-4 text-sm leading-7 text-paper/70">{note.content}</p>
                </Link>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      <section>
        <div className="page-x mx-auto grid max-w-7xl gap-8 border-t border-ink/10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-16">
          <FadeIn className="max-w-xl">
            <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rain">Studio Pass</p>
            <h2 className="text-3xl leading-tight sm:text-4xl">A small token for entering the archive.</h2>
            <p className="mt-6 text-base leading-8 text-ink/70">
              The pass keeps the atelier&apos;s tactile mood in view: a quiet badge, a pale strap,
              and just enough motion to make the page feel handled rather than displayed.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="ink-panel paper-grain overflow-hidden">
            <LanyardClient />
          </FadeIn>
        </div>
      </section>

      <footer id="contact" className="page-x bg-paper py-16 text-center text-ink">
        <FadeIn className="mx-auto max-w-2xl">
          <p className="mb-5 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rain">Studio Note</p>
          <p className="text-2xl leading-relaxed">
            Finding warmth in the cold, and clarity in the mist.
          </p>
          <div className="mt-10 flex justify-center gap-7 text-sm font-sans text-rain">
            <a href="mailto:hello@misty-atelier.com" className="transition-colors hover:text-cinnabar">
              Email
            </a>
            <a href="#" className="transition-colors hover:text-cinnabar">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-cinnabar">
              Twitter
            </a>
          </div>
          <p className="mt-10 text-xs font-sans text-rain">
            &copy; {new Date().getFullYear()} Misty Atelier. Built as a static V1 archive.
          </p>
        </FadeIn>
      </footer>
    </main>
  );
}
