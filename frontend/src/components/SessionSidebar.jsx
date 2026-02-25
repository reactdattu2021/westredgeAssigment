import React, { useEffect, useState } from 'react';
import { fetchSessions } from '../api/chatApi';

const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const SessionSidebar = ({ currentSessionId, onSelectSession, onNewChat }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const res = await fetchSessions();
            setSessions(res.data.sessions || []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, [currentSessionId]);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>🤖 Support AI</h2>
                <button className="new-chat-btn" onClick={onNewChat}>
                    + New Chat
                </button>
            </div>

            <div className="session-list">
                <p className="session-list-label">Recent Sessions</p>
                {loading && <p className="session-loading">Loading…</p>}
                {!loading && sessions.length === 0 && (
                    <p className="session-empty">No sessions yet.</p>
                )}
                {sessions.map((s) => (
                    <button
                        key={s._id}
                        className={`session-item ${s._id === currentSessionId ? 'active' : ''}`}
                        onClick={() => onSelectSession(s._id)}
                    >
                        <span className="session-id">
                            {s._id.slice(0, 8)}…
                        </span>
                        <span className="session-date">{formatDate(s.updatedAt)}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default SessionSidebar;
