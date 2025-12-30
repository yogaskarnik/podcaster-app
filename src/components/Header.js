import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🎙️ Podcaster App
          </Navbar.Brand>
          
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/playlists">
                  My Playlists
                </Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" size="sm">
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Button variant="outline-primary" size="sm" onClick={() => setShowLogin(true)}>
                Login
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
