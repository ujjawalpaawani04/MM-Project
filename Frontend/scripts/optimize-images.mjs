/**
 * In-place raster image optimizer (run: `npm run optimize:images`).
 *
 * Walks the asset folders, downscales anything larger than a sensible display
 * cap, and re-encodes with modern compression. Optimizing IN PLACE (same path,
 * same format) means every existing import/`src` keeps working untouched - the
 * originals stay recoverable via git.
 *
 *   • Logos/badges (small display slot) ........ max 320px,  PNG palette quantized
 *   • Photographic JPEG/PNG ..................... max 1920px, mozjpeg / quantized PNG
 *
 * Idempotent: re-encoded files are smaller, so re-running barely changes them.
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const ROOTS = ["src/assets/website", "public/website"];
const RASTER = new Set([".png", ".jpg", ".jpeg"]);

// Small display slots - keep these tiny.
const SMALL = /logo/i;
const MAX_DEFAULT = 1920;
const MAX_SMALL = 320;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // folder may not exist
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (RASTER.has(extname(e.name).toLowerCase())) yield p;
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function optimize(path) {
  const before = (await stat(path)).size;
  const ext = extname(path).toLowerCase();
  const isSmall = SMALL.test(basename(path));
  const cap = isSmall ? MAX_SMALL : MAX_DEFAULT;

  const img = sharp(path, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  if (meta.width > cap || meta.height > cap) {
    img.resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true });
  }

  if (ext === ".png") {
    img.png({ compressionLevel: 9, palette: true, quality: 82, effort: 8 });
  } else {
    img.jpeg({ quality: 78, mozjpeg: true });
  }

  const tmp = `${path}.tmp`;
  await img.toFile(tmp);
  const after = (await stat(tmp)).size;

  // Only adopt the optimized file when it's actually smaller.
  if (after < before) {
    await rename(tmp, path);
    console.log(`✓ ${path}  ${kb(before)} → ${kb(after)}  (-${Math.round((1 - after / before) * 100)}%)`);
    return before - after;
  }
  await unlink(tmp);
  console.log(`· ${path}  already optimal (${kb(before)})`);
  return 0;
}

let saved = 0;
for (const root of ROOTS) {
  for await (const p of walk(root)) saved += await optimize(p);
}
console.log(`\nTotal saved: ${kb(saved)}`);
