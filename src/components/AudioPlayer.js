import React, { useState, useRef, useEffect } from 'react';
import { useEpisodeProgress } from '../hooks/useEpisodeProgress';
import './AudioPlayer.css';

const AudioPlayer = ({ episode, onProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();
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
      // Resume from saved progress
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!episode?.enclosureUrl) return null;

  return (
    <div className="audio-player p-3 border rounded">
      <audio ref={audioRef} src={episode.enclosureUrl} />
      
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-primary" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="flex-grow-1">
          <div 
            className="progress" 
            style={{ cursor: 'pointer' }}
            onClick={handleSeek}
          >
            <div 
              className="progress-bar" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </small>
            {isCompleted && <small className="text-success">✓ Completed</small>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
