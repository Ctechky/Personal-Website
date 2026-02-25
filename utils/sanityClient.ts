import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: 'i4e36otz',
    dataset: 'production',
    apiVersion: '2026-02-25',
    useCdn: true, // use CDN for faster reads in production
});

/** Build a Sanity image URL with optional width parameter. */
export const sanityImageUrl = (ref: string, width = 800): string => {
    // ref format: image-<hash>-<WxH>-<ext>
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/i4e36otz/production/${id}-${dimensions}.${format}?w=${width}&auto=format`;
};

// ── GROQ queries ──────────────────────────────────────────────────────────────

export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": pt::text(body)[0..220],
  mainImage {
    asset->{ _id, url, metadata { lqip, dimensions } },
    hotspot
  },
  categories[]->{ title },
  "author": author->{ name }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage {
    asset->{ _id, url, metadata { lqip, dimensions } },
    hotspot
  },
  categories[]->{ title },
  "author": author->{ name },
  body
}`;
