import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import podcastService from '../services/podcastService';
import AudioPlayer from './AudioPlayer';
import AddToPlaylistButton from './AddToPlaylistButton';
import { LoadingSpinner, ErrorMessage } from './common/States';

const PodcastDetail = () => {
  const { podcastId } = useParams();
  const [podcastInfo, setPodcastInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await podcastService.fetchById(podcastId);
        const results = data.results || [];
        
        setPodcastInfo(results[0]);
        setEpisodes(results.slice(1));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [podcastId]);

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!podcastInfo) return <ErrorMessage message="Podcast not found" />;

  return (
    <Container>
      <Row>
        <Col xs={12} md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src={podcastInfo.artworkUrl600 || podcastInfo.artworkUrl100} />
            <Card.Body>
              <Card.Title>{podcastInfo.trackName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                by {podcastInfo.artistName}
              </Card.Subtitle>
              <Card.Text className="small">
                {podcastInfo.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={8}>
          <div className="mb-3">
            <h5>Episodes ({episodes.length})</h5>
          </div>
          
          {currentEpisode && (
            <AudioPlayer 
              episode={currentEpisode} 
              onProgress={(progress) => console.log('Progress:', progress)}
            />
          )}
          
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {episodes.map((episode, index) => (
                <tr key={episode.trackId || index}>
                  <td>
                    <Link 
                      to={`/podcast/${podcastId}/episode/${episode.trackId}`}
                      className="text-decoration-none"
                    >
                      {episode.trackName}
                    </Link>
                  </td>
                  <td>{formatDate(episode.releaseDate)}</td>
                  <td>{formatDuration(episode.trackTimeMillis)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setCurrentEpisode({
                          ...episode,
                          enclosureUrl: episode.episodeUrl || episode.previewUrl
                        })}
                      >
                        ▶️
                      </button>
                      <AddToPlaylistButton episode={episode} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default PodcastDetail;
