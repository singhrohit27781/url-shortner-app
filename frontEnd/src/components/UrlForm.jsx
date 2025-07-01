import { useState } from 'react';
import axios from 'axios';

export const UrlForm = () => {
    const [url, setUrl] = useState("")
    const [showOutput, setShowOutput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState("")

    const submitHandler = async () => {
        // Input validation
        if (!url.trim()) {
            setError("Please enter a valid URL");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const response = await axios.post("http://localhost:3000/api-create", { url });
            console.log(response);
            
            // Access the actual response data
            if (response.data.success) {
                const shortLink = response.data.data.fullUrl;
                setShowOutput(shortLink);
                setUrl(""); // Clear input after success
            } else {
                setError("Failed to create short URL");
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.error || "Failed to create short URL");
        } finally {
            setLoading(false);
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(showOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div>
            <input
                type="url"
                placeholder="Enter full URL"
                required
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setError(""); // Clear error when user types
                }}
                className="w-full p-2 sm:p-3 mb-4 border border-[#cbd5e1] rounded focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white text-[#1e293b] placeholder:text-[#94a3b8] text-base sm:text-lg"
            />

            {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    {error}
                </div>
            )}

            <button
                onClick={submitHandler}
                disabled={loading}
                type="submit"
                className={`w-full p-2 sm:p-3 bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a21caf] text-white rounded-lg font-semibold shadow hover:from-[#0ea5e9] hover:to-[#7c3aed] transition text-base sm:text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Shortening...' : 'Shorten URL'}
            </button>

            {showOutput && (
                <div className="mt-8 mb-6 flex flex-col items-center">
                    <span className="text-xs sm:text-sm text-[#64748b] mb-2 uppercase tracking-widest">Short Link</span>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                        <span className="text-[#a21caf] font-mono font-bold text-lg break-all select-all w-full text-center sm:text-left">
                            {showOutput}
                        </span>
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold border transition ${
                                    copied
                                        ? "bg-green-500 border-green-600 text-white shadow-lg"
                                        : "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-700 hover:from-blue-200 hover:to-blue-300 shadow"
                                }`}
                                title="Copy to clipboard"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                        </svg>
                                        Copy
                                    </>
                                )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
