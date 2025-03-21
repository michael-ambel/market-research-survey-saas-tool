"use client";

import { useDarkMode } from "../context/DarkModeContext";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
