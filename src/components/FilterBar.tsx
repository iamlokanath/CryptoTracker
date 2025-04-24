import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { sortAssetsByField } from '../features/crypto/cryptoSlice';

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#16c784' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid ${props => props.active ? '#16c784' : '#e9ecef'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#16c784' : '#f8f9fa'};
  }
`;

const SearchInput = styled.input`
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  width: 250px;
  outline: none;
  
  &:focus {
    border-color: #16c784;
  }
  
  @media (max-width: 768px) {
    width: 100%;
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

        // Also sort by appropriate field based on filter
        if (filter === 'gainers') {
            dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'desc' }));
        } else if (filter === 'losers') {
            dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'asc' }));
        } else if (filter === 'volume') {
            dispatch(sortAssetsByField({ field: 'volume24h', direction: 'desc' }));
        } else if (filter === 'marketcap') {
            dispatch(sortAssetsByField({ field: 'marketCap', direction: 'desc' }));
        }
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