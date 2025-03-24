"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaRobot, FaChartLine, FaShareAlt } from "react-icons/fa";

export default function Home() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        if (error) {
          console.error("Error checking auth status:", error);
        }
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

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
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Survey Tool
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create engaging surveys, analyze responses, and gain insights with AI
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your survey topic"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerateQuestions}
            disabled={loading || !isLoggedIn}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate AI Questions"}
          </button>

          {!isLoggedIn && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Please login to create surveys
            </p>
          )}
          {!error && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {error}
            </p>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaRobot className="text-blue-500 text-xl" />
            <h3 className="font-semibold">AI Question Generation</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automatically generate relevant survey questions
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaChartLine className="text-purple-500 text-xl" />
            <h3 className="font-semibold">Response Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visualize survey responses with interactive charts
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaShareAlt className="text-green-500 text-xl" />
            <h3 className="font-semibold">Easy Sharing</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share surveys with a single link
          </p>
        </motion.div>
      </div>

      {/* Auth Buttons */}
      <div className="fixed top-4 right-[100px] flex gap-2">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/auth/signin")}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-100 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
