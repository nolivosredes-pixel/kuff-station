'use client';

import { useState, useEffect } from 'react';

interface DriveConfig {
  connected: boolean;
  folderName: string;
  email?: string;
  autoUpload: boolean;
}

export default function GoogleDriveSetup() {
  const [config, setConfig] = useState<DriveConfig>({
    connected: false,
    folderName: 'KUFF Live Recordings',
    autoUpload: true,
  });
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    // Load from localStorage
    const saved = localStorage.getItem('googleDriveConfig');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading Drive config:', e);
      }
    }
  };

  const saveConfig = (newConfig: DriveConfig) => {
    setConfig(newConfig);
    localStorage.setItem('googleDriveConfig', JSON.stringify(newConfig));
  };

  const connectDrive = async () => {
    alert('Google Drive OAuth integration:\n\n1. You need to create a Google Cloud Project\n2. Enable Google Drive API\n3. Create OAuth 2.0 credentials\n4. Add authorized redirect URIs\n\nFor now, this is a placeholder. Check the instructions below for full setup.');
    setShowInstructions(true);
  };

  const disconnectDrive = () => {
    if (confirm('Disconnect Google Drive? Recordings will no longer auto-upload.')) {
      saveConfig({
        ...config,
        connected: false,
        email: undefined,
      });
    }
  };

  const simulateConnection = () => {
    // For demo purposes - simulate connection
    saveConfig({
      ...config,
      connected: true,
      email: 'kuff@example.com',
    });
    alert('✅ Simulación: Google Drive conectado\n\nEn producción, esto usará OAuth real de Google.');
  };

  return (
    <div className="google-drive-setup">
      <style jsx>{`
        .google-drive-setup {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          color: white;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
          font-family: 'Montserrat', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .title {
          font-size: 1.8em;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #00d9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status-badge {
          padding: 10px 25px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-badge.connected {
          background: #51cf66;
          box-shadow: 0 5px 20px rgba(81, 207, 102, 0.4);
        }

        .status-badge.disconnected {
          background: rgba(176, 176, 176, 0.2);
          color: #b0b0b0;
          border: 2px solid rgba(176, 176, 176, 0.3);
        }

        .description {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #00d9ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .description strong {
          color: #00d9ff;
        }

        .content {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          padding: 25px;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .connected-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          margin-bottom: 10px;
          border: 1px solid rgba(0, 217, 255, 0.15);
        }

        .info-label {
          font-weight: 600;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9em;
        }

        .info-value {
          font-family: 'Courier New', monospace;
          color: #00d9ff;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 10px;
          background: #000000;
          color: white;
          font-size: 1em;
          transition: all 0.3s;
          font-family: 'Montserrat', sans-serif;
        }

        .form-group input:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid rgba(0, 217, 255, 0.15);
          transition: all 0.3s;
        }

        .checkbox-group:hover {
          background: rgba(0, 217, 255, 0.05);
          border-color: rgba(0, 217, 255, 0.3);
        }

        .checkbox-group input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #00d9ff;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 25px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary {
          background: #00d9ff;
          color: #000000;
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .btn-primary:hover {
          background: #00ffff;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 217, 255, 0.5);
        }

        .btn-danger {
          background: #ff4444;
          color: white;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }

        .btn-danger:hover {
          background: #ff0000;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 68, 68, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: #00d9ff;
          border: 2px solid #00d9ff;
        }

        .btn-secondary:hover {
          background: #00d9ff;
          color: #000000;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.4);
        }

        .instructions {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-top: 20px;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .instructions h4 {
          margin-bottom: 15px;
          font-size: 1.1em;
          color: #00d9ff;
          font-weight: 700;
        }

        .instructions ol {
          margin-left: 20px;
          line-height: 1.8;
          color: #b0b0b0;
        }

        .instructions li {
          margin-bottom: 10px;
        }

        .instructions code {
          background: rgba(0, 0, 0, 0.5);
          padding: 4px 8px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          color: #00d9ff;
          border: 1px solid rgba(0, 217, 255, 0.2);
        }

        .features {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-top: 20px;
          border: 2px solid rgba(0, 217, 255, 0.1);
        }

        .features h4 {
          margin-bottom: 15px;
          font-size: 1.1em;
          color: #00d9ff;
          font-weight: 700;
        }

        .features ul {
          list-style: none;
          padding: 0;
        }

        .features li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
          color: #b0b0b0;
        }

        .features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          font-weight: bold;
          color: #00d9ff;
        }

        @media (max-width: 768px) {
          .google-drive-setup {
            padding: 20px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="header">
        <div className="title">
          <span>☁️</span>
          Google Drive Auto-Upload
        </div>
        <div className={`status-badge ${config.connected ? 'connected' : 'disconnected'}`}>
          {config.connected ? '✓ Connected' : '○ Not Connected'}
        </div>
      </div>

      <div className="description">
        <strong>📦 Auto-save your recordings:</strong><br />
        Connect your Google Drive to automatically save all recordings and streams to your cloud storage. Never lose a set!
      </div>

      <div className="content">
        {config.connected ? (
          <>
            <div className="connected-info">
              <div className="info-row">
                <span className="info-label">📧 Connected Account:</span>
                <span className="info-value">{config.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">📁 Save Folder:</span>
                <span className="info-value">{config.folderName}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Folder Name in Drive</label>
              <input
                type="text"
                value={config.folderName}
                onChange={(e) => saveConfig({ ...config, folderName: e.target.value })}
                placeholder="Folder name"
              />
            </div>

            <div
              className="checkbox-group"
              onClick={() => saveConfig({ ...config, autoUpload: !config.autoUpload })}
            >
              <input
                type="checkbox"
                checked={config.autoUpload}
                onChange={() => {}}
              />
              <label style={{ cursor: 'pointer', margin: 0 }}>
                Auto-upload recordings after each session
              </label>
            </div>

            <div className="buttons">
              <button className="btn btn-danger" onClick={disconnectDrive}>
                Disconnect Drive
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Folder Name (will be created)</label>
              <input
                type="text"
                value={config.folderName}
                onChange={(e) => saveConfig({ ...config, folderName: e.target.value })}
                placeholder="KUFF Live Recordings"
              />
            </div>

            <div
              className="checkbox-group"
              onClick={() => saveConfig({ ...config, autoUpload: !config.autoUpload })}
            >
              <input
                type="checkbox"
                checked={config.autoUpload}
                onChange={() => {}}
              />
              <label style={{ cursor: 'pointer', margin: 0 }}>
                Auto-upload recordings after each session
              </label>
            </div>

            <div className="buttons">
              <button className="btn btn-primary" onClick={connectDrive}>
                🔐 Connect Google Drive
              </button>
              <button className="btn btn-secondary" onClick={simulateConnection}>
                🧪 Simulate Connection (Demo)
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                📖 {showInstructions ? 'Hide' : 'Show'} Instructions
              </button>
            </div>
          </>
        )}
      </div>

      <div className="features">
        <h4>✨ Features when connected:</h4>
        <ul>
          <li>Auto-upload all recordings to your Drive</li>
          <li>Organized in custom folder</li>
          <li>Automatic file naming with date/time</li>
          <li>Access recordings from anywhere</li>
          <li>Share directly from Drive</li>
          <li>Never lose a set</li>
        </ul>
      </div>

      {showInstructions && (
        <div className="instructions">
          <h4>🔧 Setup Instructions:</h4>
          <ol>
            <li>
              <strong>Create Google Cloud Project:</strong><br />
              Go to <code>console.cloud.google.com</code> → Create new project
            </li>
            <li>
              <strong>Enable Google Drive API:</strong><br />
              APIs & Services → Enable APIs → Search "Google Drive API" → Enable
            </li>
            <li>
              <strong>Create OAuth Credentials:</strong><br />
              Credentials → Create Credentials → OAuth 2.0 Client ID
            </li>
            <li>
              <strong>Configure OAuth Consent Screen:</strong><br />
              Set app name, support email, add scopes: <code>drive.file</code>
            </li>
            <li>
              <strong>Add Redirect URI:</strong><br />
              <code>https://yourdomain.com/api/auth/google/callback</code>
            </li>
            <li>
              <strong>Add credentials to .env:</strong><br />
              <code>GOOGLE_CLIENT_ID=your_client_id</code><br />
              <code>GOOGLE_CLIENT_SECRET=your_client_secret</code>
            </li>
            <li>
              <strong>Click "Connect Google Drive" above</strong>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
