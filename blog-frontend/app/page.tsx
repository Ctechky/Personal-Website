import { client, POSTS_QUERY, BlogPost } from '@/lib/sanity';
import PostsFilter from './PostsFilter';

export const revalidate = 60;

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const posts: BlogPost[] = await client.fetch(POSTS_QUERY);

  if (posts.length === 0) {
    return (
      <div className="posts-page">
        <div className="posts-intro">
          <div className="posts-intro-hero">
            <img src="/profile.jpeg" alt="Chong Kok Yang" className="posts-intro-avatar" />
            <div className="posts-intro-text">
              <span className="posts-intro-eyebrow">Writing</span>
              <h1>Chong Kok Yang</h1>
              <p className="posts-intro-tagline">I find patterns in data, pleasure in food, and beauty in good systems.</p>
            </div>
          </div>
        </div>
        <p className="posts-empty">No posts yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="posts-page">
      {/* ── Intro ── */}
      <div className="posts-intro">
        <div className="posts-intro-hero">
          <img src="/profile.jpeg" alt="Chong Kok Yang" className="posts-intro-avatar" />
          <div className="posts-intro-text">
            <span className="posts-intro-eyebrow">Writing</span>
            <h1>Chong Kok Yang</h1>
            <p className="posts-intro-tagline">I find patterns in data, pleasure in food, and beauty in good systems.</p>
          </div>
        </div>
      </div>

      {/* ── Search, filter, and posts (client component) ── */}
      <PostsFilter posts={posts} initialCat={cat} />
    </div>
  );
}

