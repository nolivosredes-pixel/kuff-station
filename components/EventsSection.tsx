"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Event } from "@/lib/types";

export default function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ photos: string[]; index: number; title: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming: Event[] = [];
      const past: Event[] = [];

      data.events.forEach((event: Event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate >= today) {
          upcoming.push(event);
        } else if (event.photos && event.photos.length > 0) {
          past.push(event);
        }
      });

      // Sort upcoming events by date (earliest first)
      upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Sort past events by date (most recent first)
      past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setLoading(false);
    } catch (err) {
      console.error("Error loading events:", err);
      setError(true);
      setLoading(false);
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

  function openLightbox(photos: string[], index: number, title: string) {
    setLightboxPhoto({ photos, index, title });
  }

  function closeLightbox() {
    setLightboxPhoto(null);
  }

  function nextPhoto() {
    if (!lightboxPhoto) return;
    setLightboxPhoto({
      ...lightboxPhoto,
      index: (lightboxPhoto.index + 1) % lightboxPhoto.photos.length
    });
  }

  function prevPhoto() {
    if (!lightboxPhoto) return;
    setLightboxPhoto({
      ...lightboxPhoto,
      index: (lightboxPhoto.index - 1 + lightboxPhoto.photos.length) % lightboxPhoto.photos.length
    });
  }

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!lightboxPhoto) return;

      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') nextPhoto();
      else if (e.key === 'ArrowLeft') prevPhoto();
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxPhoto]);

  return (
    <section id="tour" className="tour">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="title-underline"></div>
        </div>
        <div className="tour-intro">
          <p>Catch KUFF live at these upcoming shows. Get your tickets now!</p>
        </div>

        <div id="events-container" className="events-grid">
          {loading && (
            <div className="events-loading">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          )}

          {error && (
            <div className="events-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>Error Loading Events</h3>
              <p>Please try again later.</p>
            </div>
          )}

          {!loading && !error && upcomingEvents.length === 0 && (
            <div className="no-events">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <h3>No Upcoming Events</h3>
              <p>Check back soon for new tour dates!</p>
            </div>
          )}

          {upcomingEvents.map((event) => {
            const { day, month, fullDate } = formatDate(event.date);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;

            return (
              <div key={event.id} className="event-card">
                <div className="event-flyer">
                  <Image
                    src={event.flyer}
                    alt={event.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <div className="event-date-badge">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                  </div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-info">
                    <div className="event-info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{fullDate}</span>
                    </div>
                    <div className="event-info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="event-info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.venue}, {event.location}</span>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-actions">
                    <a href={`/event/${event.id}`} className="event-btn event-btn-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      View & Share
                    </a>
                    {event.ticketLink && (
                      <a href={event.ticketLink} className="event-btn event-btn-secondary" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Get Tickets
                      </a>
                    )}
                    {event.address && (
                      <a
                        href={mapsUrl}
                        className="event-btn event-btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        View Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pastEvents.length > 0 && (
          <div id="past-events-section" className="past-events-section">
            <h3 className="past-events-title">Past Events</h3>
            <div id="past-events-container" className="past-events-grid">
              {pastEvents.map((event) => {
                const { fullDate } = formatDate(event.date);

                return (
                  <div key={event.id} className="past-event-card">
                    <div className="past-event-header">
                      <h4 className="past-event-title">{event.title}</h4>
                      <div className="past-event-meta">
                        <div className="past-event-info-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{fullDate}</span>
                        </div>
                        <div className="past-event-info-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{event.venue}, {event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="past-event-gallery">
                      {event.photos.map((photo, photoIndex) => (
                        <div
                          key={photoIndex}
                          className="past-event-photo"
                          onClick={() => openLightbox(event.photos, photoIndex, event.title)}
                        >
                          <Image
                            src={photo}
                            alt={`${event.title} - Photo ${photoIndex + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                          <div className="photo-overlay">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-cyan-400 transition-colors z-10"
            onClick={closeLightbox}
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-cyan-400 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-cyan-400 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            ›
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxPhoto.photos[lightboxPhoto.index]}
              alt={`${lightboxPhoto.title} - Photo ${lightboxPhoto.index + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
              priority
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center z-10">
            <p className="text-lg font-semibold mb-2">{lightboxPhoto.title}</p>
            <p className="text-sm text-gray-300">
              {lightboxPhoto.index + 1} / {lightboxPhoto.photos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
