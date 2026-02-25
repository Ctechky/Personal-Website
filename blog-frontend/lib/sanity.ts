import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: 'i4e36otz',
  dataset: 'production',
  apiVersion: '2026-02-25',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

/** Build optimised Sanity CDN URLs — e.g. urlFor(ref).width(800).url() */
export function urlFor(source: any) {
  return builder.image(source);
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: {
    asset: {
      _id: string;
      url: string;
      metadata: { lqip: string; dimensions: { width: number; height: number } };
    };
  };
  categories?: { title: string }[];
  author?: { name: string; image?: any; bio?: any[] };
  body?: any[];
}

export interface RecentPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: { asset: { _id: string; url: string; metadata: { lqip: string } } };
  categories?: { title: string }[];
}

export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": coalesce(excerpt, pt::text(body)[0..220]),
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  categories[]->{ title },
  author->{ name }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  categories[]->{ title },
  author->{ name, image, bio },
  body[] { ..., _type == "image" => { ..., asset-> } }
}`;

export const RECENT_POSTS_QUERY = `*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0..4] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": coalesce(excerpt, pt::text(body)[0..120]),
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  categories[]->{ title }
}`;

export const RELATED_POSTS_QUERY = `*[_type == "post" && slug.current != $slug && count((categories[]->title)[@ in $cats]) > 0] | order(publishedAt desc) [0..3] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": coalesce(excerpt, pt::text(body)[0..120]),
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  categories[]->{ title }
}`;
