"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Participant {
  id: number;
  name: string;
  badges: number;
  posts: number;
  points: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/participants');

      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }

      const data = await response.json();
      setLeaderboardData(data.participants || []);
    } catch (err: any) {
      console.error('Error fetching participants:', err);
      setError(err.message);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = leaderboardData.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg mb-2">Crunching the results...</p>
          <p className="text-gray-500 text-sm">Analyzing badges and contributions</p>
        </div>
      </div>
    );
  }

  // Show empty state with how to participate
  if (!loading && leaderboardData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex items-center gap-1">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-md -ml-1.5">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md -ml-1.5">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">GDG OAU Badge Sprint</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">30-Day Challenge Leaderboard</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl sm:text-8xl mb-6 animate-bounce">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Crunching the Results...
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Our leaderboard is being prepared! While we compile the data,
              <br className="hidden sm:block" />
              why not join the challenge?
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border-2 border-blue-100 mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              🎯 How to Participate
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Register for the Challenge</h4>
                  <p className="text-gray-600 mb-3">
                    Sign up for the GDG OAU Badge Sprint 30-Day Learning Challenge
                  </p>
                  <a
                    href="https://gdg.community.dev/events/details/google-gdg-on-campus-obafemi-awolowo-university-ife-nigeria-presents-gdg-oau-badge-sprint-30-day-learning-challenge/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>Register Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Read the Participants Guide</h4>
                  <p className="text-gray-600 mb-3">
                    Learn how to earn badges, share posts, and climb the leaderboard
                  </p>
                  <a
                    href="https://docs.google.com/document/d/1Yfr41eErFXB9-roRWrjmry_zxPkxBrcTIg8OojfUVIU/edit?tab=t.0#heading=h.l7ivtha9s1sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>View Guide</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Join the Community</h4>
                  <p className="text-gray-600 mb-3">
                    Connect with fellow participants on Telegram
                  </p>
                  <a
                    href="https://t.me/gdgoau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.84 8.673c-.137.613-.497.76-.999.473l-2.76-2.034-1.332 1.282c-.147.147-.271.271-.556.271l.199-2.82 5.132-4.638c.223-.199-.049-.309-.346-.111l-6.34 3.992-2.732-.853c-.595-.185-.606-.595.124-.882l10.679-4.116c.495-.182.929.111.769.881z" />
                    </svg>
                    <span>Join Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              📊 What You'll Earn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-3xl mb-2">🎖️</div>
                <p className="font-semibold text-gray-900">5 points per badge</p>
                <p className="text-sm text-gray-600">Complete skill badges</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold text-gray-900">2 points per post</p>
                <p className="text-sm text-gray-600">Share on social media</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center gap-1">
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
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                  Badge Sprint 2026
                </h1>
                <p className="text-base text-gray-600 font-medium">
                  OAU Chapter Leaderboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-semibold text-gray-700">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Top 3 Podium */}
        <div className="mb-8 sm:mb-16">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Top Performers
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">Leading the way in badges and contributions</p>
          </div>

          {filteredData.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
              {/* 2nd Place */}
              <div className="md:order-1 order-2 md:mt-8">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold text-2xl">2</span>
                    </div>
                  </div>
                  <div className="text-center pt-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-gray-300">
                      <span className="text-4xl">🥈</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {filteredData[1].name}
                    </h3>
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mb-6">
                      {filteredData[1].points}
                      <span className="text-base font-medium text-gray-500 ml-1">
                        points
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-red-600">
                          {filteredData[1].badges}
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Badges</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-green-600">
                          {filteredData[1].posts}
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Posts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="md:order-2 order-1">
                <div className="relative bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50 rounded-3xl p-10 shadow-2xl border-2 border-yellow-300 hover:shadow-[0_20px_60px_-15px_rgba(250,204,21,0.5)] transition-all duration-300 hover:-translate-y-3">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 rounded-full shadow-lg border-4 border-white">
                      <span className="text-yellow-900 font-bold text-sm tracking-wider">👑 CHAMPION</span>
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full mx-auto mb-5 flex items-center justify-center shadow-2xl border-4 border-yellow-200">
                      <span className="text-6xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {filteredData[0].name}
                    </h3>
                    <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent mb-8">
                      {filteredData[0].points}
                      <span className="text-lg font-medium text-gray-600 ml-2">
                        points
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl p-5 shadow-md">
                        <div className="text-4xl font-bold text-red-600">
                          {filteredData[0].badges}
                        </div>
                        <div className="text-gray-700 text-sm font-medium mt-1">Badges</div>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-md">
                        <div className="text-4xl font-bold text-green-600">
                          {filteredData[0].posts}
                        </div>
                        <div className="text-gray-700 text-sm font-medium mt-1">Posts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 order-3 md:mt-8">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold text-2xl">3</span>
                    </div>
                  </div>
                  <div className="text-center pt-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-orange-300">
                      <span className="text-4xl">🥉</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {filteredData[2].name}
                    </h3>
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-6">
                      {filteredData[2].points}
                      <span className="text-base font-medium text-gray-500 ml-1">
                        points
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-red-600">
                          {filteredData[2].badges}
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Badges</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-green-600">
                          {filteredData[2].posts}
                        </div>
                        <div className="text-gray-700 text-sm font-medium">Posts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {filteredData.length === 0
                  ? "No participants yet. Add participants via the admin panel!"
                  : "Need at least 3 participants to show podium."}
              </p>
            </div>
          )}
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                All Participants
              </h2>
              <p className="text-gray-600">Complete leaderboard standings</p>
            </div>
            <div className="relative w-full sm:w-80 lg:w-96">
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-5 py-2 sm:py-3 pl-10 sm:pl-12 bg-gray-50 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm sm:text-base text-gray-900 placeholder-gray-500"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
              <div className="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-6 font-semibold text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
                <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
                <div className="col-span-3 sm:col-span-5">Name</div>
                <div className="col-span-2 text-center">Badges</div>
                <div className="col-span-2 text-center">Posts</div>
                <div className="col-span-3 sm:col-span-2 text-center">Points</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <div className="px-4 sm:px-8 py-12 sm:py-16 text-center">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                  <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No results found</p>
                  <p className="text-sm sm:text-base text-gray-500">Try searching with a different name</p>
                </div>
              ) : (
                filteredData.map((participant, index) => {
                  const actualRank = leaderboardData.findIndex(p => p.id === participant.id) + 1;
                  return (
                    <div
                      key={participant.id}
                      className={`px-3 sm:px-6 lg:px-8 py-3 sm:py-5 hover:bg-gray-50 transition-all duration-200 ${actualRank <= 3 ? "bg-blue-50/30" : ""
                        } ${searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                          ? "ring-2 ring-inset ring-blue-400 bg-blue-50"
                          : ""
                        }`}
                    >
                      <div className="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-6 items-center">
                        <div className="col-span-2 sm:col-span-1 text-center">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold mx-auto text-sm sm:text-base shadow-sm ${actualRank === 1
                              ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                              : actualRank === 2
                                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                : actualRank === 3
                                  ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {actualRank}
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-5">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate block">
                            {participant.name}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 rounded-lg sm:rounded-xl font-bold bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm text-xs sm:text-base">
                            {participant.badges}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 rounded-lg sm:rounded-xl font-bold bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm text-xs sm:text-base">
                            {participant.posts}
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-2 text-center">
                          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            {participant.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  👥
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {leaderboardData.length}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">Participants</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-red-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  🎖️
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {leaderboardData.reduce((sum, p) => sum + p.badges, 0)}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">Total Badges</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  📱
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {leaderboardData.reduce((sum, p) => sum + p.posts, 0)}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">Social Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center -ml-1">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center -ml-1">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">GDG OAU</p>
                <p className="text-sm text-gray-600">Obafemi Awolowo University</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-700 font-medium">
                Badge Sprint Leaderboard
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}