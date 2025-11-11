'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase, ChatMessage } from '@/lib/supabase';

interface LiveChatProps {
  isLive: boolean;
}

export default function LiveChat({ isLive }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatEnabled = supabase !== null;

  // Load username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('kuff_chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages and subscribe to real-time updates
  useEffect(() => {
    if (!isLive || !chatEnabled || !supabase) return;

    // Fetch last 50 messages
    const fetchMessages = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (data) {
        setMessages(data.reverse());
      }
    };

    fetchMessages();

    // Subscribe to new messages
    if (!supabase) return;

    const channel = supabase
      .channel('live_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLive, chatEnabled]);

  // Handle username submission
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      alert('Username must be at least 2 characters');
      return;
    }
    if (username.trim().length > 20) {
      alert('Username must be 20 characters or less');
      return;
    }
    localStorage.setItem('kuff_chat_username', username.trim());
    setIsUsernameSet(true);
  };

  // Handle message submission
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newMessage.trim() || isSending) return;

    if (newMessage.length > 200) {
      alert('Message must be 200 characters or less');
      return;
    }

    setIsSending(true);

    const { error } = await supabase.from('live_chat_messages').insert([
      {
        username: username,
        message: newMessage.trim(),
        avatar_color: '#00d9ff', // KUFF brand color
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } else {
      setNewMessage('');
    }

    setIsSending(false);
  };

  // Don't show chat if stream is not live
  if (!isLive) {
    return null;
  }

  // Show message if Supabase is not configured
  if (!chatEnabled) {
    return (
      <div className="chat-container disabled">
        <style jsx>{`
          .chat-container.disabled {
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
        <p>Live chat is not configured yet.</p>
        <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
          Check SUPABASE_SETUP.md for setup instructions.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 600px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid rgba(0, 217, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .chat-header {
          background: linear-gradient(135deg, #0099cc 0%, #00d9ff 100%);
          padding: 15px 20px;
          font-weight: bold;
          font-size: 1.1em;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-dot {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(0, 217, 255, 0.5);
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 217, 255, 0.7);
        }

        .message {
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0099cc 0%, #00d9ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          flex-shrink: 0;
          font-size: 1.1em;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 5px;
        }

        .message-username {
          font-weight: 600;
          color: #00d9ff;
          font-size: 0.95em;
        }

        .message-time {
          font-size: 0.75em;
          color: rgba(255, 255, 255, 0.5);
        }

        .message-text {
          color: rgba(255, 255, 255, 0.9);
          word-wrap: break-word;
          line-height: 1.4;
        }

        .chat-input-container {
          padding: 20px;
          background: rgba(0, 0, 0, 0.5);
          border-top: 1px solid rgba(0, 217, 255, 0.2);
        }

        .username-form,
        .message-form {
          display: flex;
          gap: 10px;
        }

        .username-form {
          flex-direction: column;
        }

        .form-label {
          color: white;
          font-size: 0.9em;
          margin-bottom: 5px;
        }

        .chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 8px;
          padding: 12px 15px;
          color: white;
          font-size: 0.95em;
          outline: none;
          transition: all 0.3s;
        }

        .chat-input:focus {
          border-color: #00d9ff;
          background: rgba(255, 255, 255, 0.15);
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .chat-button {
          background: linear-gradient(135deg, #0099cc 0%, #00d9ff 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9em;
        }

        .chat-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
        }

        .chat-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          padding: 40px;
        }

        .change-username {
          margin-top: 10px;
          text-align: center;
        }

        .change-username-btn {
          background: none;
          border: none;
          color: #00d9ff;
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.85em;
        }

        .change-username-btn:hover {
          color: #00ffff;
        }

        @media (max-width: 768px) {
          .chat-container {
            height: 500px;
          }

          .message-avatar {
            width: 35px;
            height: 35px;
            font-size: 1em;
          }

          .chat-input {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      `}</style>

      <div className="chat-header">
        <span className="chat-dot"></span>
        Live Chat
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div>
              <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>💬</p>
              <p>No messages yet.</p>
              <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
                Be the first to say something!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <div className="message-avatar">
                {msg.username.charAt(0).toUpperCase()}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {!isUsernameSet ? (
          <form onSubmit={handleUsernameSubmit} className="username-form">
            <label className="form-label">Enter your username to chat:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username..."
                className="chat-input"
                maxLength={20}
                required
              />
              <button type="submit" className="chat-button">
                Set
              </button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleMessageSubmit} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
                maxLength={200}
                disabled={isSending}
                required
              />
              <button
                type="submit"
                className="chat-button"
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? '...' : 'Send'}
              </button>
            </form>
            <div className="change-username">
              <button
                onClick={() => {
                  setIsUsernameSet(false);
                  setUsername('');
                  localStorage.removeItem('kuff_chat_username');
                }}
                className="change-username-btn"
              >
                Change username
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
