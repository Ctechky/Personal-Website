import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { client, POST_BY_SLUG_QUERY, RECENT_POSTS_QUERY, RELATED_POSTS_QUERY, urlFor, BlogPost, RecentPost } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BackButton from '@/app/components/BackButton';

// ── Tech background pool — picked deterministically from post._id ──
const TECH_HEROES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&h=600&fit=crop&q=80&auto=format', // dark laptop / code
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&h=600&fit=crop&q=80&auto=format', // code on dark monitor
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=600&fit=crop&q=80&auto=format', // circuit board
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=600&fit=crop&q=80&auto=format', // dark code screen
  'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400&h=600&fit=crop&q=80&auto=format', // developer at laptop
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&h=600&fit=crop&q=80&auto=format', // matrix / terminal green
];
function pickHero(id: string): string {
  const sum = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TECH_HEROES[sum % TECH_HEROES.length];
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
}

interface TocItem { id: string; text: string; level: 2 | 3; }

function extractToc(body: any[]): TocItem[] {
  if (!body) return [];
  return body
    .filter((b) => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => ({
      id: slugify(b.children?.map((c: any) => c.text).join('') ?? ''),
      text: b.children?.map((c: any) => c.text).join('') ?? '',
      level: b.style === 'h2' ? 2 : 3,
    }));
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      const src = value?.asset?.url;
      if (!src) return null;
      return (
        <figure>
          <img src={src} alt={value.alt || ''} loading="lazy" />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }: any) => (
      <div className="code-block-wrapper">
        {value.language && <div className="code-lang">{value.language}</div>}
        <SyntaxHighlighter
          language={value.language || 'text'}
          style={oneDark}
          showLineNumbers
          customStyle={{ margin: 0, borderRadius: '0 0 8px 8px', fontSize: '0.87em' }}
        >
          {value.code || ''}
        </SyntaxHighlighter>
      </div>
    ),
  },
  block: {
    h1: ({ children, value }: any) => {
      const text = value?.children?.map((c: any) => c.text).join('') ?? '';
      return <h1 id={slugify(text)}>{children}</h1>;
    },
    h2: ({ children, value }: any) => {
      const text = value?.children?.map((c: any) => c.text).join('') ?? '';
      return <h2 id={slugify(text)}>{children}</h2>;
    },
    h3: ({ children, value }: any) => {
      const text = value?.children?.map((c: any) => c.text).join('') ?? '';
      return <h3 id={slugify(text)}>{children}</h3>;
    },
    blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
    normal: ({ children }: any) => <p>{children}</p>,
  },
  marks: {
    link: ({ value, children }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="body-link">
        {children}
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',marginLeft:'2px',verticalAlign:'middle',opacity:.7}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    ),
    code: ({ children }: any) => <code className="inline-code">{children}</code>,
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    highlight: ({ children }: any) => <mark className="body-highlight">{children}</mark>,
  },
  list: {
    bullet: ({ children }: any) => <ul>{children}</ul>,
    number: ({ children }: any) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

export async function generateStaticParams() {
  const posts: any[] = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 60;

function formatDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function SidebarPostCard({ post }: { post: RecentPost }) {
  const imgSrc = post.mainImage?.asset?.url
    ? `${post.mainImage.asset.url}?w=120&h=80&fit=crop&auto=format`
    : pickHero(post._id);
  return (
    <Link href={`/${post.slug.current}`} className="sidebar-post-card">
      <div className="sidebar-post-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={post.title} loading="lazy" />
      </div>
      <div className="sidebar-post-info">
        {post.categories?.[0] && (
          <span className="sidebar-post-tag">{post.categories[0].title}</span>
        )}
        <span className="sidebar-post-title">{post.title}</span>
        <span className="sidebar-post-date">{formatDate(post.publishedAt)}</span>
      </div>
    </Link>
  );
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, recent]: [BlogPost | null, RecentPost[]] = await Promise.all([
    client.fetch(POST_BY_SLUG_QUERY, { slug }),
    client.fetch(RECENT_POSTS_QUERY, { slug }),
  ]);
  if (!post) notFound();

  const postCats = post.categories?.map((c) => c.title) ?? [];
  const related: RecentPost[] = postCats.length
    ? await client.fetch(RELATED_POSTS_QUERY, { slug, cats: postCats })
    : [];
  const recentFiltered = recent.filter((r) => !related.some((rel) => rel._id === r._id)).slice(0, 4);

  const toc = extractToc(post.body ?? []);

  return (
    <>
      {/* ── Hero ── */}
      <div className="post-hero-section">
        {post.mainImage ? (
          <Image
            src={urlFor(post.mainImage).width(1400).height(600).fit('crop').auto('format').url()}
            alt={(post.mainImage as any)?.alt || post.title}
            fill sizes="100vw"
            style={{ objectFit: 'cover' }}
            placeholder={post.mainImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={post.mainImage?.asset?.metadata?.lqip}
            priority
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pickHero(post._id)} alt="" aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        <div className="post-hero-overlay" />
        <div className="post-hero-header">
          {post.categories && post.categories.length > 0 && (
            <div className="post-header-tags">
              {post.categories.map((c) => (
                <Link key={c.title} href={`/?cat=${encodeURIComponent(c.title)}`}
                  className="post-header-tag">
                  {c.title.toUpperCase()}
                </Link>
              ))}
            </div>
          )}
          <h1 className="post-header-title">{post.title}</h1>
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div className="post-layout">

        {/* LEFT — Table of Contents */}
        <aside className="post-toc-col">
          {toc.length > 0 && (
            <div className="post-toc">
              <p className="toc-label">On this page</p>
              <nav className="toc-nav">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`}
                    className={`toc-link toc-level-${item.level}`}>
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* CENTER — Article */}
        <article className="post-content-col">
          <div className="post-back-row">
            <BackButton className="post-back" />
          </div>

          <div className="post-meta-row">
            {post.author && (
              <span className="post-author-pill">
                {post.author.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(post.author.image).width(40).height(40).fit('crop').url()}
                    alt={post.author.name} className="post-author-avatar" />
                )}
                <span className="post-author-name">{post.author.name}</span>
              </span>
            )}
            {post.author && post.publishedAt && <span className="post-meta-sep">·</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          </div>

          {post.body && (
            <div className="post-body">
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          <div className="post-footer-nav">
            <BackButton className="post-footer-back" />
          </div>
        </article>

        {/* RIGHT — Related (same category first) then Recent */}
        <aside className="post-sidebar-col">
          {related.length > 0 && (
            <div className="sidebar-widget">
              <div className="sidebar-section-label">Related Posts</div>
              {related.map((p) => <SidebarPostCard key={p._id} post={p} />)}
            </div>
          )}
          {recentFiltered.length > 0 && (
            <div className="sidebar-widget">
              <div className="sidebar-section-label">Recent Posts</div>
              {recentFiltered.map((p) => <SidebarPostCard key={p._id} post={p} />)}
            </div>
          )}
        </aside>

      </div>
    </>
  );
}
