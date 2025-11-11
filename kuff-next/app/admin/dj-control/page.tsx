"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DJStreamControl from "@/components/DJStreamControl";

export default function DJControlPage() {
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
        <div className="text-cyan-500 text-xl">Loading DJ Control...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="dj-control-page">
      <style jsx>{`
        .dj-control-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000814 100%);
          position: relative;
          overflow-x: hidden;
        }

        .dj-control-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 153, 204, 0.1) 0%, transparent 50%);
          animation: bgPulse 8s ease-in-out infinite;
          z-index: 0;
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .header {
          position: relative;
          z-index: 10;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(0, 217, 255, 0.3);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-wrapper {
          filter: drop-shadow(0 0 15px rgba(0, 217, 255, 0.5));
        }

        .header-title {
          display: flex;
          flex-direction: column;
        }

        .header-title h1 {
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-title p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin: 0;
          margin-top: 2px;
        }

        .back-btn {
          background: rgba(0, 217, 255, 0.2);
          color: #00d9ff;
          padding: 10px 20px;
          border: 2px solid rgba(0, 217, 255, 0.4);
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .back-btn:hover {
          background: rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.3);
        }

        .content {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }

          .header-title h1 {
            font-size: 1.3rem;
          }

          .back-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="header">
        <div className="header-left">
          <div className="logo-wrapper">
            <Image src="/assets/images/kuff-white.png" alt="KUFF" width={50} height={50} />
          </div>
          <div className="header-title">
            <h1>DJ Control Center</h1>
            <p>Professional Live Streaming Console</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="back-btn"
        >
          ← Back to Admin
        </button>
      </div>

      <div className="content">
        <DJStreamControl />
      </div>
    </div>
  );
}
