import axios from 'axios';

const api = axios.create({
    baseURL: "https://westredgeassigment-2.onrender.com/api" || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const sendMessage = (sessionId, message) =>
    api.post('/chat', { sessionId, message });

export const fetchConversation = (sessionId) =>
    api.get(`/conversations/${sessionId}`);

export const fetchSessions = () =>
    api.get('/sessions');

export default api;
