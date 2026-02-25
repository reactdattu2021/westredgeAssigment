const docs = require('../docs.json');

/**
 * Returns the full docs context string for injection into prompts.
 */
const getDocsContext = () => {
  return docs
    .map((doc, i) => `[${i + 1}] ${doc.title}:\n${doc.content}`)
    .join('\n\n');
};

/**
 * Converts stored message rows into LLM-compatible message format.
 * Only returns the last `limit` user+assistant pairs (i.e., limit*2 messages).
 */
const formatHistory = (messages, limit = 5) => {
  const trimmed = messages.slice(-(limit * 2));
  return trimmed.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

/**
 * Constructs the full prompt payload for the LLM.
 */
const buildPrompt = (userMessage, historyMessages, limit = 5) => {
  const docsContext = getDocsContext();
  const history = formatHistory(historyMessages, limit);

  const systemPrompt = `You are a helpful product support assistant. You ONLY answer questions based on the provided documentation below. If the user's question cannot be answered using the documentation, respond exactly with: "Sorry, I don't have information about that." Do not guess, hallucinate, or use any external knowledge.

=== PRODUCT DOCUMENTATION ===
${docsContext}
=== END OF DOCUMENTATION ===

Rules:
- Answer ONLY from the documentation above.
- If the answer is not present, say exactly: "Sorry, I don't have information about that."
- Be concise and helpful.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  return messages;
};

module.exports = { buildPrompt, getDocsContext, formatHistory };
