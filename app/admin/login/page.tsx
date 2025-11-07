"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/assets/images/kuff-white.png"
            alt="KUFF"
            width={150}
            height={150}
            className="mx-auto mb-4"
            style={{ filter: 'drop-shadow(0 0 30px rgba(0, 217, 255, 0.5))' }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg border-2 border-cyan-500/20">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
              Usuario
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
              required
              disabled={loading}
              placeholder="kuff"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          KUFF DJ Management System
        </p>
      </div>
    </div>
  );
}
