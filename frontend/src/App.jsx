import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatScreen from './components/ChatScreen';
import SessionSidebar from './components/SessionSidebar';
import './index.css';

const SESSION_KEY = 'support_session_id';

const getOrCreateSession = () => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = uuidv4();
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
};

const App = () => {
    const [sessionId, setSessionId] = useState(getOrCreateSession);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        localStorage.setItem(SESSION_KEY, sessionId);
    }, [sessionId]);

    const handleNewChat = () => {
        const id = uuidv4();
        localStorage.setItem(SESSION_KEY, id);
        setSessionId(id);
    };

    const handleSelectSession = (id) => {
        localStorage.setItem(SESSION_KEY, id);
        setSessionId(id);
    };

    return (
        <div className="app-layout">
            {sidebarOpen && (
                <SessionSidebar
                    currentSessionId={sessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={handleNewChat}
                />
            )}

            <div className="main-area">
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setSidebarOpen((v) => !v)}
                    title="Toggle sidebar"
                >
                    {sidebarOpen ? '◀' : '▶'}
                </button>

                <ChatScreen sessionId={sessionId} />
            </div>
        </div>
    );
};

export default App;
