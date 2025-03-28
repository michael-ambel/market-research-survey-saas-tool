"use client";

import { motion } from "framer-motion";
import { FaTimes, FaRobot, FaChartPie } from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import { marked } from "marked";

export default function AnalysisPopup({
  content,
  onClose,
  isLoading,
}: {
  content: string;
  onClose: () => void;
  isLoading: boolean;
}) {
  const getProcessedContent = () => {
    if (!content) return "";

    if (content.startsWith("Analysis Error:")) {
      return `
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div class="flex items-start gap-3">
            <div class="text-red-500 pt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-red-600 dark:text-red-400">Analysis Failed</h3>
              <p class="text-sm text-red-600 dark:text-red-300">${content.replace("Analysis Error: ", "")}</p>
              ${
                content.includes("timeout")
                  ? `
                <div class="mt-3 text-sm">
                  <p class="font-medium">Suggestions:</p>
                  <ul class="list-disc pl-5 space-y-1 mt-1">
                    <li>Try with fewer responses</li>
                    <li>Check your internet connection</li>
                    <li>Wait a minute and try again</li>
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    }

    return marked.parse(content);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <MdInsights className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Survey Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered analysis of your responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
                <FaRobot className="text-2xl text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Analyzing responses
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This may take a moment...
                </p>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {content.startsWith("Analysis Error:") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaChartPie className="text-purple-500" />
                    <span className="font-medium">Key Findings</span>
                  </div>
                  <div
                    className="[&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 
                    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-purple-600 [&>h3]:dark:text-purple-400"
                    dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
