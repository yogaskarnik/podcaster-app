import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AudioPlayer from './AudioPlayer';
import { LoadingSpinner } from './common/States';

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch episode details here
    // For now, we'll simulate loading
    setTimeout(() => {
      setEpisode({
        trackId: episodeId,
        trackName: 'Sample Episode',
        description: 'This is a sample episode description.',
        enclosureUrl: 'https://example.com/episode.mp3'
      });
      setLoading(false);
    }, 1000);
  }, [episodeId]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Link to={`/podcast/${podcastId}`} className="btn btn-outline-secondary">
            ← Back to Podcast
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{episode.trackName}</Card.Title>
              <Card.Text>{episode.description}</Card.Text>
              <AudioPlayer episode={episode} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EpisodeDetail;
