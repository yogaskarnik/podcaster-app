import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import podcastService from '../services/podcastService';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MainView = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPodcast, setFilteredPodcast] = useState([]);

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

  useEffect(() => {
    const result = podcasts.filter(
      (podcast) =>
        podcast?.['im:name']?.label
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        podcast?.['im:artist']?.label
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredPodcast(result);
  }, [searchTerm, podcasts]);

  console.log('filteredPodcast ', filteredPodcast);

  return (
    <Container>
      <Row className="mb-4">
        <Col xs={8}></Col>
        <Col xs={3}>
          <input
            type="text"
            placeholder="Search for podcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {filteredPodcast?.map((podcast, index) => (
          <Col key={podcast?.id?.attributes?.['im:id']} xs={3}>
            <Link to={`/podcast/${podcast?.id?.attributes?.['im:id']}`}>
              <Card className="mb-4">
                <Card.Img variant="top" src={podcast?.['im:image'][0]?.label} />
                <Card.Body>
                  <Card.Title>{podcast?.['im:name']?.label}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Author: {podcast?.['im:artist'].label}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MainView;

/**
 * <div className="container">
      {podcasts?.map((podcast) => (
        <Link
          key={podcast?.id?.attributes?.['im:id']}
          to={`/podcast/${podcast?.id?.attributes?.['im:id']}`}
        >
          {podcast?.['im:name']?.label}
        </Link>
      ))}
    </div>
 */
