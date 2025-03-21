"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
        console.log(data);
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Error checking auth status:", error);
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
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Market Research Survey Tool
        </h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your survey"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGenerateQuestions}
          disabled={loading || !isLoggedIn}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {/* Display message if user is not logged in */}
        {!isLoggedIn && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            You must be logged in to generate questions.
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
      </motion.div>

      {/* Buttons outside the form */}
      <div className="absolute top-4 right-20 space-x-2">
        {isLoggedIn ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
            >
              View Your Surveys
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all"
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/auth/signin")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/auth/signup")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Register
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
