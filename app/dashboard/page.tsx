"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "../../utils/auth";

interface Survey {
  _id: string;
  title: string;
  questions: string[];
  responses: {
    answers: string[];
  }[];
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      const token = getAuthCookie();
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      try {
        const response = await fetch("/api/getUserSurveys", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
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
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-dark-background">
      <h1 className="text-2xl font-bold mb-6">Your Surveys</h1>
      {surveys.map((survey) => (
        <div
          key={survey._id}
          className="mb-6 p-4 bg-white dark:bg-dark-card rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
          <div className="space-y-4">
            {survey.questions.map((question, index) => (
              <div key={index}>
                <p className="font-medium">{question}</p>
                {survey.responses.map((response, idx) => (
                  <p key={idx} className="text-gray-600 dark:text-gray-400">
                    {response.answers[index]}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
