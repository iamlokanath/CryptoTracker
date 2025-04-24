import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { sortAssetsByField } from '../features/crypto/cryptoSlice';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 6px;
  background-color: var(--card-bg);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    border-radius: var(--radius-lg);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--hover-medium)'};
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* Add icons */
  &::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 14px;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: ${props => props.active ? 1 : 0.7};
  }
  
  &:nth-child(1)::before { /* All */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${props => props.active ? 'ffffff' : '6b7280'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16'/%3E%3C/svg%3E");
  }
  
  &:nth-child(2)::before { /* Gainers */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${props => props.active ? 'ffffff' : '16c784'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'/%3E%3C/svg%3E");
  }
  
  &:nth-child(3)::before { /* Losers */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${props => props.active ? 'ffffff' : 'ea3943'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'/%3E%3C/svg%3E");
  }
  
  &:nth-child(4)::before { /* Volume */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${props => props.active ? 'ffffff' : '6b7280'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/%3E%3C/svg%3E");
  }
  
  &:nth-child(5)::before { /* Market Cap */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${props => props.active ? 'ffffff' : '6b7280'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/%3E%3C/svg%3E");
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 12px 16px 12px 40px;
  background-color: var(--light-bg);
  color: var(--text-primary);
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 20px;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(56, 97, 251, 0.2);
  }
  
  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
`;

interface FilterBarProps {
  onFilter: (filter: string) => void;
  onSearch: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter, onSearch }) => {
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    try {
      return localStorage.getItem('cryptoFilter') || 'all';
    } catch (error) {
      return 'all';
    }
  });

  const [searchTerm, setSearchTerm] = useState<string>(() => {
    try {
      return localStorage.getItem('cryptoSearch') || '';
    } catch (error) {
      return '';
    }
  });

  const dispatch = useDispatch();

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilter(filter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => handleFilterClick('all')}
        >
          All
        </FilterButton>
        <FilterButton
          active={activeFilter === 'gainers'}
          onClick={() => handleFilterClick('gainers')}
        >
          Top Gainers
        </FilterButton>
        <FilterButton
          active={activeFilter === 'losers'}
          onClick={() => handleFilterClick('losers')}
        >
          Top Losers
        </FilterButton>
        <FilterButton
          active={activeFilter === 'volume'}
          onClick={() => handleFilterClick('volume')}
        >
          By Volume
        </FilterButton>
        <FilterButton
          active={activeFilter === 'marketcap'}
          onClick={() => handleFilterClick('marketcap')}
        >
          By Market Cap
        </FilterButton>
      </FilterGroup>
      <SearchInput
        type="text"
        placeholder="Search cryptocurrency..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </FilterContainer>
  );
};

export default FilterBar; 