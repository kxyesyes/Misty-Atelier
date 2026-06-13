import type { RecipeNote } from "@/data/recipeNotes";

const groups = [
  ["Palette", "palette"],
  ["Composition", "composition"],
  ["Atmosphere", "atmosphere"],
] as const;

export function RecipeNotePanel({ note }: { note: RecipeNote }) {
  return (
    <section className="museum-glass p-5">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-rain">
        Recipe Note
      </p>
      <h2 className="text-lg text-ink">{note.title}</h2>
      <p className="mt-3 text-sm leading-7 text-ink/70">{note.content}</p>
      <div className="mt-5 grid gap-4">
        {groups.map(([label, key]) => (
          <div key={key}>
            <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.2em] text-rain">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {note[key].map((item) => (
                <span
                  key={item}
                  className="border-b border-mist px-0.5 py-1 font-sans text-xs text-rain"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-amber/70 pl-4 text-sm leading-7 text-ink/70">
        {note.direction}
      </p>
    </section>
  );
}
