const { GoogleGenAI } = require('@google/genai');

const MODEL = 'gemini-2.5-flash';

let ai = null;
const getAI = () => {
    if (!ai) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error('GEMINI_API_KEY is not set.');
        ai = new GoogleGenAI({ apiKey: key });
    }
    return ai;
};

/**
 * messages: [{ role: 'system'|'user'|'assistant', content: string }]
 */
const callLLM = async (messages) => {
    const client = getAI();

    const systemMsg = messages.find(m => m.role === 'system')?.content || '';

    // Gemini expects alternating user/model turns
    const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

    const response = await client.models.generateContent({
        model: MODEL,
        contents,
        config: {
            systemInstruction: systemMsg,
            temperature: 0.2,
            maxOutputTokens: 512,
        },
    });

    const reply = response.text?.trim() || "Sorry, I don't have information about that.";
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

    return { reply, tokensUsed };
};

module.exports = { callLLM };
