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
          background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
          border-radius: 15px;
          padding: 30px;
          color: white;
          margin-bottom: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .title {
          font-size: 1.8em;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-badge {
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9em;
        }

        .status-badge.connected {
          background: #51cf66;
        }

        .status-badge.disconnected {
          background: rgba(255, 255, 255, 0.2);
        }

        .description {
          background: rgba(0, 0, 0, 0.15);
          border-left: 4px solid rgba(255, 255, 255, 0.5);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .content {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          padding: 25px;
        }

        .connected-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .info-label {
          font-weight: bold;
          opacity: 0.9;
        }

        .info-value {
          font-family: 'Courier New', monospace;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1em;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 25px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1em;
        }

        .btn-primary {
          background: white;
          color: #4285f4;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-danger {
          background: #ff4444;
          color: white;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .instructions {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .instructions h4 {
          margin-bottom: 15px;
          font-size: 1.1em;
        }

        .instructions ol {
          margin-left: 20px;
          line-height: 1.8;
        }

        .instructions li {
          margin-bottom: 10px;
        }

        .instructions code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .features {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .features h4 {
          margin-bottom: 15px;
          font-size: 1.1em;
        }

        .features ul {
          list-style: none;
          padding: 0;
        }

        .features li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }

        .features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          font-weight: bold;
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
