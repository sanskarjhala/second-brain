# 🧠 AI Resume Analyzer + Second Brain System

An intelligent system that analyzes resumes against job descriptions using LLMs and vector embeddings, while also acting as a personal knowledge engine for storing and querying content.

---

## 🚀 Overview

This project combines:

*  **Resume Analysis (ATS Simulation)**
*  **Second Brain (Content Storage + Retrieval)**
*  **Semantic Search using Vector Database**
*  **LLM-based Reasoning & Feedback**

Instead of just giving an ATS score, the system explains:

* Why your resume is weak
* What matches the job description
* How to improve each section

---

## 🏗️ Architecture

```
                ┌──────────────────────┐
                │     User Input       │
                │ Resume + JD / Links  │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │   Content Extractor  │
                │ (PDF / Article / YT) │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │   Section Extractor  │
                │   (LLM Structured)   │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │      Chunking        │
                │ (with metadata tags) │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │   Chroma Vector DB   │
                │ (Embeddings Stored)  │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │   Similarity Search  │
                │   (Retriever Layer)  │
                └─────────┬────────────┘
                          ↓
                ┌──────────────────────┐
                │   LLM Analysis       │
                │ (ATS + Explanation)  │
                └──────────────────────┘
```

---

## 🧩 Core Features

### 📄 Resume Analyzer

* Extracts structured sections:

  * Skills
  * Experience
  * Projects
  * Education
* Compares resume with job description
* Generates:

  * ATS Score (0–100)
  * Missing skills
  * Weak areas
  * Actionable suggestions

---

### 🧠 Second Brain (Content Intelligence)

* Store:

  * Articles
  * YouTube transcripts
  * Notes
* Convert into embeddings
* Query using semantic search
* Filter per user and per content

---

### 🗄️ Dual Database System

| System    | Purpose                               |
| --------- | ------------------------------------- |
| MongoDB   | Stores metadata, content, status      |
| Chroma DB | Stores embeddings for semantic search |

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express
* **Language:** TypeScript
* **LLM Integration:** LangChain
* **Vector DB:** Chroma
* **Database:** MongoDB
* **Parsing:**

  * PDF Loader
  * Readability (articles)
  * YouTube Transcript API

---

## 🔑 Key Concepts Implemented

### 1. Metadata-Aware Chunking

Each chunk stores:

```json
{
  "section": "skills",
  "source": "resume-123",
  "userId": "user-1"
}
```

This enables:

* Section-wise analysis
* Multi-user isolation
* Precise retrieval

---

### 2. Retrieval System (RAG)

Instead of naive search:

```
JD → Chunked → Query Vector DB → Top Matches
```

Used for:

* Resume vs JD comparison
* Content querying

---

### 3. LLM Reasoning Layer

Embeddings find **relevant data**,
LLM explains **why it matters**.

---

## 🔄 Workflow

### Resume Analysis Flow

```
PDF Resume
   ↓
Text Extraction
   ↓
Section Extraction (LLM)
   ↓
Chunking + Metadata
   ↓
Store in Chroma
   ↓
JD Chunking
   ↓
Similarity Search
   ↓
LLM Report Generation
```

---

## 📡 API Example

### POST `/api/resume/analyze`

**Request:**

```json
{
  "filePath": "resume.pdf",
  "jd": "Looking for Node.js developer with AWS experience"
}
```

**Response:**

```json
{
  "score": 72,
  "missing_skills": ["AWS", "Docker"],
  "strong_matches": ["Node.js", "Express"],
  "suggestions": [
    "Add deployment experience",
    "Include system design exposure"
  ]
}
```

---

## 🎯 What Makes This Project Unique

* ✅ Explainable ATS (not just scoring)
* ✅ Line-by-line resume feedback
* ✅ Multi-user vector database design
* ✅ Combines Resume + Knowledge Engine
* ✅ Scalable architecture (production-ready)

---

## 🚀 Future Improvements

* Resume auto-rewriting (AI suggestions applied directly)
* Multi-resume comparison (HR ranking system)
* Chat with your resume + saved content
* UI dashboard with analytics

---

## 👨‍💻 Author

Built as part of a larger **AI Second Brain system**, focusing on real-world LLM applications and scalable architecture.

---

## ⭐ If You Like This Project

Give it a star ⭐ and feel free to connect!
