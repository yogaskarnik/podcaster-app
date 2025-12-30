import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/usePerformance';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search podcasts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button 
          className="btn btn-outline-primary" 
          type="submit"
          disabled={loading || !query.trim()}
        >
          {loading ? '🔄' : '🔍'}
        </button>
      </div>
    </form>
  );
};

export default React.memo(SearchBar);
