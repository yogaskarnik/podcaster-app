import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useAuth } from '../contexts/AuthContext';
import { EmptyState } from './common/States';

const PlaylistsView = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playlists, createPlaylist, deletePlaylist } = usePlaylist();
  const { user } = useAuth();

  if (!user) {
    return (
      <Container>
        <EmptyState message="Please login to view your playlists" icon="🔒" />
      </Container>
    );
  }

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreate(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>My Playlists</h3>
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              + Create Playlist
            </Button>
          </div>
        </Col>
      </Row>

      {playlists.length === 0 ? (
        <EmptyState message="No playlists yet. Create your first playlist!" icon="📝" />
      ) : (
        <Row>
          {playlists.map(playlist => (
            <Col key={playlist.id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{playlist.name}</Card.Title>
                  <Card.Text>
                    {playlist.episodes.length} episodes
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      View
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlaylistsView;
