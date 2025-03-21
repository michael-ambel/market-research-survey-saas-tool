"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SurveyPage({
  params,
}: {
  params: { surveyId: string };
}) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
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
  }, [params.surveyId]);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-background">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
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
              <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border border-gray-300 rounded dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              />
            </motion.div>
          ))
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Submitting..." : "Submit Survey"}
        </button>
      </motion.div>
    </div>
  );
}
