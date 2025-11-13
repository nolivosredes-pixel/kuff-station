"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check streaming status
  useEffect(() => {
    const checkStreamingStatus = async () => {
      try {
        const response = await fetch('/api/streaming/status');
        const data = await response.json();
        setIsLive(data.isLive);
      } catch (error) {
        console.error('Error fetching streaming status:', error);
      }
    };

    checkStreamingStatus();
    const interval = setInterval(checkStreamingStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    closeMenu();

    if (isHomePage) {
      // If on homepage, smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container">
        <Link href="/" className="nav-logo">
          <Image
            src="/assets/images/kuff-white.png"
            alt="KUFF Logo"
            className="logo"
            width={40}
            height={40}
          />
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`} id="nav-menu">
          <li>
            <a href="/#home" className="nav-link" onClick={(e) => handleNavClick(e, 'home')}>
              Home
            </a>
          </li>
          <li>
            <a href="/#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>
              About
            </a>
          </li>
          <li>
            <a href="/#gallery" className="nav-link" onClick={(e) => handleNavClick(e, 'gallery')}>
              Gallery
            </a>
          </li>
          <li>
            <Link href="/visual" className="nav-link" onClick={closeMenu}>
              Video
            </Link>
          </li>
          <li>
            <a href="/#music-hub" className="nav-link" onClick={(e) => handleNavClick(e, 'music-hub')}>
              Music
            </a>
          </li>
          <li>
            <Link href="/live" className="nav-link" onClick={closeMenu}>
              Live {isLive && <span className="live-badge">🔴</span>}
            </Link>
          </li>
          <li>
            <a href="/#tour" className="nav-link" onClick={(e) => handleNavClick(e, 'tour')}>
              Events
            </a>
          </li>
          <li>
            <a href="/#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>
              Contact
            </a>
          </li>
        </ul>
        <div
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          id="hamburger"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
