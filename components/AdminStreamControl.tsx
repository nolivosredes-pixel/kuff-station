'use client';

import { useEffect, useState, useRef } from 'react';

interface Source {
  id: string;
  type: 'camera' | 'screen';
  name: string;
  visible: boolean;
  stream?: MediaStream;
}

export default function AdminStreamControl() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopAllStreams = () => {
    sources.forEach(source => {
      if (source.stream) {
        source.stream.getTracks().forEach(track => track.stop());
      }
    });
  };

  const addCameraSource = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      const sourceId = `camera-${Date.now()}`;
      const newSource: Source = {
        id: sourceId,
        type: 'camera',
        name: 'Camera',
        visible: true,
        stream,
      };

      setSources(prev => [...prev, newSource]);

      // Set video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }

      // Setup audio visualization
      setupAudioVisualization(stream);

      alert('✅ Camera added! Preview active.');
    } catch (error: any) {
      console.error('Error adding camera:', error);
      alert('❌ Error accessing camera: ' + error.message);
    }
  };

  const addScreenSource = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: true
      });

      const sourceId = `screen-${Date.now()}`;
      const newSource: Source = {
        id: sourceId,
        type: 'screen',
        name: 'Screen Share',
        visible: true,
        stream,
      };

      setSources(prev => [...prev, newSource]);

      // Set video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }

      // Setup audio visualization if available
      setupAudioVisualization(stream);

      alert('✅ Screen share added! Preview active.');
    } catch (error: any) {
      console.error('Error adding screen:', error);
      alert('❌ Error sharing screen: ' + error.message);
    }
  };

  const setupAudioVisualization = (stream: MediaStream) => {
    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.log('No audio tracks available');
        return;
      }

      // Close previous audio context if exists
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      visualizeAudio();
    } catch (error) {
      console.error('Error setting up audio visualization:', error);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current || !audioCanvasRef.current) return;

    const canvas = audioCanvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Cyan gradient
        const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#00d9ff');

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const removeSource = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (source?.stream) {
      source.stream.getTracks().forEach(track => track.stop());
    }

    setSources(prev => prev.filter(s => s.id !== sourceId));

    // Clear video if no sources left
    if (sources.length === 1 && videoRef.current) {
      videoRef.current.srcObject = null;
    }

    alert('✅ Source eliminada');
  };

  const goLive = () => {
    if (sources.length === 0) {
      alert('⚠️ Agrega al menos una fuente (cámara o pantalla) antes de ir en vivo');
      return;
    }

    setIsStreaming(true);
    alert('✅ Simulación: LIVE activado!\n\nEn producción, esto enviaría el stream al servidor RTMP.');
  };

  const stopStream = () => {
    setIsStreaming(false);
    stopAllStreams();
    setSources([]);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    alert('✅ Stream detenido');
  };

  return (
    <div className="admin-stream-control">
      <style jsx>{`
        .admin-stream-control {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          color: white;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
          font-family: 'Montserrat', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .title {
          font-size: 1.8em;
          font-weight: 700;
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

        .status-badge.live {
          background: #ff0000;
          animation: livePulse 2s infinite;
          box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6);
        }

        .status-badge.offline {
          background: rgba(176, 176, 176, 0.2);
          color: #b0b0b0;
          border: 2px solid rgba(176, 176, 176, 0.3);
        }

        @keyframes livePulse {
          0%, 100% {
            box-shadow: 0 5px 25px rgba(255, 0, 0, 0.6);
          }
          50% {
            box-shadow: 0 8px 35px rgba(255, 0, 0, 0.8);
          }
        }

        .preview-section {
          margin-bottom: 25px;
        }

        .preview-label {
          font-size: 1em;
          font-weight: 600;
          color: #00d9ff;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .video-preview {
          width: 100%;
          height: 400px;
          max-height: 500px;
          background: #000;
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          overflow: hidden;
        }

        .video-preview video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
        }

        .no-preview {
          width: 100%;
          height: 300px;
          background: #000;
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 1.2em;
        }

        .audio-visualization {
          width: 100%;
          height: 120px;
          background: #000;
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          margin-top: 15px;
        }

        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9em;
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

        .sources-list {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          border: 2px solid rgba(0, 217, 255, 0.15);
        }

        .sources-list h3 {
          color: #00d9ff;
          margin-bottom: 15px;
          font-size: 1.1em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          margin-bottom: 10px;
          border: 1px solid rgba(0, 217, 255, 0.15);
        }

        .source-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .source-icon {
          font-size: 1.5em;
        }

        .source-name {
          font-weight: 600;
          color: #fff;
        }

        .source-type {
          font-size: 0.85em;
          color: #808080;
        }

        .btn-remove {
          padding: 6px 15px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.85em;
          font-weight: 700;
          transition: all 0.3s;
        }

        .btn-remove:hover {
          background: #ff0000;
          transform: scale(1.05);
        }

        .info-box {
          background: rgba(0, 217, 255, 0.1);
          border-left: 4px solid #00d9ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .info-box p {
          color: #b0b0b0;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <div className="header">
        <div className="title">Live Streaming Control</div>
        <div className={`status-badge ${isStreaming ? 'live' : 'offline'}`}>
          {isStreaming ? '🔴 LIVE' : '⚫ OFFLINE'}
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>📹 Live Streaming System with Live Preview</strong><br />
          Add your camera or share your screen to see the preview. Audio visualization shows real-time levels.
        </p>
      </div>

      <div className="preview-section">
        <div className="preview-label">🎥 Video Preview</div>
        {sources.length > 0 ? (
          <div className="video-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ backgroundColor: '#000' }}
            />
          </div>
        ) : (
          <div className="no-preview">
            Add a source to see the preview
          </div>
        )}

        <div className="preview-label" style={{ marginTop: '20px' }}>🎵 Audio Visualization</div>
        <canvas ref={audioCanvasRef} className="audio-visualization" width="800" height="120" />
      </div>

      <div className="controls">
        <button className="btn btn-secondary" onClick={addCameraSource} disabled={isStreaming}>
          📷 Add Camera
        </button>
        <button className="btn btn-secondary" onClick={addScreenSource} disabled={isStreaming}>
          🖥️ Add Screen
        </button>
      </div>

      {sources.length > 0 && (
        <div className="sources-list">
          <h3>📋 Active Sources</h3>
          {sources.map(source => (
            <div key={source.id} className="source-item">
              <div className="source-info">
                <span className="source-icon">
                  {source.type === 'camera' ? '📷' : '🖥️'}
                </span>
                <div>
                  <div className="source-name">{source.name}</div>
                  <div className="source-type">{source.type}</div>
                </div>
              </div>
              <button
                className="btn-remove"
                onClick={() => removeSource(source.id)}
                disabled={isStreaming}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="controls">
        {!isStreaming ? (
          <button className="btn btn-primary" onClick={goLive}>
            ▶️ Go Live
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopStream}>
            ⏹️ Stop Stream
          </button>
        )}
      </div>
    </div>
  );
}
