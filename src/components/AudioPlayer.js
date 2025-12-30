import React, { useState, useRef, useEffect } from 'react';
import { useEpisodeProgress } from '../hooks/useEpisodeProgress';
import './AudioPlayer.css';

const AudioPlayer = ({ episode, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();
  const progressRef = useRef();
  const { progress, updateProgress, isCompleted } = useEpisodeProgress(episode?.trackId);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      updateProgress(audio.currentTime, audio.duration);
      onProgress?.(audio.currentTime, audio.duration);
    };
    const updateDuration = () => {
      setDuration(audio.duration);
      if (progress > 0 && progress < 95) {
        audio.currentTime = (progress / 100) * audio.duration;
      }
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [progress, updateProgress, onProgress]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = e.target.offsetWidth;
    audio.currentTime = (clickX / width) * duration;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!episode?.enclosureUrl) return null;

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="audio-player p-3 border rounded" role="region" aria-label="Audio player">
      <audio 
        ref={audioRef} 
        src={episode.enclosureUrl}
        aria-label={`Audio for ${episode.trackName}`}
      />
      
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-primary" 
          onClick={togglePlay}
          onKeyDown={handleKeyDown}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="flex-grow-1">
          <div 
            ref={progressRef}
            className="progress" 
            style={{ cursor: 'pointer' }}
            onClick={handleSeek}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progressPercent}
            aria-label="Seek audio position"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                audioRef.current.currentTime = Math.max(0, currentTime - 10);
              } else if (e.key === 'ArrowRight') {
                audioRef.current.currentTime = Math.min(duration, currentTime + 10);
              }
            }}
          >
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="d-flex justify-content-between">
            <small className="text-muted" aria-live="polite">
              {formatTime(currentTime)} / {formatTime(duration)}
            </small>
            {isCompleted && (
              <small className="text-success" aria-label="Episode completed">
                ✓ Completed
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AudioPlayer);
