import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainView from './components/MainView';
import PodcastDetail from './components/PodcastDetail';
import EpisodeDetail from './components/EpisodeDetail';
import PlaylistsView from './components/PlaylistsView';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { PlaylistProvider } from './contexts/PlaylistContext';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PlaylistProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<MainView />} />
              <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
              <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetail />} />
              <Route path="/playlists" element={<PlaylistsView />} />
            </Routes>
          </Router>
        </PlaylistProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
