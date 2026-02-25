import React, { useState, useRef } from 'react';

const MessageInput = ({ onSend, loading }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        onSend(trimmed);
        setText('');
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <textarea
                ref={textareaRef}
                className="message-textarea"
                rows={1}
                placeholder="Ask a question… (Enter to send)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
            />
            <button
                type="submit"
                className={`send-btn ${loading ? 'disabled' : ''}`}
                disabled={loading || !text.trim()}
                aria-label="Send message"
            >
                {loading ? (
                    <span className="spinner" />
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                )}
            </button>
        </form>
    );
};

export default MessageInput;
