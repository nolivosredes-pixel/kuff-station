"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Event } from "@/lib/types";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  async function loadEvent() {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        router.push("/");
        return;
      }
      const data = await response.json();
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading event:", error);
      router.push("/");
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  }

  function shareOnWhatsApp() {
    if (!event) return;
    const url = window.location.href;
    const text = `🎉 ${event.title} - ${event.venue}, ${event.location}\n📅 ${formatDate(event.date).fullDate}\n⏰ ${event.time}\n\n${event.description}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  }

  function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  function shareOnTwitter() {
    if (!event) return;
    const url = window.location.href;
    const text = `🎉 ${event.title} at ${event.venue}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#00d9ff', fontSize: '1.25rem' }}>Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const { day, month, fullDate } = formatDate(event.date);
  const mapsUrl = event.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}` : null;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Navigation */}
      <nav className="navbar scrolled">
        <div className="container">
          <div className="nav-logo">
            <a href="/">
              <Image
                src="/assets/images/kuff-white.png"
                alt="KUFF Logo"
                className="logo"
                width={40}
                height={40}
              />
            </a>
          </div>
          <a href="/" style={{ color: '#00d9ff', textDecoration: 'none', transition: 'color 0.3s' }}>
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Event Content */}
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Event Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.3)', borderRadius: '9999px', padding: '0.5rem 1.5rem' }}>
              <span style={{ color: '#00d9ff', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '0.5rem' }}>{day}</span>
              <span style={{ color: '#00d9ff', fontWeight: '600' }}>{month}</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {event.title}
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
              {event.venue}, {event.location}
            </p>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>
              {fullDate} • {event.time}
            </p>
          </div>

          {/* Event Flyer */}
          <div style={{ marginBottom: '3rem', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '2px solid rgba(0, 217, 255, 0.2)' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
              <Image
                src={event.flyer}
                alt={event.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Event Description */}
          <div style={{ background: '#111827', borderRadius: '0.5rem', padding: '2rem', border: '1px solid rgba(0, 217, 255, 0.2)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d9ff', marginBottom: '1rem' }}>Event Details</h2>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Share Buttons */}
          <div style={{ background: '#111827', borderRadius: '0.5rem', padding: '2rem', border: '1px solid rgba(0, 217, 255, 0.2)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d9ff', marginBottom: '1.5rem', textAlign: 'center' }}>Share This Event</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <button
                onClick={shareOnWhatsApp}
                className="event-btn event-btn-primary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: '#16a34a', color: '#fff', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
              >
                <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>

              <button
                onClick={shareOnFacebook}
                className="event-btn event-btn-primary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: '#fff', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
              >
                <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

              <button
                onClick={shareOnTwitter}
                className="event-btn event-btn-primary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: '#0ea5e9', color: '#fff', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
              >
                <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>

              <button
                onClick={copyLink}
                className="event-btn event-btn-primary"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: '#0891b2', color: '#fff', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
              >
                <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {event.ticketLink && (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="event-btn event-btn-primary"
                style={{ flex: 1, background: '#00d9ff', color: '#000', fontWeight: 'bold', textAlign: 'center', padding: '1rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.5rem', height: '1.5rem' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Get Tickets
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-btn event-btn-secondary"
                style={{ flex: 1, background: '#1f2937', border: '2px solid #00d9ff', color: '#00d9ff', fontWeight: 'bold', textAlign: 'center', padding: '1rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.5rem', height: '1.5rem' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                View Map
              </a>
            )}
          </div>

          {/* Address */}
          {event.address && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {event.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
