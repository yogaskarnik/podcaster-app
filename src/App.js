import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainView from './components/MainView';
import PodcastDetail from './components/PodcastDetail';
import EpisodeDetail from './components/EpisodeDetail';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainView />}></Route>
        <Route path="/podcast/:podcastId" element={<PodcastDetail />}></Route>
        <Route
          path="/podcast/:podcastId/episode/:episodeId"
          element={<EpisodeDetail />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
