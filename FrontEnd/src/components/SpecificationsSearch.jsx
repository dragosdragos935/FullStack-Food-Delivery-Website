import React, { useState } from 'react';
import './SpecificationsSearch.css';

const SpecificationsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Mock data - replace with actual API call
  const specifications = [
    { id: 1, title: 'Monitor Specifications', content: 'Resolution: 1920x1080, Refresh Rate: 144Hz' },
    { id: 2, title: 'Laptop Specifications', content: 'Resolution: 2560x1440, Processor: Intel i7' },
    { id: 3, title: 'Smartphone Specifications', content: 'Resolution: 2340x1080, Camera: 48MP' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = specifications.filter(spec => {
      const searchLower = searchQuery.toLowerCase();
      return (
        spec.title.toLowerCase().includes(searchLower) ||
        spec.content.toLowerCase().includes(searchLower)
      );
    });

    // Calculate similarity score
    const scoredResults = results.map(result => {
      const content = `${result.title} ${result.content}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      let score = 0;
      
      // Simple similarity calculation
      if (content.includes(query)) {
        score = 1;
        // Additional scoring logic can be added here
      }
      
      return { ...result, score };
    });

    // Sort results
    const sortedResults = scoredResults.sort((a, b) => {
      return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
    });

    setSearchResults(sortedResults);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    handleSearch(); // Re-sort existing results
  };

  return (
    <div className="specifications-search">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search specifications (e.g., resolution 1920x1080)"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={toggleSortOrder} className="sort-button">
          Sort {sortOrder === 'desc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="results-container">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <h3>{result.title}</h3>
              <p>{result.content}</p>
              <div className="similarity-score">
                Similarity: {(result.score * 100).toFixed(0)}%
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <p>No results found</p>
        ) : null}
      </div>
    </div>
  );
};

export default SpecificationsSearch; 