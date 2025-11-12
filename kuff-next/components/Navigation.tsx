"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

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

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container">
        <div className="nav-logo">
          <Image
            src="/assets/images/kuff-white.png"
            alt="KUFF Logo"
            className="logo"
            width={40}
            height={40}
          />
        </div>
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`} id="nav-menu">
          <li>
            <Link href="#home" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="#about" className="nav-link" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="#gallery" className="nav-link" onClick={closeMenu}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/visual" className="nav-link" onClick={closeMenu}>
              VJ Mix ✨
            </Link>
          </li>
          <li>
            <Link href="#music-hub" className="nav-link" onClick={closeMenu}>
              Music
            </Link>
          </li>
          <li>
            <Link href="/live" className="nav-link" onClick={closeMenu}>
              Live {isLive && <span className="live-badge">🔴</span>}
            </Link>
          </li>
          <li>
            <Link href="#tour" className="nav-link" onClick={closeMenu}>
              Events
            </Link>
          </li>
          <li>
            <Link href="#contact" className="nav-link" onClick={closeMenu}>
              Contact
            </Link>
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
