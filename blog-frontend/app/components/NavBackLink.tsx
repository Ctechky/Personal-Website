'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

export default function NavBackLink() {
  const pathname = usePathname();
  const isPost = pathname !== '/';

  if (isPost) {
    return (
      <Link href="/" className="back-link">
        <Arrow /> All Posts
      </Link>
    );
  }

  return (
    <a href="https://kokyangchong.com" className="back-link">
      <Arrow /> Main Page
    </a>
  );
}
