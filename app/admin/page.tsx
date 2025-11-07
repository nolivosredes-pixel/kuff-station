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

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
        text: editingId ? "Evento actualizado exitosamente" : "Evento creado exitosamente"
      });

      resetForm();
      loadEvents();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar el evento" });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");

      setMessage({ type: "success", text: "Evento eliminado exitosamente" });
      loadEvents();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar el evento" });
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
        <div className="text-cyan-500 text-xl">Cargando...</div>
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
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image src="/assets/images/kuff-white.png" alt="KUFF" width={60} height={60} />
            <div>
              <h1 className="text-3xl font-bold text-cyan-500">Panel de Administración</h1>
              <p className="text-gray-400">Gestión de Eventos KUFF</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${msgClass}`}>
            {message.text}
          </div>
        )}

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

        {/* Advanced Streaming Control (Own Stream with OBS) */}
        <details className="mb-8">
          <summary className="cursor-pointer text-xl font-bold text-cyan-500 mb-4 hover:text-cyan-400 transition-colors">
            🎬 Advanced Mode: Own Stream with OBS (Click to expand)
          </summary>
          <div className="mt-4">
            <AdminStreamControl />
          </div>
        </details>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-cyan-500/20 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-500">
            {editingId ? "Editar Evento" : "Agregar Nuevo Evento"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Título del Evento *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Fecha *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Hora *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ciudad/País *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
                placeholder="Miami, FL"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Venue/Club *</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
                placeholder="Club Space"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                rows={3}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">URL del Flyer (PostImages.org) *</label>
              <input
                type="url"
                value={formData.flyer}
                onChange={(e) => setFormData({ ...formData, flyer: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                required
                placeholder="https://i.postimg.cc/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Sube tu imagen en <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">PostImages.org</a> y pega el enlace directo aquí
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Link de Boletos</label>
              <input
                type="url"
                value={formData.ticketLink}
                onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Dirección Completa</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                placeholder="34 NE 11th St, Miami, FL 33132"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">URLs de Fotos (una por línea, para eventos pasados)</label>
              <textarea
                value={formData.photos?.join('\n')}
                onChange={(e) => setFormData({ ...formData, photos: e.target.value.split('\n').filter(p => p.trim()) })}
                className="w-full px-4 py-2 bg-black border-2 border-cyan-500/30 rounded text-white focus:border-cyan-500 outline-none"
                rows={4}
                placeholder="https://i.postimg.cc/foto1.jpg&#10;https://i.postimg.cc/foto2.jpg"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg transition-all"
              >
                {editingId ? "Actualizar Evento" : "Crear Evento"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-cyan-500/20">
          <h2 className="text-2xl font-bold mb-6 text-cyan-500">Eventos Existentes</h2>

          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-black p-4 rounded-lg border border-cyan-500/20 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <div className="text-gray-400 space-y-1">
                    <p>📅 {new Date(event.date).toLocaleDateString()} - {event.time}</p>
                    <p>📍 {event.venue}, {event.location}</p>
                    <p className="text-sm">{event.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay eventos todavía</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
