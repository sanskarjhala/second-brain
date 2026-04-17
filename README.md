# Second Brain

🌐 Live Demo 👉 https://sanskarjhala-second-brain.vercel.app/

A smart, AI-powered application that helps you **save, organize, and retrieve knowledge** — like a digital extension of your brain.

It doesn’t just store information — it understands context and helps you **find what you need instantly using AI**.

---

## 🚀 Features

### Second Brain (Core)

- Save anything — notes, links, articles, ideas, etc.
- Semantic search (search by meaning, not keywords)
- AI-powered summaries of saved content
- Fast and responsive UI
- JWT-based authentication
- Cloud storage using MongoDB Atlas

---

### Resume Analyzer

- Upload resume (PDF) + job description
- Get **ATS match score (0–100%)**
- Extract:
  - Skills
  - Experience
  - Projects
  - Education
- Identify **missing skills**
- Get **actionable suggestions**
- Chat with AI about your resume

---

## 📂 Example Use Cases

### Recipes

Save recipes like “chocolate cake” → search “easy desserts” → get relevant results instantly.

### Study Notes

Save “React hooks” → search “React tips” → get related notes without exact keywords.

### Sports

Save match stats → search “latest cricket news” → get relevant saved content.

### Music

Save songs → search “uplifting songs” → retrieve your collection intelligently.

### Travel / Ideas

Save plans → search “weekend trips” → instantly retrieve relevant ideas.

---

## How It Works

### Semantic Search (Second Brain)

1. Content is converted into **embeddings**
2. Stored in database
3. User query → converted to embedding
4. Similarity search → retrieves relevant content
5. LLM generates contextual answer

---

### Resume Analyzer Pipeline

1. **PDF Parsing**
   - Extract text from resume using `pdf-parse`

2. **Job Description Processing**
   - Summarized using LLM

3. **AI Analysis**
   - Resume + JD → sent to LLM
   - Returns structured JSON:
     - skills
     - matchScore
     - missingSkills
     - suggestions

4. **Validation**
   - Output validated using **Zod schema**

5. **Storage**
   - Stored in MongoDB with user session

6. **Chat System**
   - Uses:
     - Resume content
     - Job description
     - Previous chat messages
   - Generates contextual responses

---

## Chat with Your Resume

Ask things like:

- “What skills am I missing?”
- “Improve my resume”
- “Write a cover letter”

👉 AI responds using your resume + job context

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js + Express
- TypeScript
- MongoDB Atlas
- JWT Authentication

### AI

- GitHub AI Models (GPT-4o-mini)
- Embeddings: `text-embedding-3-small`
- LLM-based structured output

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## AI Architecture

- LLM for:
  - Resume analysis
  - Chat responses
  - Summarization

- Embeddings for:
  - Semantic search
  - Context retrieval

- Retry logic for reliability

---

## 🔥 Key Highlights

- Full-stack AI application
- Real-world use case (ATS Resume Analyzer)
- Structured LLM outputs (Zod validation)
- Context-aware AI chat system
- Scalable architecture

---

## Future Improvements

- **RAG-based Chat with Saved Content**  
  Enable users to chat with their stored content using embeddings + LLM

- **Vector DB Optimization**  
  Integrate FAISS/Chroma for faster search

- **Multi-format Support for interaction with Content**  
  Support PDFs, audio, videos, and web content

- **Advanced Resume Scoring**  
  Use embedding similarity for better ATS accuracy

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share feedback!
