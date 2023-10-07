import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import podcastService from '../services/podcastService';

const MainView = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await podcastService.fetchAll();
        setPodcasts(data?.feed?.entry || []);
      } catch (error) {
        console.error('Error fetching podcast ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {podcasts?.map((podcast) => (
        <Link
          key={podcast?.id?.attributes?.['im:id']}
          to={`/podcast/${podcast?.id?.attributes?.['im:id']}`}
        >
          {podcast?.title?.label}
        </Link>
      ))}
    </div>
  );
};

export default MainView;
