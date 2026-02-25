const express = require('express');
const router = express.Router();
const { chat, getConversation, listSessions } = require('../controllers/chatController');

router.post('/chat', chat);
router.get('/conversations/:sessionId', getConversation);
router.get('/sessions', listSessions);

module.exports = router;
