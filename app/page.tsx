"use client";

import Image from "next/image";
import { useState } from "react";

// Mock data - will be replaced with API data later
const leaderboardData = [
  { id: 1, name: "Adewale Johnson", badges: 28, posts: 15, points: 710 },
  { id: 2, name: "Chioma Okafor", badges: 25, posts: 18, points: 685 },
  { id: 3, name: "Ibrahim Musa", badges: 24, posts: 12, points: 660 },
  { id: 4, name: "Funke Adeleke", badges: 22, posts: 10, points: 610 },
  { id: 5, name: "Emeka Nwosu", badges: 20, posts: 14, points: 590 },
  { id: 6, name: "Aisha Bello", badges: 19, posts: 11, points: 560 },
  { id: 7, name: "Oluwaseun Peters", badges: 18, posts: 9, points: 525 },
  { id: 8, name: "Grace Okoro", badges: 17, posts: 13, points: 510 },
  { id: 9, name: "Tunde Bakare", badges: 16, posts: 8, points: 480 },
  { id: 10, name: "Blessing Eze", badges: 15, posts: 10, points: 460 },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = leaderboardData.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 3 Podium */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Top Performers
            </h2>
            <p className="text-lg text-gray-600">Leading the way in badges and contributions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    {leaderboardData[1].name}
                  </h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mb-6">
                    {leaderboardData[1].points}
                    <span className="text-base font-medium text-gray-500 ml-1">
                      points
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-red-600">
                        {leaderboardData[1].badges}
                      </div>
                      <div className="text-gray-700 text-sm font-medium">Badges</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-green-600">
                        {leaderboardData[1].posts}
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
                    {leaderboardData[0].name}
                  </h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent mb-8">
                    {leaderboardData[0].points}
                    <span className="text-lg font-medium text-gray-600 ml-2">
                      points
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                      <div className="text-4xl font-bold text-red-600">
                        {leaderboardData[0].badges}
                      </div>
                      <div className="text-gray-700 text-sm font-medium mt-1">Badges</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                      <div className="text-4xl font-bold text-green-600">
                        {leaderboardData[0].posts}
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
                    {leaderboardData[2].name}
                  </h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-6">
                    {leaderboardData[2].points}
                    <span className="text-base font-medium text-gray-500 ml-1">
                      points
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-red-600">
                        {leaderboardData[2].badges}
                      </div>
                      <div className="text-gray-700 text-sm font-medium">Badges</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-green-600">
                        {leaderboardData[2].posts}
                      </div>
                      <div className="text-gray-700 text-sm font-medium">Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-500"
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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-8 py-5">
              <div className="grid grid-cols-12 gap-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">Participant</div>
                <div className="col-span-2 text-center">Badges</div>
                <div className="col-span-2 text-center">Posts</div>
                <div className="col-span-2 text-center">Points</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">No results found</p>
                  <p className="text-gray-500">Try searching with a different name</p>
                </div>
              ) : (
                filteredData.map((participant, index) => {
                  const actualRank = leaderboardData.findIndex(p => p.id === participant.id) + 1;
                  return (
                    <div
                      key={participant.id}
                      className={`px-8 py-5 hover:bg-gray-50 transition-all duration-200 ${actualRank <= 3 ? "bg-blue-50/30" : ""
                        } ${searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                          ? "ring-2 ring-inset ring-blue-400 bg-blue-50"
                          : ""
                        }`}
                    >
                      <div className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-1 text-center">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mx-auto text-base shadow-sm ${actualRank === 1
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
                        <div className="col-span-5">
                          <span className="font-semibold text-gray-900 text-base">
                            {participant.name}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-10 rounded-xl font-bold bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm">
                            {participant.badges}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-10 rounded-xl font-bold bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                            {participant.posts}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
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
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  👥
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {leaderboardData.length}
                  </div>
                  <div className="text-gray-600 font-medium">Participants</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  🎖️
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {leaderboardData.reduce((sum, p) => sum + p.badges, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Total Badges</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  📱
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {leaderboardData.reduce((sum, p) => sum + p.posts, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Social Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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