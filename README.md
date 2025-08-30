Abhishek Pal's Full-Stack Portfolio & AI Playground
This repository contains the code for my personal portfolio and an advanced AI-powered chat application. The project is built with a modern, full-stack architecture, featuring a decoupled frontend and backend to showcase a wide range of web development and AI engineering skills.

🚀 Live Links
Frontend (Portfolio): abhishek-portfolio.vercel.app  (<-- Yahan apna Vercel URL daalein)

Backend (API Health): abhishek-pal-api.onrender.com/health (<-- Yahan apna Render URL daalein)

✨ Key Features
Portfolio Section
Dynamic Content: All portfolio data (experience, projects, skills, etc.) is fetched live from a MongoDB database via a custom Node.js API.

Component-Based Architecture: Built with React and Next.js, featuring a clean, organized, and reusable component structure.

Modern UI/UX: A fully responsive design with smooth animations and a professional aesthetic, built with Tailwind CSS.

Dual-View Navigation: A smart navbar that provides context-aware navigation for the portfolio and AI chat sections.

🤖 AI Chat (RAG Playground)
This is a fully-featured Retrieval-Augmented Generation (RAG) application that allows users to chat with documents.

Automatic Portfolio Context: The AI is automatically knowledgeable about my portfolio. Users can ask questions like "What technologies were used at Mensa Brands?" or "List all projects that use Next.js".

Custom Data Interaction: Users can upload their own files (.txt, .md, .pdf) or paste text to create a new context for the AI to answer questions from.

Grounded Answers with Citations: The AI generates answers based only on the provided context and includes citations [1], [2] that link back to the exact source text.

Advanced RAG Pipeline: Implements a professional-grade AI pipeline:

Ingestion & Chunking: Processes and splits documents.

Embedding: Uses Google Gemini's powerful models to convert text to vectors.

Vector Storage & Retrieval: Stores and retrieves information at high speed using Pinecone.

Reranking: Uses Cohere to improve the relevance and quality of retrieved results.

Generation: Uses Groq's Llama 3 for blazing-fast and accurate answer generation.

🏛️ Architecture
This project follows a decoupled, full-stack architecture:

Frontend: A Next.js application hosted on Vercel. It serves the user interface and contains serverless functions for the AI Chat's backend logic.

Backend: A dedicated Node.js/Express server hosted on Render. Its sole responsibility is to serve portfolio data from the database.

Database: A MongoDB Atlas cluster that stores all portfolio content.

AI Services: The AI Playground's serverless functions communicate with external APIs (Pinecone, Google, Cohere, Groq) to perform the RAG pipeline.

🛠️ Tech Stack
Category

Technologies

Frontend

⚛️ Next.js,  reacting, 🎨 Tailwind CSS

Backend

🟩 Node.js, 🚀 Express.js

Database

🍃 MongoDB (with Mongoose)

AI Services

🌲 Pinecone (Vector DB), ✨ Google Gemini (Embeddings), 🔗 Cohere (Reranker), ⚡ Groq (LLM Generation)

Deployment

▲ Vercel (Frontend & Serverless Functions), ▶️ Render (Backend Server)

本地设置 (Local Setup)
To run this project on your local machine, you will need to run both the backend and frontend servers in separate terminals.

1. Backend (abhi-backend repo)
# Clone the backend repository
git clone [https://github.com/your-username/portfolio-backend.git](https://github.com/your-username/portfolio-backend.git)
cd portfolio-backend

# Install dependencies
npm install

# Create a .env file and add your MongoDB URI
# MONGODB_URI=mongodb+srv://...

# Run the server
node index.js
# The backend will be running at http://localhost:5001

2. Frontend (abhi-portfolio repo)
# Clone this repository
git clone [https://github.com/your-username/abhishek-portfolio.git](https://github.com/your-username/abhishek-portfolio.git)
cd abhishek-portfolio

# Install dependencies
npm install

# Create a .env.local file and add all your API keys
# See .env.example for the required keys

# Run the development server
npm run dev
# Open http://localhost:3000 in your browser

.env.local Example for Frontend:

NEXT_PUBLIC_API_URL=http://localhost:5001

PINECONE_API_KEY=...
GOOGLE_API_KEY=...
COHERE_API_KEY=...
GROQ_API_KEY=...

🤝 Let's Connect!
I'm always open to connecting with other developers and recruiters. Feel free to reach out!

GitHub: @Abhishekpal28

LinkedIn: Abhishek Pal
