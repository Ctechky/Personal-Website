'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor, BlogPost } from '@/lib/sanity';

const TECH_HEROES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop&q=80&auto=format',
];
function pickHero(id: string) {
  const sum = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TECH_HEROES[sum % TECH_HEROES.length];
}

const TIME_OPTIONS = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function PostCover({ post, sizes, priority }: { post: BlogPost; sizes: string; priority?: boolean }) {
  if (post.mainImage) {
    return (
      <Image
        src={urlFor(post.mainImage).width(760).height(480).fit('crop').auto('format').url()}
        alt={post.title}
        fill sizes={sizes}
        style={{ objectFit: 'cover' }}
        placeholder={post.mainImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={post.mainImage?.asset?.metadata?.lqip}
        priority={priority}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={pickHero(post._id)} alt="" aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/${post.slug.current}`} className="post-card">
      <div className="post-cover-wrapper">
        <PostCover post={post} sizes="(max-width: 600px) 100vw, 33vw" />
      </div>
      <div className="post-card-body">
        {post.categories && post.categories.length > 0 && (
          <div className="post-tags">
            {post.categories.map((c) => (
              <span key={c.title} className="post-tag">{c.title.toUpperCase()}</span>
            ))}
          </div>
        )}
        <p className="post-meta">
          {post.publishedAt && formatDate(post.publishedAt)}
          {post.author && <> &nbsp;·&nbsp; {post.author.name}</>}
        </p>
        <h2 className="post-card-title">{post.title}</h2>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        <div className="post-card-footer">
          <span className="post-read-more">Read more →</span>
        </div>
      </div>
    </Link>
  );
}

function timeStart(value: string): Date | null {
  const now = new Date();
  if (value === 'today') { const d = new Date(now); d.setHours(0,0,0,0); return d; }
  if (value === 'week')  { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
  if (value === 'month') { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d; }
  if (value === 'year')  { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
  return null;
}

/** Generic dropdown used for both Time and Category */
function FilterDropdown({
  label, value: displayLabel, open, onToggle, dropRef, children,
}: {
  label: string; value: string; open: boolean;
  onToggle: () => void; dropRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div className="posts-filter-wrap" ref={dropRef}>
      <button
        className={`posts-filter-pill${open ? ' open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        {displayLabel}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}>
          <path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="posts-filter-dropdown">
          <div className="posts-filter-dropdown-header"><span>{label}</span></div>
          {children}
        </div>
      )}
    </div>
  );
}

export default function PostsFilter({ posts, initialCat }: { posts: BlogPost[]; initialCat?: string }) {
  const [search, setSearch]         = useState('');
  const [timeVal, setTimeVal]       = useState('all');
  const [selectedCats, setSelectedCats] = useState<Set<string>>(
    () => initialCat ? new Set([initialCat]) : new Set()
  );
  const [timeOpen, setTimeOpen]     = useState(false);
  const [catOpen,  setCatOpen]      = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const catRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false);
      if (catRef.current  && !catRef.current.contains(e.target as Node))  setCatOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.categories?.forEach((c) => set.add(c.title)));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    const start = timeStart(timeVal);
    if (start) result = result.filter((p) => new Date(p.publishedAt) >= start);
    if (selectedCats.size > 0)
      result = result.filter((p) => p.categories?.some((c) => selectedCats.has(c.title)));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) ||
               p.excerpt?.toLowerCase().includes(q) ||
               p.categories?.some((c) => c.title.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, search, timeVal, selectedCats]);

  const isFiltering = search.trim() !== '' || timeVal !== 'all' || selectedCats.size > 0;
  const [featured, ...rest] = filtered;

  const timeLabelDisplay = TIME_OPTIONS.find((o) => o.value === timeVal)?.label ?? 'All time';
  const catLabelDisplay  = selectedCats.size === 0
    ? 'Category'
    : selectedCats.size === 1 ? Array.from(selectedCats)[0]
    : `${selectedCats.size} categories`;

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="posts-filter-bar">
        {/* Search */}
        <div className="posts-search-wrap">
          <svg className="posts-search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input type="search" placeholder="Search posts, topics…" value={search}
            onChange={(e) => setSearch(e.target.value)} className="posts-search" aria-label="Search posts" />
          {search && (
            <button className="posts-search-clear" onClick={() => setSearch('')} aria-label="Clear">×</button>
          )}
        </div>

        {/* Time dropdown */}
        <FilterDropdown label="Time period" value={timeLabelDisplay}
          open={timeOpen} onToggle={() => { setTimeOpen((o) => !o); setCatOpen(false); }}
          dropRef={timeRef}>
          {TIME_OPTIONS.map((opt) => (
            <button key={opt.value}
              className={`posts-filter-item${timeVal === opt.value ? ' selected' : ''}`}
              onClick={() => { setTimeVal(opt.value); setTimeOpen(false); }}
            >
              <span className="posts-radio" aria-hidden>
                {timeVal === opt.value && <span className="posts-radio-dot" />}
              </span>
              {opt.label}
            </button>
          ))}
        </FilterDropdown>

        {/* Category dropdown */}
        {categories.length > 0 && (
          <FilterDropdown label="Category" value={catLabelDisplay}
            open={catOpen} onToggle={() => { setCatOpen((o) => !o); setTimeOpen(false); }}
            dropRef={catRef}>
            <>
              {selectedCats.size > 0 && (
                <button className="posts-filter-clearall"
                  onClick={() => setSelectedCats(new Set())}>
                  Clear all
                </button>
              )}
              {categories.map((cat) => {
                const checked = selectedCats.has(cat);
                return (
                  <button key={cat}
                    className={`posts-filter-item${checked ? ' selected' : ''}`}
                    onClick={() => setSelectedCats((prev) => {
                      const next = new Set(prev);
                      next.has(cat) ? next.delete(cat) : next.add(cat);
                      return next;
                    })}
                  >
                    <span className="posts-checkbox" aria-hidden>
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {cat}
                  </button>
                );
              })}
            </>
          </FilterDropdown>
        )}
      </div>

      {/* ── Result count ── */}
      {isFiltering && (
        <p className="posts-filter-count">
          {filtered.length === 0 ? 'No posts match' : `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`}
          {selectedCats.size > 0 && ` in ${Array.from(selectedCats).join(', ')}`}
        </p>
      )}

      {filtered.length === 0 && <p className="posts-empty">Try a different keyword or filter.</p>}

      {/* Filtering: flat grid */}
      {isFiltering && filtered.length > 0 && (
        <div className="posts-grid">
          {filtered.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}

      {/* Normal layout */}
      {!isFiltering && featured && (
        <>
          <Link href={`/${featured.slug.current}`} className="post-featured">
            <div className="post-featured-image">
              <PostCover post={featured} sizes="(max-width: 768px) 100vw, 50vw" priority />
            </div>
            <div className="post-featured-body">
              <div>
                <span className="post-featured-label">FEATURED</span>
                {featured.categories && featured.categories.length > 0 && (
                  <div className="post-tags" style={{ marginTop: '0.75rem' }}>
                    {featured.categories.map((c) => (
                      <span key={c.title} className="post-tag">{c.title.toUpperCase()}</span>
                    ))}
                  </div>
                )}
              </div>
              <h2 className="post-featured-title">{featured.title}</h2>
              {featured.excerpt && <p className="post-featured-excerpt">{featured.excerpt}</p>}
              <div className="post-featured-meta">
                {featured.publishedAt && <span>{formatDate(featured.publishedAt)}</span>}
                {featured.author && <span>&nbsp;·&nbsp; {featured.author.name}</span>}
              </div>
              <span className="post-featured-read">Read article →</span>
            </div>
          </Link>

          {rest.length > 0 && (
            <>
              <div className="posts-section-header"><h2>More Posts</h2></div>
              <div className="posts-grid">
                {rest.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
