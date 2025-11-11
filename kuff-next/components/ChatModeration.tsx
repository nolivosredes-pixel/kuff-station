'use client';

import { useEffect, useState } from 'react';
import { supabase, ChatMessage } from '@/lib/supabase';

export default function ChatModeration() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const chatEnabled = supabase !== null;

  useEffect(() => {
    if (!chatEnabled || !supabase) {
      setLoading(false);
      return;
    }

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('admin_chat_moderation')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_chat_messages',
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [chatEnabled]);

  async function loadMessages() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('live_chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setMessages(data);
    }
    setLoading(false);
  }

  async function handleDelete(messageId: string) {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this message?')) return;

    setDeleting(messageId);

    const { error } = await supabase
      .from('live_chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } else {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }

    setDeleting(null);
  }

  async function handleClearAll() {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete ALL messages? This cannot be undone!')) return;

    setLoading(true);

    const { error } = await supabase
      .from('live_chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error clearing messages:', error);
      alert('Failed to clear messages');
    } else {
      setMessages([]);
      alert('All messages deleted successfully');
    }

    setLoading(false);
  }

  if (!chatEnabled) {
    return (
      <div className="chat-moderation">
        <style jsx>{`
          .chat-moderation {
            background: rgba(26, 26, 26, 0.8);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid rgba(0, 217, 255, 0.2);
            text-align: center;
          }

          .disabled-message {
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.1rem;
          }

          .help-link {
            color: #00d9ff;
            margin-top: 15px;
            font-size: 0.95rem;
          }
        `}</style>

        <p className="disabled-message">Live chat is not configured yet.</p>
        <p className="help-link">Check SUPABASE_SETUP.md for setup instructions.</p>
      </div>
    );
  }

  return (
    <div className="chat-moderation">
      <style jsx>{`
        .chat-moderation {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1);
        }

        .moderation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .moderation-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #00d9ff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .message-count {
          background: rgba(0, 217, 255, 0.2);
          color: #00d9ff;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .clear-all-btn {
          background: #ff4444;
          color: white;
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

        .clear-all-btn:hover:not(:disabled) {
          background: #ff0000;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.4);
        }

        .clear-all-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-card {
          background: #000000;
          padding: 20px;
          border-radius: 15px;
          border: 2px solid rgba(0, 217, 255, 0.2);
          transition: all 0.3s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .message-card:hover {
          border-color: rgba(0, 217, 255, 0.5);
          box-shadow: 0 5px 20px rgba(0, 217, 255, 0.2);
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
          flex-wrap: wrap;
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
          font-size: 1.1em;
        }

        .message-username {
          font-weight: 700;
          color: #00d9ff;
          font-size: 1.1rem;
        }

        .message-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .message-text {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          word-wrap: break-word;
        }

        .message-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .delete-btn {
          background: #ff4444;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .delete-btn:hover:not(:disabled) {
          background: #ff0000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 68, 68, 0.4);
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading {
          text-align: center;
          color: #00d9ff;
          padding: 40px;
          font-size: 1.1rem;
        }

        .no-messages {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 60px 20px;
          font-size: 1.1rem;
        }

        .no-messages-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .moderation-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .message-card {
            flex-direction: column;
          }

          .message-actions {
            flex-direction: row;
            width: 100%;
          }

          .delete-btn {
            flex: 1;
          }
        }
      `}</style>

      <div className="moderation-header">
        <h2 className="moderation-title">Chat Moderation</h2>
        <div className="header-actions">
          <div className="message-count">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </div>
          <button
            onClick={handleClearAll}
            disabled={loading || messages.length === 0}
            className="clear-all-btn"
          >
            Clear All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="no-messages">
          <div className="no-messages-icon">💬</div>
          <p>No messages yet</p>
          <p style={{ fontSize: '0.9rem', marginTop: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>
            Messages from viewers will appear here
          </p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-content">
                <div className="message-header">
                  <div className="message-avatar">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
              <div className="message-actions">
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deleting === msg.id}
                  className="delete-btn"
                >
                  {deleting === msg.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
