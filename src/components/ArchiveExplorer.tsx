"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Artwork } from "@/data/artworks";
import type { Exhibition } from "@/data/exhibitions";
import { getArchiveFacets, getArchiveResults, type ArchiveFilters } from "@/lib/archive-query";
import { getArtworkGridSpanClass } from "@/lib/image-layout";
import { ArtworkCard } from "@/components/ArtworkCard";

type FacetKey = "exhibition" | "mood" | "color" | "scene" | "orientation";

type ArchiveExplorerProps = {
  artworks: Artwork[];
  exhibitions: Exhibition[];
};

type FilterOption = {
  value: string;
  label: string;
  color?: string;
};

type FilterGroup = {
  key: FacetKey;
  options: FilterOption[];
};

const facetLabels: Record<FacetKey, string> = {
  exhibition: "Exhibition",
  mood: "Mood",
  color: "Color",
  scene: "Scene",
  orientation: "Format",
};

const initialVisibleWorks = 72;
const visibleWorksStep = 72;

function getActiveFilterCount(filters: ArchiveFilters) {
  return Object.values(filters).filter((value) => value && value !== "all").length;
}

export function ArchiveExplorer({ artworks, exhibitions }: ArchiveExplorerProps) {
  const [filters, setFilters] = useState<ArchiveFilters>({});
  const [visibleCount, setVisibleCount] = useState(initialVisibleWorks);
  const facets = useMemo(() => getArchiveFacets(artworks), [artworks]);
  const results = useMemo(() => getArchiveResults(artworks, filters), [artworks, filters]);
  const visibleResults = results.slice(0, visibleCount);
  const activeFilterCount = getActiveFilterCount(filters);

  useEffect(() => {
    setVisibleCount(initialVisibleWorks);
  }, [filters]);

  function setFilter(key: FacetKey, value?: string) {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  }

  function clearFilters() {
    setFilters({});
  }

  const filterGroups: FilterGroup[] = [
    {
      key: "orientation" as const,
      options: facets.orientations.map((value) => ({ value, label: value })),
    },
    {
      key: "exhibition" as const,
      options: exhibitions.map((exhibition) => ({
        value: exhibition.slug,
        label: exhibition.titleEn,
        color: exhibition.palette.accent,
      })),
    },
    {
      key: "mood" as const,
      options: facets.moods.map((value) => ({ value, label: value })),
    },
    {
      key: "color" as const,
      options: facets.colors.map((value) => ({ value, label: value })),
    },
    {
      key: "scene" as const,
      options: facets.scenes.map((value) => ({ value, label: value })),
    },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      <aside className="museum-glass relative z-10 px-1 py-2 lg:sticky lg:top-8">
        <div className="border-y museum-rule py-5">
          <label className="flex min-h-11 items-center gap-3 border-b border-ink/10 pb-4 font-sans text-sm text-rain">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={filters.query ?? ""}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Search titles, tags, weather..."
              className="min-w-0 flex-1 bg-transparent text-ink placeholder:text-rain"
            />
          </label>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-rain">
              {results.length} / {artworks.length} Works
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-10 items-center gap-1.5 font-sans text-xs uppercase tracking-[0.14em] text-rain transition-colors hover:text-amber"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 divide-y divide-ink/10 border-b border-ink/10">
          {filterGroups.map((group) => (
            <details
              key={group.key}
              className="group py-4"
              open={group.key === "orientation" || group.key === "exhibition"}
            >
              <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-rain">
                <span>{facetLabels[group.key]}</span>
                <span className="text-[0.66rem] tracking-normal text-rain/80">
                  {group.options.length}
                </span>
              </summary>
              <div
                className={`mt-3 flex flex-wrap gap-2 ${
                  group.options.length > 18 ? "max-h-48 overflow-y-auto pr-1" : ""
                }`}
              >
                {group.options.map((option) => {
                  const isActive = filters[group.key] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(group.key, option.value)}
                      className={`min-h-11 rounded-sm border px-2.5 py-2 font-sans text-xs leading-none tracking-wide transition-colors ${
                        isActive
                          ? "border-ink bg-ink text-paper"
                          : "border-transparent bg-transparent text-rain hover:border-amber/70 hover:text-ink"
                      }`}
                      style={option.color && !isActive ? { borderColor: `${option.color}66` } : undefined}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </aside>

      <section>
        {results.length > 0 ? (
          <>
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-ink/10 pb-4 font-sans text-xs uppercase tracking-[0.14em] text-rain">
              <p>
                Showing {visibleResults.length} of {results.length}
              </p>
              {results.length > visibleResults.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + visibleWorksStep)}
                  className="min-h-11 rounded-sm border border-ink/15 px-3 text-ink transition-colors hover:border-amber/70 hover:text-amber"
                >
                  Load more works
                </button>
              )}
            </div>
            <div className="masonry columns-1 gap-8 sm:columns-2 xl:columns-3">
              {visibleResults.map((artwork) => (
                <div key={artwork.slug} className={`mb-12 ${getArtworkGridSpanClass(artwork.orientation, "archive")}`}>
                  <ArtworkCard artwork={artwork} variant="grid" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center border-y border-ink/10 text-center">
            <div>
              <p className="text-2xl text-ink">No works in this weather.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 font-sans text-xs uppercase tracking-[0.2em] text-rain transition-colors hover:text-amber"
              >
                Reset archive
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
