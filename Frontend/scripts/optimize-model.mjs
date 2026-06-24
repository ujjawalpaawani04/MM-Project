/**
 * GLB optimizer recipe (run: `npm run optimize:model -- <input.glb> [output.glb]`).
 *
 * Drop a raw/uncompressed model anywhere, point this at it, and it produces a
 * web-ready GLB: Draco-compressed geometry + WebP textures capped at 1024px,
 * deduped and pruned. Lossy mesh simplification is intentionally OFF to keep
 * fidelity (geometry - not textures - dominates these figures).
 *
 * The original `mmModel2.glb` (89 MB) was reduced to ~5.7 MB this way and is NOT
 * committed; re-add it and re-run this to regenerate `mmModel2.opt.glb`.
 *
 * Uses the local Draco decoder already shipped in public/draco/.
 */
import { execFileSync } from "node:child_process";

const [input, output] = process.argv.slice(2);
if (!input) {
  console.error("Usage: npm run optimize:model -- <input.glb> [output.glb]");
  process.exit(1);
}
const out = output || input.replace(/\.glb$/i, ".opt.glb");

execFileSync(
  "npx",
  [
    "--yes",
    "@gltf-transform/cli@latest",
    "optimize",
    input,
    out,
    "--compress", "draco",
    "--texture-compress", "webp",
    "--texture-size", "1024",
    "--simplify", "false",
  ],
  { stdio: "inherit", shell: process.platform === "win32" }
);
