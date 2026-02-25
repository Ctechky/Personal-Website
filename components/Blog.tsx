import React, { useState, useEffect } from 'react';
import { sanityClient, POSTS_QUERY } from '../utils/sanityClient';

const BLOG_URL = 'https://blog.kokyangchong.com';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SanityImageAsset {
    _id: string;
    url: string;
    metadata: { lqip: string; dimensions: { width: number; height: number } };
}

interface BlogPost {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    excerpt?: string;
    mainImage?: { asset: SanityImageAsset; hotspot?: object };
    categories?: { title: string }[];
    author?: { name: string };
    body?: any[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── CoverImage with blur placeholder ─────────────────────────────────────────

const CoverImage: React.FC<{ asset: SanityImageAsset; title: string; width?: number }> = ({ asset, title, width = 600 }) => {
    const [loaded, setLoaded] = useState(false);
    const full = `${asset.url}?w=${width}&auto=format`;

    return (
        <div className="blog-cover-wrapper" style={{ backgroundImage: `url(${asset.metadata.lqip})` }}>
            <img
                src={full}
                alt={title}
                className={`blog-cover-img ${loaded ? 'loaded' : ''}`}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                draggable={false}
            />
        </div>
    );
};

// ── Post Card (links to blog subdomain) ──────────────────────────────────────

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <a
        href={`${BLOG_URL}/${post.slug.current}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-card card-sheet"
    >
        {post.mainImage?.asset ? (
            <CoverImage asset={post.mainImage.asset} title={post.title} width={600} />
        ) : (
            <div className="blog-cover-placeholder">
                <span>✍️</span>
            </div>
        )}
        <div className="blog-card-body">
            <div className="blog-card-meta">
                {post.categories?.map(c => (
                    <span key={c.title} className="blog-tag">{c.title}</span>
                ))}
                <span className="blog-date">{formatDate(post.publishedAt)}</span>
            </div>
            <h3 className="blog-card-title">{post.title}</h3>
            {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}…</p>}
            <span className="blog-read-more">Read more →</span>
        </div>
    </a>
);

// ── Blog Section ──────────────────────────────────────────────────────────────

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        sanityClient.fetch(POSTS_QUERY)
            .then(data => { setPosts((data ?? []).slice(0, 3)); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="blog-loading">
            <div className="typing-indicator"><span/><span/><span/></div>
        </div>
    );

    if (error) return (
        <p className="blog-error">Couldn't load blog posts.</p>
    );

    return (
        <>
            {posts.length > 0 && (
                <div className="blog-grid">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
            <div className="blog-cta">
                <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="blog-cta-btn">
                    View all posts →
                </a>
            </div>
        </>
    );
};

export default Blog;
