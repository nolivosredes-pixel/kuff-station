"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Event } from "@/lib/types";
import QuickStreamControl from "@/components/QuickStreamControl";
import RTMPCredentials from "@/components/RTMPCredentials";
import GoogleDriveSetup from "@/components/GoogleDriveSetup";
import AdminStreamControl from "@/components/AdminStreamControl";
import OwncastConfig from "@/components/OwncastConfig";
import ChatModeration from "@/components/ChatModeration";
import StreamingStudio from "@/components/StreamingStudio";

type Tab = 'streaming' | 'studio' | 'events' | 'chat';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('streaming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    description: "",
    flyer: "",
    ticketLink: "",
    address: "",
    embedMap: "",
    photos: []
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      loadEvents();
    }
  }, [status, router]);

  async function loadEvents() {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events);
      setLoading(false);
    } catch (error) {
      console.error("Error loading events:", error);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = editingId ? `/api/events/${editingId}` : "/api/events";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save event");

      setMessage({
        type: "success",
        text: editingId ? "Event updated successfully" : "Event created successfully"
      });

      resetForm();
      loadEvents();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error saving event" });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");

      setMessage({ type: "success", text: "Event deleted successfully" });
      loadEvents();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error deleting event" });
    }
  }

  function handleEdit(event: Event) {
    setFormData(event);
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      venue: "",
      description: "",
      flyer: "",
      ticketLink: "",
      address: "",
      embedMap: "",
      photos: []
    });
    setEditingId(null);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const msgClass = message.type === 'success'
    ? 'bg-green-500/20 border border-green-500 text-green-500'
    : 'bg-red-500/20 border border-red-500 text-red-500';

  return (
    <div className="admin-page">
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000814 100%);
          padding: 20px;
          font-family: 'Montserrat', sans-serif;
          position: relative;
        }

        .admin-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 153, 204, 0.05) 0%, transparent 50%);
          animation: bgPulse 8s ease-in-out infinite;
          z-index: 0;
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .logo-wrapper {
          filter: drop-shadow(0 0 20px rgba(0, 217, 255, 0.5));
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 5px;
        }

        .header-text p {
          color: #b0b0b0;
          font-size: 1rem;
        }

        .logout-btn {
          background: #ff4444;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: #ff0000;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 68, 68, 0.5);
        }

        .message {
          padding: 15px 20px;
          border-radius: 15px;
          margin-bottom: 25px;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tab Navigation */
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          background: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(10px);
          padding: 10px;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
        }

        .tab-button {
          flex: 1;
          padding: 15px 30px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 15px;
          color: #b0b0b0;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .tab-button:hover {
          color: #00d9ff;
          background: rgba(0, 217, 255, 0.1);
        }

        .tab-button.active {
          background: linear-gradient(135deg, #0099cc 0%, #00d9ff 100%);
          color: white;
          border-color: rgba(0, 217, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .tab-icon {
          font-size: 1.3em;
        }

        /* Tab Content */
        .tab-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Streaming sections */
        .mb-8 {
          margin-bottom: 2rem;
        }

        /* Advanced mode details */
        details {
          margin-bottom: 2rem;
        }

        details summary {
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00d9ff;
          padding: 15px;
          background: rgba(26, 26, 26, 0.6);
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        details summary:hover {
          background: rgba(0, 217, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.2);
        }

        details[open] summary {
          margin-bottom: 1rem;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .mt-4 {
          margin-top: 1rem;
        }

        /* Event form section */
        .event-form-section {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
        }

        .event-form-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .event-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .event-form {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .form-field {
          margin-bottom: 0;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          display: block;
          margin-bottom: 8px;
          color: #b0b0b0;
          font-weight: 600;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-field input,
        .form-field textarea {
          width: 100%;
          padding: 12px 15px;
          background: #000000;
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          font-family: 'Montserrat', sans-serif;
        }

        .form-field input:focus,
        .form-field textarea:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
        }

        .form-field input::placeholder {
          color: #666;
        }

        .form-field textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-field .help-text {
          font-size: 0.85rem;
          color: #808080;
          margin-top: 5px;
          font-style: italic;
        }

        .form-field .help-text a {
          color: #00d9ff;
          text-decoration: none;
          transition: all 0.3s;
        }

        .form-field .help-text a:hover {
          text-decoration: underline;
          color: #00ffff;
        }

        .form-buttons {
          display: flex;
          gap: 15px;
          grid-column: 1 / -1;
          margin-top: 10px;
        }

        .form-buttons button {
          flex: 1;
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-submit {
          background: #00d9ff;
          color: #000000;
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .btn-submit:hover {
          background: #00ffff;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5);
        }

        .btn-cancel {
          background: transparent;
          color: #808080;
          border: 2px solid #808080;
        }

        .btn-cancel:hover {
          background: #808080;
          color: #000000;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(128, 128, 128, 0.3);
        }

        /* Events list section */
        .events-list-section {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
        }

        .events-list-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .events-grid {
          display: grid;
          gap: 20px;
        }

        .event-card {
          background: #000000;
          padding: 20px;
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s;
        }

        .event-card:hover {
          border-color: rgba(0, 217, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.2);
          transform: translateY(-2px);
        }

        .event-info {
          flex: 1;
        }

        .event-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 15px;
        }

        .event-details {
          color: #b0b0b0;
          line-height: 1.8;
        }

        .event-details p {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .event-actions {
          display: flex;
          gap: 10px;
          margin-left: 20px;
        }

        .event-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: #00d9ff;
          color: #000000;
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.3);
        }

        .btn-edit:hover {
          background: #00ffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 217, 255, 0.5);
        }

        .btn-delete {
          background: #ff4444;
          color: white;
          box-shadow: 0 5px 20px rgba(255, 68, 68, 0.3);
        }

        .btn-delete:hover {
          background: #ff0000;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 68, 68, 0.5);
        }

        .no-events {
          text-align: center;
          color: #808080;
          padding: 40px 20px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .tabs-container {
            flex-direction: column;
          }

          .tab-button {
            padding: 12px 20px;
          }

          .admin-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>

      <div className="admin-container">
        <div className="admin-header">
          <div className="header-content">
            <div className="logo-wrapper">
              <Image src="/assets/images/kuff-white.png" alt="KUFF" width={60} height={60} />
            </div>
            <div className="header-text">
              <h1>Admin Panel</h1>
              <p>KUFF Management System</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="logout-btn"
          >
            Sign Out
          </button>
        </div>

        {message.text && (
          <div className={`message ${msgClass}`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'streaming' ? 'active' : ''}`}
            onClick={() => setActiveTab('streaming')}
          >
            <span className="tab-icon">📡</span>
            Stream Control
          </button>
          <button
            className={`tab-button ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <span className="tab-icon">🎬</span>
            Streaming Studio
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span className="tab-icon">🎉</span>
            Events
          </button>
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="tab-icon">💬</span>
            Live Chat
          </button>
        </div>

        {/* Streaming Tab */}
        {activeTab === 'streaming' && (
          <div className="tab-content">
            {/* SRS/Owncast Server Config */}
            <div className="mb-8">
              <OwncastConfig />
            </div>

            {/* Quick Stream Control */}
            <div className="mb-8">
              <QuickStreamControl />
            </div>

            {/* RTMP Credentials for Production */}
            <div className="mb-8">
              <RTMPCredentials />
            </div>

            {/* Google Drive Auto-Upload */}
            <div className="mb-8">
              <GoogleDriveSetup />
            </div>
          </div>
        )}

        {/* Streaming Studio Tab */}
        {activeTab === 'studio' && (
          <div className="tab-content">
            <StreamingStudio />
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="tab-content">
            <div className="event-form-section">
              <h2>
                {editingId ? "Edit Event" : "Add New Event"}
              </h2>

              <form onSubmit={handleSubmit} className="event-form">
                <div className="form-field full-width">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>City/Country *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Miami, FL"
                  />
                </div>

                <div className="form-field">
                  <label>Venue/Club *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                    placeholder="Club Space"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label>Flyer URL (PostImages.org) *</label>
                  <input
                    type="url"
                    value={formData.flyer}
                    onChange={(e) => setFormData({ ...formData, flyer: e.target.value })}
                    required
                    placeholder="https://i.postimg.cc/..."
                  />
                  <p className="help-text">
                    Upload your image to <a href="https://postimages.org" target="_blank" rel="noopener noreferrer">PostImages.org</a> and paste the direct link here
                  </p>
                </div>

                <div className="form-field full-width">
                  <label>Tickets Link</label>
                  <input
                    type="url"
                    value={formData.ticketLink}
                    onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-field full-width">
                  <label>Full Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="34 NE 11th St, Miami, FL 33132"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Photo URLs (one per line, for past events)</label>
                  <textarea
                    value={formData.photos?.join('\n')}
                    onChange={(e) => setFormData({ ...formData, photos: e.target.value.split('\n').filter(p => p.trim()) })}
                    rows={4}
                    placeholder="https://i.postimg.cc/foto1.jpg&#10;https://i.postimg.cc/foto2.jpg"
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="btn-submit"
                  >
                    {editingId ? "Update Event" : "Create Event"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="events-list-section">
              <h2>Existing Events</h2>

              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <div className="event-details">
                        <p>📅 {new Date(event.date).toLocaleDateString()} - {event.time}</p>
                        <p>📍 {event.venue}, {event.location}</p>
                        <p>{event.description}</p>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button
                        onClick={() => handleEdit(event)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <p className="no-events">No events yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Chat Tab */}
        {activeTab === 'chat' && (
          <div className="tab-content">
            <ChatModeration />
          </div>
        )}
      </div>
    </div>
  );
}
