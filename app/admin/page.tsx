"use client";

import { useState, useEffect } from "react";

interface Participant {
    id: number;
    name: string;
    email?: string;
    badges: number;
    posts: number;
    points: number;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Participant>({
        id: 0,
        name: "",
        email: "",
        badges: 0,
        posts: 0,
        points: 0,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [batchInput, setBatchInput] = useState("");
    const [showBatchImport, setShowBatchImport] = useState(false);

    // Simple password check - replace with proper auth in production
    const ADMIN_PASSWORD = "gdgoau2026"; // Change this!

    useEffect(() => {
        if (isAuthenticated) {
            fetchParticipants();
        }
    }, [isAuthenticated]);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/participants');

            if (!response.ok) {
                throw new Error('Failed to fetch participants');
            }

            const data = await response.json();
            setParticipants(data.participants || []);
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setErrorMessage("");
        } else {
            setErrorMessage("Invalid password");
        }
    };

    const calculatePoints = (badges: number, posts: number) => {
        // 25 points per badge, 10 points per post
        return badges * 25 + posts * 10;
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            id: 0,
            name: "",
            email: "",
            badges: 0,
            posts: 0,
            points: 0,
        });
    };

    const handleEdit = (participant: Participant) => {
        setIsAdding(false);
        setEditingId(participant.id);
        setFormData(participant);
    };

    const handleSave = async () => {
        try {
            setErrorMessage("");
            setSuccessMessage("");

            const payload = {
                name: formData.name,
                email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                badges: formData.badges,
                posts: formData.posts,
            };

            if (isAdding) {
                const response = await fetch('/api/participants', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to create participant');
                }

                setSuccessMessage('Participant added successfully!');
            } else {
                const response = await fetch(`/api/participants/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to update participant');
                }

                setSuccessMessage('Participant updated successfully!');
            }

            setIsAdding(false);
            setEditingId(null);
            setFormData({ id: 0, name: "", email: "", badges: 0, posts: 0, points: 0 });

            // Refresh the list
            await fetchParticipants();

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this participant?")) {
            return;
        }

        try {
            setErrorMessage("");
            const response = await fetch(`/api/participants/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete participant');
            }

            setSuccessMessage('Participant deleted successfully!');
            await fetchParticipants();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ id: 0, name: "", email: "", badges: 0, posts: 0, points: 0 });
    };

    const handleBatchImport = async () => {
        try {
            setErrorMessage("");
            setSuccessMessage("");

            const lines = batchInput.trim().split("\n");
            const batchParticipants: any[] = [];

            for (const line of lines) {
                if (!line.trim()) continue;

                // Expected format: Name, Badges, Posts (comma or tab separated)
                const parts = line.split(/[,\t]/).map(p => p.trim());

                if (parts.length >= 3) {
                    const name = parts[0];
                    const badges = parseInt(parts[1]) || 0;
                    const posts = parseInt(parts[2]) || 0;
                    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;

                    batchParticipants.push({
                        name,
                        email,
                        badges,
                        posts,
                    });
                }
            }

            if (batchParticipants.length === 0) {
                setErrorMessage("No valid participants found in input");
                return;
            }

            const response = await fetch('/api/participants/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participants: batchParticipants }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Batch import failed');
            }

            const result = await response.json();
            setSuccessMessage(
                `Batch import completed! Created: ${result.results.created}, Updated: ${result.results.updated}, Errors: ${result.results.errors.length}`
            );

            setBatchInput("");
            setShowBatchImport(false);
            await fetchParticipants();

            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    if (!isAuthenticated) {
    } catch (error) {
        alert("Error processing batch import. Please check the format.");
    }
}; if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-2xl">G</span>
                        </div>
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-md -ml-2">
                            <span className="text-white font-bold text-2xl">D</span>
                        </div>
                        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md -ml-2">
                            <span className="text-white font-bold text-2xl">G</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Access
                    </h1>
                    <p className="text-gray-600">Enter password to manage participants</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Leaderboard
                    </a>
                </div>
            </div>
        </div>
    );
}

const sortedParticipants = [...participants].sort((a, b) => b.points - a.points);

return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-md -ml-1.5">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md -ml-1.5">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Manage Badge Sprint Participants
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        >
                            View Leaderboard
                        </a>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-700">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                    {errorMessage}
                </div>
            )}
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                            👥
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                {participants.length}
                            </p>
                            <p className="text-gray-600 font-medium">Total Participants</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-2xl">
                            🎖️
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                {participants.reduce((sum, p) => sum + p.badges, 0)}
                            </p>
                            <p className="text-gray-600 font-medium">Total Badges</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl">
                            📱
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                {participants.reduce((sum, p) => sum + p.posts, 0)}
                            </p>
                            <p className="text-gray-600 font-medium">Total Posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
                <button
                    onClick={handleAdd}
                    disabled={isAdding || editingId !== null}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add New Participant
                </button>
                <button
                    onClick={() => setShowBatchImport(!showBatchImport)}
                    disabled={isAdding || editingId !== null}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    📋 Batch Import
                </button>
            </div>

            {/* Batch Import Form */}
            {showBatchImport && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Batch Import Participants
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Enter participant data, one per line. Format: <strong>Name, Badges, Posts</strong>
                        <br />
                        Example: John Doe, 25, 10
                    </p>
                    <textarea
                        value={batchInput}
                        onChange={(e) => setBatchInput(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-mono text-sm text-gray-900 min-h-[200px]"
                        placeholder="Adewale Johnson, 28, 15&#10;Chioma Okafor, 25, 18&#10;Ibrahim Musa, 24, 12"
                    />
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleBatchImport}
                            disabled={!batchInput.trim()}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Import All
                        </button>
                        <button
                            onClick={() => {
                                setShowBatchImport(false);
                                setBatchInput("");
                            }}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editingId !== null) && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {isAdding ? "Add New Participant" : "Edit Participant"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                placeholder="Full name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Badges
                            </label>
                            <input
                                type="number"
                                value={formData.badges}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        badges: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Posts
                            </label>
                            <input
                                type="number"
                                value={formData.posts}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        posts: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Points (Auto)
                            </label>
                            <input
                                type="number"
                                value={calculatePoints(formData.badges, formData.posts)}
                                disabled
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSave}
                            disabled={!formData.name}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Participants Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">
                                    Badges
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">
                                    Posts
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">
                                    Points
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedParticipants.map((participant, index) => (
                                <tr
                                    key={participant.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${index === 0
                                                ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                                                : index === 1
                                                    ? "bg-gradient-to-br from-gray-300 to-gray-400"
                                                    : index === 2
                                                        ? "bg-gradient-to-br from-orange-400 to-orange-500"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {participant.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-16 h-8 rounded-lg font-bold bg-red-100 text-red-700">
                                            {participant.badges}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-16 h-8 rounded-lg font-bold bg-green-100 text-green-700">
                                            {participant.posts}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">
                                        {participant.points}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(participant)}
                                                disabled={isAdding || editingId !== null}
                                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(participant.id)}
                                                disabled={isAdding || editingId !== null}
                                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note */}
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Points are automatically calculated (Badges × 25 + Posts × 10).
                    Changes are currently stored in browser memory only. Connect to a database to persist data.
                </p>
            </div>
        </main>
    </div>
);
}
