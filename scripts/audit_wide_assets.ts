import { existsSync } from "node:fs";
import { join } from "node:path";
import { getHomeCurationPath } from "../src/lib/curation-path";

const rows = getHomeCurationPath().flatMap((entry) =>
  entry.featuredWorks.map((work) => {
    const wideThumbnailPath = work.wideThumbnail
      ? join(process.cwd(), "public", work.wideThumbnail.replace(/^\//, ""))
      : undefined;

    return {
      exhibition: entry.exhibition.slug,
      slug: work.slug,
      orientation: work.orientation,
      wideThumbnail: work.wideThumbnail ?? "",
      status:
        work.orientation === "landscape"
          ? "native-landscape"
          : wideThumbnailPath && existsSync(wideThumbnailPath)
            ? "ready"
            : "missing-wide",
    };
  }),
);

const missing = rows.filter((row) => row.status === "missing-wide");

console.table(rows);

if (missing.length > 0) {
  console.error(`Missing wide assets: ${missing.map((row) => row.slug).join(", ")}`);
  process.exit(1);
}
