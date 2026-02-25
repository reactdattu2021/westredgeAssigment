# AI Support Assistant

A full-stack AI-powered Support Assistant built with **React**, **Node.js/Express**, **MongoDB**, and **OpenAI GPT**.

---

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   └── chatController.js     # chat, getConversation, listSessions
│   ├── helpers/
│   │   ├── llmClient.js          # OpenAI API wrapper
│   │   └── promptBuilder.js      # Prompt + history construction
│   ├── models/
│   │   ├── Session.js            # Mongoose Session model
│   │   └── Message.js            # Mongoose Message model
│   ├── routes/
│   │   └── chatRoutes.js         # Express route definitions
│   ├── docs.json                 # Product FAQ documentation
│   ├── server.js                 # Express entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── chatApi.js        # Axios API client
    │   ├── components/
    │   │   ├── ChatScreen.jsx    # Main chat view
    │   │   ├── MessageList.jsx   # Message bubbles + typing indicator
    │   │   ├── MessageInput.jsx  # Textarea + send button
    │   │   └── SessionSidebar.jsx # Session history panel
    │   ├── App.jsx               # Root with session management
    │   └── index.css             # Global styles (dark theme)
    └── public/
        └── index.html
```

---

## Setup

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)
- OpenAI API key

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and OPENAI_API_KEY
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

---

## API Reference

### `POST /api/chat`
Send a user message and receive an AI reply.

**Request:**
```json
{ "sessionId": "abc-123", "message": "How do I reset my password?" }
```

**Response:**
```json
{ "reply": "Users can reset password from Settings > Security.", "tokensUsed": 142 }
```

### `GET /api/conversations/:sessionId`
Fetch all messages for a session in chronological order.

**Response:**
```json
{ "sessionId": "abc-123", "messages": [{ "role": "user", "content": "...", "createdAt": "..." }] }
```

### `GET /api/sessions`
List all sessions sorted by most recently updated.

**Response:**
```json
{ "sessions": [{ "_id": "abc-123", "createdAt": "...", "updatedAt": "..." }] }
```

---

## Database Schema (MongoDB)

### `sessions` collection
| Field      | Type     | Notes           |
|------------|----------|-----------------|
| _id        | String   | sessionId (UUID)|
| createdAt  | Date     |                 |
| updatedAt  | Date     |                 |

### `messages` collection
| Field      | Type     | Notes                    |
|------------|----------|--------------------------|
| _id        | ObjectId | Auto                     |
| sessionId  | String   | FK to sessions._id       |
| role       | String   | "user" or "assistant"    |
| content    | String   | Message text             |
| createdAt  | Date     | Mongoose timestamp       |
| updatedAt  | Date     | Mongoose timestamp       |

---

## How It Works

1. **docs.json** — The only source of truth for the AI. All 10 FAQ entries are injected into the system prompt.
2. **Strict answering** — If the question is not covered by the docs, the AI responds: `"Sorry, I don't have information about that."`
3. **Session context** — Last 5 user+assistant message pairs are fetched from MongoDB and included in each LLM call.
4. **Rate limiting** — 60 requests per 15 minutes per IP address.

---

## Assumptions

- OpenAI `gpt-3.5-turbo` is used as the LLM. The model can be changed in `helpers/llmClient.js`.
- MongoDB runs locally on the default port. Update `MONGODB_URI` in `.env` for Atlas.
- Session IDs are UUID v4, generated client-side and stored in `localStorage`.
- The system enforces document-only answers via the system prompt — no fallback hallucination.
