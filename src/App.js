import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { LoadingSpinner } from './components/common/States';

// Lazy load components
const MainView = React.lazy(() => import('./components/MainView'));
const PodcastDetail = React.lazy(() => import('./components/PodcastDetail'));
const EpisodeDetail = React.lazy(() => import('./components/EpisodeDetail'));
const PlaylistsView = React.lazy(() => import('./components/PlaylistsView'));

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PlaylistProvider>
          <Router>
            <Header />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<MainView />} />
                <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
                <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetail />} />
                <Route path="/playlists" element={<PlaylistsView />} />
              </Routes>
            </Suspense>
          </Router>
        </PlaylistProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
