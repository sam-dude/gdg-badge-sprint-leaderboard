"use client";

import { useState, useRef, useEffect } from "react";

interface ParticipantData {
    name: string;
    email: string;
    badges: number;
    posts: number;
    points: number;
}

export default function CertificatePage() {
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [participant, setParticipant] = useState<ParticipantData | null>(null);
    const [isEligible, setIsEligible] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [certificateGenerated, setCertificateGenerated] = useState(false);

    // Event end date - set this to your event's end date
    const EVENT_END_DATE = new Date("2026-02-16"); // Change this date as needed
    const isEventEnded = new Date() >= EVENT_END_DATE;

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
        setCertificateGenerated(false);

        if (!searchInput.trim()) {
            setError("Please enter your name or email");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/certificate?search=${encodeURIComponent(searchInput.trim())}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch certificate data");
            }

            const data = await response.json();

            if (!data.eligible) {
                setError(data.message || "You are not eligible for a certificate yet.");
                return;
            }

            setParticipant(data.participant);
            setIsEligible(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas || !participant) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        canvas.width = 1200;
        canvas.height = 800;

        // Load and draw the certificate template
        const img = new Image();
        img.crossOrigin = "anonymous";
        // Try SVG first, fall back to PNG if not found
        img.src = "/certificate-template.svg";

        img.onload = () => {
            // Draw the template
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Add participant name (centered at Y: 420px)
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "#1a202c";
            ctx.textAlign = "center";
            ctx.fillText(participant.name, canvas.width / 2, 420);

            // Add badges earned text (centered at Y: 520px)
            ctx.font = "32px Arial";
            ctx.fillStyle = "#4a5568";
            ctx.fillText(
                `${participant.badges} Badge${participant.badges !== 1 ? "s" : ""} Earned`,
                canvas.width / 2,
                520
            );

            setCertificateGenerated(true);
        };

        img.onerror = () => {
            // Fallback: Create a simple certificate without template
            ctx.fillStyle = "#f7fafc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add border
            ctx.strokeStyle = "#3182ce";
            ctx.lineWidth = 20;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

            // Add title
            ctx.font = "bold 48px Arial";
            ctx.fillStyle = "#2d3748";
            ctx.textAlign = "center";
            ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 180);

            // Add subtitle
            ctx.font = "28px Arial";
            ctx.fillStyle = "#4a5568";
            ctx.fillText("GDG OAU Badge Sprint", canvas.width / 2, 240);

            // Add "This certifies that"
            ctx.font = "24px Arial";
            ctx.fillText("This certifies that", canvas.width / 2, 320);

            // Add participant name
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "#1a202c";
            ctx.fillText(participant.name, canvas.width / 2, 420);

            // Add badges earned text
            ctx.font = "32px Arial";
            ctx.fillStyle = "#4a5568";
            ctx.fillText(
                `${participant.badges} Badge${participant.badges !== 1 ? "s" : ""} Earned`,
                canvas.width / 2,
                520
            );

            // Add signature line
            ctx.strokeStyle = "#4a5568";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 150, 720);
            ctx.lineTo(canvas.width / 2 + 150, 720);
            ctx.stroke();

            ctx.font = "18px Arial";
            ctx.fillText("GDG OAU Organizer", canvas.width / 2, 750);

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
                                    📥 Download CertificateEarned
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
