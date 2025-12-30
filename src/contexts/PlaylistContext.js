import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within PlaylistProvider');
  }
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedPlaylists = localStorage.getItem('playlists');
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const savePlaylists = (newPlaylists) => {
    setPlaylists(newPlaylists);
    localStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      episodes: [],
      createdAt: new Date().toISOString()
    };
    savePlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, episode) => {
    const updated = playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, episodes: [...playlist.episodes, episode] }
        : playlist
    );
    savePlaylists(updated);
  };

  const removeFromPlaylist = (playlistId, episodeId) => {
    const updated = playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, episodes: playlist.episodes.filter(ep => ep.trackId !== episodeId) }
        : playlist
    );
    savePlaylists(updated);
  };

  const deletePlaylist = (playlistId) => {
    savePlaylists(playlists.filter(p => p.id !== playlistId));
  };

  const value = {
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
  };

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
};
