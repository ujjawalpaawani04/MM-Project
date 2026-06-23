/**
 * Per-page SEO.
 *
 * React 19 automatically hoists <title>, <meta> and <link> rendered anywhere in
 * the tree up into <head> — so a route only has to render <Seo .../> near the
 * top of its page. No react-helmet, no effects, no extra dependency.
 *
 *   <Seo title="Shop" description="Browse all handcrafted miniatures." />
 *
 * `title` is suffixed with the brand. Pass an absolute `image`/`url` for richer
 * social cards on key pages (products, collections).
 */
const SITE_NAME = "MohanMaya";
const DEFAULT_DESCRIPTION =
  "Handcrafted devotional miniature art inspired by devotion and tradition. Every piece tells a story.";

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  noindex = false,
}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Handcrafted Devotional Miniature Art`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
