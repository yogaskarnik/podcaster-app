import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ShareButton = ({ podcast, episode }) => {
  const getShareUrl = () => {
    return window.location.href;
  };

  const getShareText = () => {
    if (episode) {
      return `Check out this episode: ${episode.trackName} from ${podcast?.trackName || 'this podcast'}`;
    }
    return `Check out this podcast: ${podcast?.trackName}`;
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${getShareText()} ${getShareUrl()}`);
    // You could add a toast notification here
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        📤 Share
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={shareToTwitter}>
          🐦 Twitter
        </Dropdown.Item>
        <Dropdown.Item onClick={shareToFacebook}>
          📘 Facebook
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={copyToClipboard}>
          📋 Copy Link
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ShareButton;
