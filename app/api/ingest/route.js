import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';
const pdf = require('pdf-parse'); // <-- THE ONLY CHANGE IS ON THIS LINE

// Helper: Text Chunking
const chunkText = (text, chunkSize = 1000, overlap = 100) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
};

// Main API Route Handler
export async function POST(request) {
    try {
        // 1. EXTRACT FILE AND TEXT FROM FORMDATA
        const formData = await request.formData();
        const file = formData.get('file');
        const pastedText = formData.get('text');
        
        let documentText = '';

        if (file) {
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            if (file.type === 'application/pdf') {
                const pdfData = await pdf(fileBuffer);
                documentText = pdfData.text;
            } else { // Handle .txt, .md, etc.
                documentText = fileBuffer.toString('utf-8');
            }
        } else if (pastedText) {
            documentText = pastedText;
        }

        if (!documentText) {
            return new Response(JSON.stringify({ error: "No text found in file or pasted content." }), { status: 400 });
        }

        // 2. INITIALIZE CLIENTS
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const pineconeIndex = pinecone.Index("portfolio-gemini-rag");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

        // 3. CHUNKING
        const chunks = chunkText(documentText);

        // 4. EMBEDDING (one by one for reliability)
        const vectors = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!chunk.trim()) continue;
            try {
                const embedding = await embeddingModel.embedContent(chunk);
                vectors.push({
                    id: `chunk-${Date.now()}-${i}`,
                    values: embedding.embedding.values,
                    metadata: { sourceText: chunk },
                });
            } catch (e) {
                console.error(`Skipping a chunk due to embedding error:`, e.message);
                continue;
            }
        }

        if (vectors.length === 0) {
            return new Response(JSON.stringify({ error: "Could not create any embeddings from the provided text." }), { status: 500 });
        }

        // 5. UPSERT TO PINECONE
        await pineconeIndex.upsert(vectors);

        return new Response(JSON.stringify({ message: "Document processed successfully." }), { status: 200 });

    } catch (error) {
        console.error("Ingestion Error:", error);
        return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), { status: 500 });
    }
}