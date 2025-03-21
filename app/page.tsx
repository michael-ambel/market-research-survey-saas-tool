"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie, removeAuthCookie } from "../utils/auth";

export default function Home() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isLoggedIn = !!getAuthCookie();

  const handleGenerateQuestions = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      router.push(`/survey/${data.surveyId}`);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthCookie();
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-background">
      <header className="p-4 flex justify-between items-center">
        <div>
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              View Your Surveys
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => router.push("/auth/signin")}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                Register
              </button>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Market Research Survey Tool
          </h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your survey"
            className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
          />
          <button
            onClick={handleGenerateQuestions}
            disabled={loading || !isLoggedIn}
            className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
