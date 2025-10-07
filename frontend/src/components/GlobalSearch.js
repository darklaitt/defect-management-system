import { useState, useEffect } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (searchText.trim()) {
      setIsSearching(true);
      // Переходим на страницу дефектов с поиском
      navigate(`/defects?search=${encodeURIComponent(searchText.trim())}`);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchText('');
    if (location.pathname === '/defects') {
      navigate('/defects');
    }
  };

  return (
    <div style={{ minWidth: '300px' }}>
      <InputGroup size="sm">
        <Form.Control
          type="text"
          placeholder="🔍 Поиск дефектов..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {searchText && (
          <Button 
            variant="outline-secondary" 
            onClick={clearSearch}
            style={{ minWidth: '35px' }}
          >
            ✕
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleSearch}
          disabled={!searchText.trim() || isSearching}
        >
          {isSearching ? '...' : '🔍'}
        </Button>
      </InputGroup>
    </div>
  );
};

export default GlobalSearch;