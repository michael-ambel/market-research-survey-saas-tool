"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaChartBar, FaQuestionCircle } from "react-icons/fa";

interface Response {
  _id: string;
  surveyId: string;
  answers: string[];
  createdAt: Date;
}

interface Survey {
  _id: string;
  title: string;
  questions: string[];
  responses: Response[];
  createdAt: Date;
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/getUserSurveys", {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/signin");
            return;
          }
          throw new Error("Failed to fetch surveys");
        }

        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
      >
        Your Surveys
      </motion.h1>

      {/* Surveys List */}
      <div className="space-y-4">
        {surveys.map((survey, index) => (
          <motion.div
            key={survey._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Survey Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FaChartBar className="text-blue-500 dark:text-blue-400" />
                {survey.title}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {survey.responses.length} responses
              </span>
            </div>

            {/* Questions and Responses */}
            <div className="space-y-3">
              {survey.questions.map((question, qIndex) => (
                <div key={qIndex}>
                  <div className="flex items-center gap-2 mb-2">
                    <FaQuestionCircle className="text-purple-500 dark:text-purple-400" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {question}
                    </p>
                  </div>
                  <div className="pl-6 space-y-1">
                    {survey.responses.map((response, rIndex) => (
                      <p
                        key={rIndex}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="font-medium">
                          Response {rIndex + 1}:
                        </span>{" "}
                        {response.answers[qIndex]}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
