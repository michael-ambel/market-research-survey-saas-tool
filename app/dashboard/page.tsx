"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaQuestionCircle,
  FaShareAlt,
  FaMagic,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnalysisPopup from "../../components/AnalysisPopup";
import EmptyState from "../../components/EmptyState";
import type { PopulatedSurvey, IResponse } from "../../types/types";

interface DashboardSurvey extends Omit<PopulatedSurvey, "responses"> {
  _id: string;
  responses: Array<Omit<IResponse, "surveyId">>;
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<DashboardSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisContent, setAnalysisContent] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/getUserSurveys", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch surveys");
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Fetch surveys error:", error);
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [router]);

  const handleShare = (surveyId: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/survey/${surveyId}`
    );
    alert("Survey link copied to clipboard!");
  };

  const analyzeResponses = async (surveyId: string) => {
    try {
      setIsAnalyzing(true);
      setShowAnalysis(true);
      setAnalysisContent("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `/api/analyzeResponses?surveyId=${surveyId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Analysis failed with status: ${response.status}`
        );
      }

      const { insights } = await response.json();
      setAnalysisContent(insights);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisContent(
        `Analysis Error: ${(error as Error).message || "Unknown error occurred"}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getChartData = (survey: DashboardSurvey) => {
    return survey.questions.map((question, index) => ({
      question: `Q${index + 1}`,
      responses: survey.responses.filter((res) => res.answers[index]?.trim())
        .length,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">
          Loading surveys...
        </div>
      </div>
    );
  }

  if (!loading && surveys.length === 0) {
    return (
      <EmptyState
        title="No surveys yet"
        description="Create your first survey to get started"
        action={
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Survey
          </button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Your Surveys
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey, index) => (
          <motion.div
            key={survey._id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3 h-[90px]">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <FaChartBar className="text-blue-500" />
                  {survey.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(survey.createdAt).toLocaleDateString()} •{" "}
                  {survey.responses.length} responses
                </p>
              </div>
              <button
                onClick={() => handleShare(survey._id.toString())}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Share survey"
              >
                <FaShareAlt className="text-gray-600 dark:text-gray-400 text-sm" />
              </button>
            </div>

            <div className="mb-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData(survey)}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="question"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="responses"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => analyzeResponses(survey._id.toString())}
                disabled={isAnalyzing}
                className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 text-sm rounded-lg transition-colors disabled:opacity-70 ${
                  isAnalyzing
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    : "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-700"
                }`}
              >
                <FaMagic className="inline" />
                {isAnalyzing ? "Analyzing..." : "Analyze Responses"}
              </button>

              <div className="space-y-2">
                {survey.questions.map((question, qIndex) => (
                  <div key={qIndex} className="group">
                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <FaQuestionCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-tight">{question}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAnalysis && (
        <AnalysisPopup
          content={analysisContent}
          onClose={() => setShowAnalysis(false)}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
}
