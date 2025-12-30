import React, { useState } from 'react';
import { Dropdown, Modal, Form, Button } from 'react-bootstrap';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useAuth } from '../contexts/AuthContext';

const AddToPlaylistButton = ({ episode }) => {
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playlists, addToPlaylist, createPlaylist } = usePlaylist();
  const { user } = useAuth();

  if (!user) return null;

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, episode);
  };

  const handleCreateAndAdd = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = createPlaylist(newPlaylistName.trim());
      addToPlaylist(newPlaylist.id, episode);
      setNewPlaylistName('');
      setShowModal(false);
    }
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          + Playlist
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {playlists.map(playlist => (
            <Dropdown.Item 
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
            >
              {playlist.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => setShowModal(true)}>
            + Create New Playlist
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Playlist</Modal.Title>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateAndAdd}>
            Create & Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddToPlaylistButton;
