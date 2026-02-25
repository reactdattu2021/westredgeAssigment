import React, { useState, useEffect, useCallback } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { sendMessage, fetchConversation } from '../api/chatApi';

const ChatScreen = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadHistory = useCallback(async () => {
        if (!sessionId) return;
        try {
            const res = await fetchConversation(sessionId);
            setMessages(res.data.messages || []);
        } catch {
            setMessages([]);
        }
    }, [sessionId]);

    useEffect(() => {
        setMessages([]);
        setError('');
        loadHistory();
    }, [sessionId, loadHistory]);

    const handleSend = async (text) => {
        const tempId = Date.now().toString();
        const tempTime = new Date().toISOString();

        setMessages((prev) => [
            ...prev,
            { tempId, role: 'user', content: text, tempTime },
        ]);
        setLoading(true);
        setError('');

        try {
            const res = await sendMessage(sessionId, text);
            const { reply } = res.data;

            setMessages((prev) => [
                ...prev,
                { tempId: tempId + '_reply', role: 'assistant', content: reply, tempTime: new Date().toISOString() },
            ]);
        } catch (err) {
            const msg =
                err.response?.data?.error || 'Something went wrong. Please try again.';
            setError(msg);
            // Remove the optimistic user message on failure
            setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-screen">
            <div className="chat-header">
                <div className="chat-header-info">
                    <span className="status-dot" />
                    <div>
                        <h1>Support Assistant</h1>
                        <p>Session: {sessionId?.slice(0, 12)}…</p>
                    </div>
                </div>
            </div>

            <div className="chat-body">
                <MessageList messages={messages} loading={loading} />
            </div>

            {error && <div className="error-banner">⚠️ {error}</div>}

            <div className="chat-footer">
                <MessageInput onSend={handleSend} loading={loading} />
            </div>
        </div>
    );
};

export default ChatScreen;
