"use client";

import { useState, useRef, useEffect } from "react";

interface ParticipantData {
    id: number;
    name: string;
    email: string;
    badges: number;
    posts: number;
    points: number;
}

export default function CertificatePage() {
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [error, setError] = useState("");
    const [participant, setParticipant] = useState<ParticipantData | null>(null);
    const [isEligible, setIsEligible] = useState(false);
    const [allParticipants, setAllParticipants] = useState<ParticipantData[]>([]);
    const [suggestions, setSuggestions] = useState<ParticipantData[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [certificateGenerated, setCertificateGenerated] = useState(false);

    // Event end date - set this to your event's end date
    const EVENT_END_DATE = new Date("2026-02-16"); // Change this date as needed
    const isEventEnded = new Date() >= EVENT_END_DATE;

    // Fetch all participants on component mount
    useEffect(() => {
        fetchAllParticipants();
    }, []);

    const fetchAllParticipants = async () => {
        try {
            setLoadingParticipants(true);
            const response = await fetch('/api/participants');
            if (!response.ok) {
                throw new Error('Failed to fetch participants');
            }
            const data = await response.json();
            setAllParticipants(data.participants || []);
        } catch (err) {
            console.error('Error fetching participants:', err);
            setAllParticipants([]);
        } finally {
            setLoadingParticipants(false);
        }
    };

    // Calculate string similarity (Levenshtein distance-based)
    const getSimilarity = (str1: string, str2: string): number => {
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();

        // Exact match
        if (s1 === s2) return 1;

        // Contains match
        if (s1.includes(s2) || s2.includes(s1)) return 0.8;

        // Simple Levenshtein distance
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;

        if (longer.length === 0) return 1.0;

        const editDistance = levenshteinDistance(s1, s2);
        return (longer.length - editDistance) / longer.length;
    };

    const levenshteinDistance = (str1: string, str2: string): number => {
        const matrix: number[][] = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    };

    useEffect(() => {
        if (participant && isEligible && canvasRef.current) {
            generateCertificate();
        }
    }, [participant, isEligible]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setParticipant(null);
        setIsEligible(false);
        setSuggestions([]);
        setCertificateGenerated(false);

        if (!searchInput.trim()) {
            setError("Please enter your name or email");
            return;
        }

        setLoading(true);

        const searchTerm = searchInput.trim().toLowerCase();

        // Try exact match first (email or name)
        let found = allParticipants.find(
            p => p.email.toLowerCase() === searchTerm ||
                p.name.toLowerCase() === searchTerm
        );

        // If no exact match, try partial match
        if (!found) {
            found = allParticipants.find(
                p => p.email.toLowerCase().includes(searchTerm) ||
                    p.name.toLowerCase().includes(searchTerm)
            );
        }

        // If still no match, find similar names
        if (!found) {
            const similarParticipants = allParticipants
                .map(p => ({
                    participant: p,
                    nameSimilarity: getSimilarity(p.name, searchInput),
                    emailSimilarity: getSimilarity(p.email, searchInput)
                }))
                .filter(item => item.nameSimilarity > 0.5 || item.emailSimilarity > 0.5)
                .sort((a, b) => Math.max(b.nameSimilarity, b.emailSimilarity) - Math.max(a.nameSimilarity, a.emailSimilarity))
                .slice(0, 5)
                .map(item => item.participant);

            if (similarParticipants.length > 0) {
                setSuggestions(similarParticipants);
                setError(`No exact match found. Did you mean one of these?`);
            } else {
                setError("No participant found with this name or email. Please check your spelling.");
            }
            setLoading(false);
            return;
        }

        // Check eligibility
        const isEligible = found.badges >= 1;

        setParticipant(found);
        setIsEligible(isEligible);

        if (!isEligible) {
            setError("You need at least 1 badge to qualify for a certificate.");
        }

        setLoading(false);
    };

    const selectSuggestion = (suggested: ParticipantData) => {
        setSearchInput(suggested.name);
        setSuggestions([]);
        setError("");

        // Auto-submit with the selected suggestion
        const isEligible = suggested.badges >= 1;
        setParticipant(suggested);
        setIsEligible(isEligible);

        if (!isEligible) {
            setError("You need at least 1 badge to qualify for a certificate.");
        }
    };

    const generateCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas || !participant) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to match new template dimensions
        canvas.width = 2800;
        canvas.height = 2000;

        // Load and draw the certificate template
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/certificate-template.jpeg";

        img.onload = () => {
            // Draw the template
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Add participant name
            // Centered horizontally between line start (462) and end (2344)
            // Positioned at Y: 1150 (highest available space for name)
            const nameX = (462 + 2344) / 2; // Center of the name line
            const nameY = 1150;

            ctx.font = "bold 140px Arial";
            ctx.fillStyle = "#1a202c";
            ctx.textAlign = "center";
            ctx.fillText(participant.name, nameX, nameY);

            setCertificateGenerated(true);
        };

        img.onerror = () => {
            // Fallback: Create a simple certificate without template
            ctx.fillStyle = "#f7fafc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add border
            ctx.strokeStyle = "#3182ce";
            ctx.lineWidth = 30;
            ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

            // Add title
            ctx.font = "bold 96px Arial";
            ctx.fillStyle = "#2d3748";
            ctx.textAlign = "center";
            ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 400);

            // Add subtitle
            ctx.font = "56px Arial";
            ctx.fillStyle = "#4a5568";
            ctx.fillText("GDG OAU Badge Sprint", canvas.width / 2, 520);

            // Add "This certifies that"
            ctx.font = "48px Arial";
            ctx.fillText("This certifies that", canvas.width / 2, 760);

            // Add participant name
            const nameX = (462 + 2344) / 2;
            const nameY = 1150;
            ctx.font = "bold 140px Arial";
            ctx.fillStyle = "#1a202c";
            ctx.fillText(participant.name, nameX, nameY);

            // Add signature line
            ctx.strokeStyle = "#4a5568";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 300, 1680);
            ctx.lineTo(canvas.width / 2 + 300, 1680);
            ctx.stroke();

            ctx.font = "36px Arial";
            ctx.fillText("GDG OAU Organizer", canvas.width / 2, 1750);

            setCertificateGenerated(true);
        };
    };

    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas || !participant) return;

        const link = document.createElement("a");
        link.download = `GDG-OAU-Certificate-${participant.name.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    if (loadingParticipants) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
                    <p className="text-gray-700 text-base sm:text-lg font-semibold">Loading participants...</p>
                </div>
            </div>
        );
    }

    if (!isEventEnded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center border-2 border-purple-200">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                        <span className="text-3xl sm:text-4xl">🎓</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                        Certificates Coming Soon!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                        Certificates will be available after the event concludes on{" "}
                        <strong className="text-purple-600 font-bold">
                            {EVENT_END_DATE.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </strong>
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                        ← Back to Leaderboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8 sm:py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <img src="/gdg_logo.png" alt="GDG Logo" className="h-16 sm:h-20 w-auto" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 px-4">
                        Get Your Certificate
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 px-4">
                        Congratulations on completing the Badge Sprint! 🎉
                    </p>
                </div>

                {/* Form Section */}
                {!participant && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 sm:p-8 mb-6 sm:mb-8 border-2 border-purple-200">
                        <div className="mb-5 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Check Your Eligibility
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Enter your name or email to see if you qualify for a certificate.
                                <br />
                                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                    (You need at least 1 badge to be eligible)
                                </span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Name or Email
                                </label>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base text-gray-900 shadow-sm"
                                    placeholder="Enter your name or email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-red-700 font-medium">
                                    {error}
                                </div>
                            )}

                            {suggestions.length > 0 && (
                                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm text-blue-900 font-semibold mb-2">
                                        Similar names found:
                                    </p>
                                    <div className="space-y-2">
                                        {suggestions.map((suggested) => (
                                            <button
                                                key={suggested.id}
                                                type="button"
                                                onClick={() => selectSuggestion(suggested)}
                                                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-xs sm:text-sm"
                                            >
                                                <div className="font-semibold text-blue-900">{suggested.name}</div>
                                                <div className="text-blue-600 text-xs">{suggested.email} • {suggested.badges} badge{suggested.badges !== 1 ? 's' : ''}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {loading ? "Checking..." : "Generate Certificate"}
                            </button>
                        </form>

                        <div className="mt-5 sm:mt-6 text-center">
                            <a
                                href="/"
                                className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-semibold"
                            >
                                ← Back to Leaderboard
                            </a>
                        </div>
                    </div>
                )}

                {/* Certificate Display */}
                {participant && isEligible && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 sm:p-8 border-2 border-purple-200">
                        <div className="text-center mb-5 sm:mb-6">
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold mb-3 sm:mb-4 text-xs sm:text-sm shadow-sm">
                                <span>✓</span> Eligible for Certificate
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 px-2">
                                Your Certificate is Ready!
                            </h2>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 px-2">
                                {participant.name} • {participant.badges} Badge{participant.badges !== 1 ? "s" : ""} • {participant.posts} Post{participant.posts !== 1 ? "s" : ""} • {participant.points} Points
                            </p>
                        </div>

                        <div className="flex justify-center mb-5 sm:mb-6">
                            <canvas
                                ref={canvasRef}
                                className="border-4 border-purple-200 rounded-lg shadow-xl max-w-full h-auto"
                                style={{ maxHeight: "600px" }}
                            />
                        </div>

                        {certificateGenerated && (
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <button
                                    onClick={downloadCertificate}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    📥 Download Certificate
                                </button>
                                <button
                                    onClick={() => {
                                        setParticipant(null);
                                        setIsEligible(false);
                                        setSearchInput("");
                                        setCertificateGenerated(false);
                                    }}
                                    className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:from-gray-300 hover:to-gray-400 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    Generate Another
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Info Card */}
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-purple-200 rounded-xl p-5 sm:p-6 shadow-lg">
                    <h3 className="font-bold text-base sm:text-lg bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent mb-2 sm:mb-3">📋 Requirements</h3>
                    <ul className="text-xs sm:text-sm text-blue-900 space-y-1 font-medium">
                        <li>• At least 1 completed badge</li>
                        <li>• Name or email registered in the system</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
