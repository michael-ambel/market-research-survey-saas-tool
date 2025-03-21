"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function SurveyPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!params?.surveyId) return;

    const fetchSurvey = async () => {
      try {
        const response = await fetch(
          `/api/getSurvey?surveyId=${params.surveyId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch survey");
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error(error);
        setError("Failed to load survey questions. Please try again.");
      }
    };

    fetchSurvey();
  }, [params?.surveyId]);

  const handleSubmit = async () => {
    if (answers.some((answer) => !answer.trim())) {
      alert("Please answer all questions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/submitSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ surveyId: params.surveyId, answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      router.push("/confirmation");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          Survey Questions
        </h1>
        {error ? (
          <p className="text-red-600 text-center mb-4">{error}</p>
        ) : (
          questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                {question}
              </label>
              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          ))
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Submitting..." : "Submit Survey"}
        </button>
      </motion.div>
    </div>
  );
}
