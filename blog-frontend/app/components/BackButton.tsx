'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

interface BackButtonProps {
  className?: string;
  /** If provided, renders as a Link to this href instead of router.back() */
  href?: string;
  label?: string;
}

export default function BackButton({ className, href, label = 'Back' }: BackButtonProps) {
  const router = useRouter();
  if (href) {
    return (
      <Link href={href} className={className ?? 'post-back'}>
        <Arrow /> {label}
      </Link>
    );
  }
  return (
    <button onClick={() => router.back()} className={className ?? 'post-back'}>
      <Arrow /> {label}
    </button>
  );
}
