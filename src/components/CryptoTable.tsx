import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAssets,
  sortAssetsByField,
  SortField,
  SortDirection,
  selectSortField,
  selectSortDirection
} from '../features/crypto/cryptoSlice';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import MiniChart from './MiniChart';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1300px; /* Ensure min-width for laptop screens */
  border-collapse: separate;
  border-spacing: 0;
  font-family: 'Inter', sans-serif;
  text-align: right;
  table-layout: fixed; /* Fixed layout for better column width control */
  transition: color 0.3s ease;
`;

const TableHead = styled.thead`
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  
  th {
    padding: 16px;
    font-weight: 600;
    font-size: 14px;
    color: var(--text-secondary);
    white-space: nowrap;
    position: sticky;
    top: 0;
    background-color: var(--light-bg);
    z-index: 10;
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* Optimize column widths */
    &:nth-child(1) { width: 4%; } /* # */
    &:nth-child(2) { width: 16%; } /* Name */
    &:nth-child(3) { width: 8%; } /* Price */
    &:nth-child(4) { width: 6%; } /* 1h % */
    &:nth-child(5) { width: 6%; } /* 24h % */
    &:nth-child(6) { width: 6%; } /* 7d % */
    &:nth-child(7) { width: 12%; } /* Market Cap */
    &:nth-child(8) { width: 10%; } /* 24h Volume */
    &:nth-child(9) { width: 14%; } /* Circulating Supply */
    &:nth-child(10) { width: 18%; } /* Last 7 Days */
    
    &:first-child {
      text-align: center;
      border-top-left-radius: var(--radius-lg);
    }
    
    &:last-child {
      border-top-right-radius: var(--radius-lg);
    }
    
    &:nth-child(2), &:nth-child(3) {
      text-align: left;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease, background-color 0.3s ease;
    
    &:hover {
      background-color: var(--hover-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    
    &:last-child {
      border-bottom: none;
      
      td:first-child {
        border-bottom-left-radius: var(--radius-lg);
      }
      
      td:last-child {
        border-bottom-right-radius: var(--radius-lg);
      }
    }
  }
  
  td {
    padding: 16px;
    font-size: 14px;
    vertical-align: middle;
    transition: color 0.3s ease;
    
    &:first-child {
      text-align: center;
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    &:nth-child(2), &:nth-child(3) {
      text-align: left;
    }
  }
`;

const AssetCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AssetLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  background-color: white;
  padding: 2px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.15);
  }
`;

const AssetName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AssetFullName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const AssetSymbol = styled.span`
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
`;

const PriceChangePositive = styled.div`
  color: var(--success-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid var(--success-color);
  }
`;

const PriceChangeNegative = styled.div`
  color: var(--danger-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--danger-color);
  }
`;

const Supply = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SupplyInfo = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const SortableHeader = styled.th<{ isActive: boolean }>`
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--hover-medium);
    color: var(--primary-color);
  }
  
  &::after {
    content: ${props => props.isActive ? '""' : 'none'};
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transition: transform 0.2s ease;
  }
  
  &.asc::after {
    border-bottom: 5px solid var(--primary-color);
  }
  
  &.desc::after {
    border-top: 5px solid var(--primary-color);
  }
`;

interface SortableHeaderCellProps {
  field: SortField;
  label: string;
  currentSortField: SortField;
  currentSortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableHeaderCell: React.FC<SortableHeaderCellProps> = ({
  field,
  label,
  currentSortField,
  currentSortDirection,
  onSort
}) => {
  const isActive = currentSortField === field;
  const className = isActive ? currentSortDirection : '';

  return (
    <SortableHeader
      isActive={isActive}
      className={className}
      onClick={() => onSort(field)}
    >
      {label}
    </SortableHeader>
  );
};

const CryptoTable: React.FC = () => {
  const assets = useSelector(selectAssets);
  const sortField = useSelector(selectSortField);
  const sortDirection = useSelector(selectSortDirection);
  const dispatch = useDispatch();

  const handleSort = (field: SortField) => {
    dispatch(sortAssetsByField({ field }));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <tr>
            <SortableHeaderCell
              field="rank"
              label="#"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="name"
              label="Name"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="price"
              label="Price"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="priceChange1h"
              label="1h %"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="priceChange24h"
              label="24h %"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="priceChange7d"
              label="7d %"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="marketCap"
              label="Market Cap"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="volume24h"
              label="24h Volume"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeaderCell
              field="circulatingSupply"
              label="Circulating Supply"
              currentSortField={sortField}
              currentSortDirection={sortDirection}
              onSort={handleSort}
            />
            <th>Last 7 Days</th>
          </tr>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.rank}</td>
              <td>
                <AssetCell>
                  <AssetLogo src={asset.logo} alt={asset.name} />
                  <AssetName>
                    <AssetFullName>{asset.name}</AssetFullName>
                    <AssetSymbol>{asset.symbol}</AssetSymbol>
                  </AssetName>
                </AssetCell>
              </td>
              <td>{formatCurrency(asset.price)}</td>
              <td>
                {asset.priceChange1h > 0 ? (
                  <PriceChangePositive>{formatPercentage(asset.priceChange1h)}</PriceChangePositive>
                ) : (
                  <PriceChangeNegative>{formatPercentage(asset.priceChange1h)}</PriceChangeNegative>
                )}
              </td>
              <td>
                {asset.priceChange24h > 0 ? (
                  <PriceChangePositive>{formatPercentage(asset.priceChange24h)}</PriceChangePositive>
                ) : (
                  <PriceChangeNegative>{formatPercentage(asset.priceChange24h)}</PriceChangeNegative>
                )}
              </td>
              <td>
                {asset.priceChange7d > 0 ? (
                  <PriceChangePositive>{formatPercentage(asset.priceChange7d)}</PriceChangePositive>
                ) : (
                  <PriceChangeNegative>{formatPercentage(asset.priceChange7d)}</PriceChangeNegative>
                )}
              </td>
              <td>{formatCurrency(asset.marketCap)}</td>
              <td>{formatLargeNumber(asset.volume24h)}</td>
              <td>
                <Supply>
                  <span>{formatLargeNumber(asset.circulatingSupply)} {asset.symbol}</span>
                  {asset.maxSupply && (
                    <SupplyInfo>
                      {((asset.circulatingSupply / asset.maxSupply) * 100).toFixed(2)}% of {formatLargeNumber(asset.maxSupply)}
                    </SupplyInfo>
                  )}
                </Supply>
              </td>
              <td>
                <MiniChart
                  data={asset.chartData}
                  isPositive={asset.priceChange7d > 0}
                />
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoTable; 