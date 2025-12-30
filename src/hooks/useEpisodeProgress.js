import { useState, useEffect } from 'react';

export const useEpisodeProgress = (episodeId) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`episode_${episodeId}_progress`);
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    }
  }, [episodeId]);

  const updateProgress = (currentTime, duration) => {
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
      localStorage.setItem(`episode_${episodeId}_progress`, progressPercent.toString());
    }
  };

  const markAsCompleted = () => {
    setProgress(100);
    localStorage.setItem(`episode_${episodeId}_progress`, '100');
  };

  const resetProgress = () => {
    setProgress(0);
    localStorage.removeItem(`episode_${episodeId}_progress`);
  };

  return {
    progress,
    updateProgress,
    markAsCompleted,
    resetProgress,
    isCompleted: progress >= 95 // Consider 95%+ as completed
  };
};
