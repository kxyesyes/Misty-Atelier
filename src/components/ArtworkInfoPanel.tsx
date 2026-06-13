import Link from "next/link";
import type { Artwork } from "@/data/artworks";
import type { Exhibition } from "@/data/exhibitions";
import type { RecipeNote } from "@/data/recipeNotes";
import { getArtworkTagGroups } from "@/lib/artwork-presentation";
import { RecipeNotePanel } from "@/components/RecipeNotePanel";

export function ArtworkInfoPanel({
  artwork,
  exhibition,
  recipeNote,
}: {
  artwork: Artwork;
  exhibition?: Exhibition;
  recipeNote?: RecipeNote;
}) {
  const tagGroups = getArtworkTagGroups(artwork);

  return (
    <aside className="w-full md:p-2">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-rain font-sans font-semibold">Artwork</p>
      <h1 className="text-4xl leading-tight tracking-normal text-ink">{artwork.titleEn}</h1>
      <p className="mt-3 text-lg text-rain">{artwork.titleZh}</p>
      {artwork.caption && (
        <section className="mt-8 border-y border-ink/10 py-5">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-rain">
            Archive Caption
          </p>
          <p className="text-lg leading-8 text-ink/78">{artwork.caption}</p>
        </section>
      )}
      <p className="mt-8 max-w-md text-base leading-8 text-ink/72">
        {artwork.description}
      </p>

      {exhibition && (
        <section className="mt-10 border-t border-ink/10 pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-rain font-sans font-semibold">Exhibition</p>
          <Link
            href={`/exhibitions/${artwork.exhibition}`}
            className="block text-lg text-ink transition-colors hover:text-amber"
          >
            {exhibition.titleEn}
          </Link>
          <p className="mt-1 text-sm text-rain">{exhibition.titleZh}</p>
        </section>
      )}

      <section className="mt-8 grid gap-5 border-t border-ink/10 pt-6">
        {tagGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-rain font-sans font-semibold">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((tag) => (
                <span key={tag} className="border-b border-mist/80 px-0.5 py-1 text-xs font-sans text-rain tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {recipeNote && (
        <section className="mt-10">
          <RecipeNotePanel note={recipeNote} />
        </section>
      )}
    </aside>
  );
}
