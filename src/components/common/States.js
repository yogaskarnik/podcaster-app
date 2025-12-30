import React from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex justify-content-center p-4">
      <div className={`spinner-border ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="alert alert-danger" role="alert">
    <h6>Error</h6>
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ message, icon = '📭' }) => (
  <div className="text-center p-5 text-muted">
    <div style={{ fontSize: '3rem' }}>{icon}</div>
    <p>{message}</p>
  </div>
);
