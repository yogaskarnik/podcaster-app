import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import podcastService from '../services/podcastService';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SearchBar from './SearchBar';
import { LoadingSpinner, ErrorMessage, EmptyState } from './common/States';

const MainView = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPodcasts = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await podcastService.fetchAll(searchQuery);
      setPodcasts(data?.results || data?.feed?.entry || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleSearch = (query) => {
    fetchPodcasts(query);
  };

  const getPodcastId = (podcast) => 
    podcast?.trackId || podcast?.id?.attributes?.['im:id'];

  const getPodcastImage = (podcast) => 
    podcast?.artworkUrl100 || podcast?.['im:image']?.[0]?.label;

  const getPodcastName = (podcast) => 
    podcast?.trackName || podcast?.['im:name']?.label;

  const getPodcastArtist = (podcast) => 
    podcast?.artistName || podcast?.['im:artist']?.label;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchPodcasts()} />;

  return (
    <Container>
      <SearchBar onSearch={handleSearch} loading={loading} />
      
      {podcasts.length === 0 ? (
        <EmptyState message="No podcasts found" icon="🎙️" />
      ) : (
        <Row>
          {podcasts.map((podcast) => (
            <Col key={getPodcastId(podcast)} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={`/podcast/${getPodcastId(podcast)}`} className="text-decoration-none">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={getPodcastImage(podcast)} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      {getPodcastName(podcast)}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-truncate">
                      {getPodcastArtist(podcast)}
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MainView;
