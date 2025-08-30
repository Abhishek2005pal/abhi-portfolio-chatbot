import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { CohereClient } from 'cohere-ai';
import Groq from 'groq-sdk';

export async function POST(request) {
    try {
        // Initialize All Clients
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const pineconeIndex = pinecone.Index("portfolio-gemini-rag"); // <-- Use your new index name
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const { query } = await request.json();
        if (!query) {
            return new Response(JSON.stringify({ error: "Query is required." }), { status: 400 });
        }

        // 1. Embed the Query (using Google Gemini)
        const embedding = await embeddingModel.embedContent(query);
        const queryVector = embedding.embedding.values;

        // 2. Retrieve from Pinecone
        const queryResponse = await pineconeIndex.query({
            vector: queryVector,
            topK: 10,
            includeMetadata: true,
        });
        const retrievedDocs = queryResponse.matches.map(match => match.metadata.sourceText);

        // 3. Rerank with Cohere
        const rerankResponse = await cohere.rerank({
            model: "rerank-english-v3.0",
            query: query,
            documents: retrievedDocs,
            topN: 3,
        });
        const rerankedDocs = rerankResponse.results.map(result => retrievedDocs[result.index]);
        
        const sources = rerankedDocs.map(doc => ({ sourceText: doc }));

        // 4. Generate Answer with Groq
        const context = rerankedDocs.map((doc, index) => `Context Snippet [${index + 1}]:\n"${doc}"`).join("\n\n");
        const systemPrompt = `You are an expert Q&A assistant. Your answers must be grounded in the provided context. Answer the user's question using ONLY the following context snippets. For each sentence in your answer, you must include a citation like [1], [2], etc., corresponding to the context snippet you used. If the context does not contain the answer, state that you cannot answer the question.`;
        
        const userPrompt = `User Question: "${query}"`;
        
        const chatCompletion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `${context}\n\n${userPrompt}` }
            ],
        });

        const answer = chatCompletion.choices[0].message.content;

        return new Response(JSON.stringify({ answer, sources }), { status: 200 });

    } catch (error) {
        console.error("Query Error:", error);
        return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), { status: 500 });
    }
}