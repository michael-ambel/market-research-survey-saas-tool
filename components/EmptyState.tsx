"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  action: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        {action}
      </div>
    </div>
  );
}
