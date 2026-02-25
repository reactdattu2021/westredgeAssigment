import React, { useEffect, useRef } from 'react';

const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageList = ({ messages, loading }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>Ask me anything about our product!</p>
                <span>I'll answer based on our documentation.</span>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((msg) => (
                <div key={msg._id || msg.tempId} className={`message-row ${msg.role}`}>
                    <div className="bubble-wrapper">
                        <div className="avatar">{msg.role === 'user' ? '🧑' : '🤖'}</div>
                        <div className="bubble">
                            <p>{msg.content}</p>
                            <span className="timestamp">
                                {formatTime(msg.createdAt || msg.tempTime)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="message-row assistant">
                    <div className="bubble-wrapper">
                        <div className="avatar">🤖</div>
                        <div className="bubble typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
