'use client';
import { useCallback, useState } from 'react';

const RAGPlayground = () => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
    const [documentText, setDocumentText] = useState('');
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState(null);
    const [sources, setSources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [ingestStatus, setIngestStatus] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIngestStatus('');
        }
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            setIngestStatus('');
        }
    }, []);

    const handleIngest = async (e) => {
        e.preventDefault();
        const hasPastedText = activeTab === 'paste' && documentText.trim();
        const hasFile = activeTab === 'upload' && file;

        if (!hasPastedText && !hasFile) {
            alert('Please paste some text or upload a file to process.');
            return;
        }

        setIsIngesting(true);
        setIngestStatus('Processing and indexing your document...');
        
        const formData = new FormData();
        if (hasFile) {
            formData.append('file', file);
        } else if (hasPastedText) {
            formData.append('text', documentText);
        }

        try {
            const response = await fetch('/api/ingest', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to ingest document.');
            setIngestStatus(`✅ ${file ? file.name : 'Text'} processed successfully! You can now ask questions.`);
        } catch (error) {
            console.error('Ingestion Error:', error);
            setIngestStatus(`Error: ${error.message}`);
        } finally {
            setIsIngesting(false);
        }
    };

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setAnswer(null);
        setSources([]);
        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to get answer.');
            setAnswer(data.answer);
            setSources(data.sources || []);
        } catch (error) {
            console.error('Query Error:', error);
            setAnswer(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="rag-playground" className="py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">AI Playground</h2>
                   
<p className="text-lg text-slate-600">
    Ask me anything about my portfolio, or provide your own data to chat about.
</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Ingestion */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Step 1: Provide Context</h3>
                        <div className="flex border-b border-slate-200 mb-4">
                            <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'upload' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500'}`}>Upload File</button>
                            <button onClick={() => setActiveTab('paste')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'paste' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500'}`}>Paste Text</button>
                        </div>
                        <form onSubmit={handleIngest}>
                            {activeTab === 'upload' ? (
                                <div>
                                    <label
                                        htmlFor="file-upload"
                                        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer transition-colors ${isDragOver ? 'bg-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                    >
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            <p className="mt-2 text-sm text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-slate-500">TXT, MD, or PDF</p>
                                        </div>
                                        <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,.pdf" />
                                    </label>
                                    {file && <p className="text-center mt-3 text-sm font-medium text-slate-700">Selected: {file.name}</p>}
                                </div>
                            ) : (
                                <textarea
                                    rows="8" value={documentText} onChange={(e) => setDocumentText(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 transition-shadow"
                                    placeholder="Paste the text you want the AI to learn from here..."
                                />
                            )}
                            <button type="submit" disabled={isIngesting} className="mt-4 w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 disabled:bg-slate-400 transition-colors">
                                {isIngesting ? 'Processing...' : 'Process Document'}
                            </button>
                            {ingestStatus && <p className="text-center mt-3 text-sm font-medium text-slate-600">{ingestStatus}</p>}
                        </form>
                    </div>

                    {/* Right Column: Query & Results */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Step 2: Ask a Question</h3>
                        <form onSubmit={handleQuery}>
                            <input
                                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 transition-shadow"
                                placeholder="e.g., What is the main conclusion?"
                            />
                            <button type="submit" disabled={isLoading} className="mt-4 w-full rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:bg-sky-300 transition-colors">
                                {isLoading ? 'Thinking...' : 'Get Answer'}
                            </button>
                        </form>

                        {isLoading && <div className="text-center mt-6"><div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>}
                        
                        {answer && (
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h4 className="text-lg font-bold text-slate-900 mb-2">Answer:</h4>
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
                                
                                {sources.length > 0 && (
                                    <div className="mt-6">
                                        <h5 className="text-md font-bold text-slate-900 mb-2">Cited Sources:</h5>
                                        <div className="space-y-4">
                                            {sources.map((source, index) => (
                                                <blockquote key={index} className="p-3 border-l-4 border-slate-300 bg-slate-50 rounded-r-lg text-sm text-slate-600">
                                                    <strong className="text-slate-800">[{index + 1}]</strong> {source.sourceText}
                                                </blockquote>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RAGPlayground;