'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/experience', 'Experience'],
  ['/contact', 'Contact'],
  ['/chat', 'Chat'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="header" className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">Dilip</Link>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(([href, label]) => (
          <Link
            href={href}
            className={pathname === href ? 'active' : ''}
            onClick={() => setOpen(false)}
            key={href}
          >
            {label}
          </Link>
        ))}
      </div>
      <button
        className={`nav-menu-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
