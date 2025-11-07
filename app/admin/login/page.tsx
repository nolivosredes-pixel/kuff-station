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
    <div className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000814 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 153, 204, 0.08) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .login-container {
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 10;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-wrapper {
          margin-bottom: 1.5rem;
          animation: logoFloat 4s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: #b0b0b0;
          font-size: 1rem;
        }

        .login-form {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid #ef4444;
          color: #ef4444;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: #b0b0b0;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: #000000;
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-input::placeholder {
          color: #666;
        }

        .submit-button {
          width: 100%;
          padding: 1rem 2rem;
          background: #00d9ff;
          color: #000000;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          background: #00ffff;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .login-footer {
          text-align: center;
          color: #666;
          margin-top: 1.5rem;
          font-size: 0.85rem;
        }

        .bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .shape {
          position: absolute;
          background: rgba(0, 217, 255, 0.03);
          border-radius: 50%;
          border: 1px solid rgba(0, 217, 255, 0.1);
        }

        .shape:nth-child(1) {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -150px;
          animation: shapeFloat 6s ease-in-out infinite;
        }

        .shape:nth-child(2) {
          width: 200px;
          height: 200px;
          bottom: -100px;
          left: -100px;
          animation: shapeFloat 8s ease-in-out infinite reverse;
        }

        @keyframes shapeFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Background shapes */}
      <div className="bg-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="logo-wrapper">
            <Image
              src="/assets/images/kuff-white.png"
              alt="KUFF"
              width={150}
              height={150}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5)) drop-shadow(0 0 40px rgba(0, 217, 255, 0.3))',
                margin: '0 auto'
              }}
            />
          </div>
          <h1 className="login-title">Panel de Administración</h1>
          <p className="login-subtitle">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
              placeholder="kuff"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="login-footer">
          KUFF DJ Management System
        </p>
      </div>
    </div>
  );
}
