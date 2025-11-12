"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StreamingStudio from "@/components/StreamingStudio";

export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 text-xl">Loading Studio...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="studio-page">
      <style jsx>{`
        .studio-page {
          min-height: 100vh;
          background: #0a0a0a;
          overflow: hidden;
        }

        .studio-header {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(0, 217, 255, 0.2);
          padding: 15px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo {
          filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.5));
        }

        .studio-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .back-btn {
          background: rgba(0, 217, 255, 0.2);
          color: #00d9ff;
          padding: 8px 20px;
          border: 2px solid rgba(0, 217, 255, 0.4);
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
        }

        .back-btn:hover {
          background: rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .studio-header {
            flex-direction: column;
            gap: 10px;
          }

          .studio-title {
            font-size: 1.2rem;
          }

          .back-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="studio-header">
        <div className="header-left">
          <Image src="/assets/images/kuff-white.png" alt="KUFF" width={40} height={40} className="logo" />
          <h1 className="studio-title">🎬 KUFF Streaming Studio</h1>
        </div>
        <button onClick={() => router.push('/admin')} className="back-btn">
          ← Back to Admin
        </button>
      </div>

      <StreamingStudio />
    </div>
  );
}
