const Session = require('../models/Session');
const Message = require('../models/Message');
const { buildPrompt } = require('../helpers/promptBuilder');
const { callLLM } = require('../helpers/llmClient');

const chat = async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required.' });
    }

    await Session.findByIdAndUpdate(
        sessionId,
        { _id: sessionId, updatedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Message.create({ sessionId, role: 'user', content: message });

    const history = await Message.find({ sessionId })
        .sort({ createdAt: 1 })
        .limit(10)
        .lean();

    const messages = buildPrompt(message, history.slice(0, -1));

    let reply, tokensUsed;
    try {
        ({ reply, tokensUsed } = await callLLM(messages));
    } catch (err) {
        console.error('[LLM Error]', err.message || err);
        return res.status(502).json({ error: `AI error: ${err.message || 'Unknown'}` });
    }

    await Message.create({ sessionId, role: 'assistant', content: reply });
    await Session.findByIdAndUpdate(sessionId, { updatedAt: new Date() });

    return res.json({ reply, tokensUsed });
};

const getConversation = async (req, res) => {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required.' });

    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
    return res.json({ sessionId, messages });
};

const listSessions = async (req, res) => {
    const sessions = await Session.find({}).sort({ updatedAt: -1 }).lean();
    return res.json({ sessions });
};

module.exports = { chat, getConversation, listSessions };
