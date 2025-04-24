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
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;
  text-align: right;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  th {
    padding: 16px;
    font-weight: 600;
    font-size: 14px;
    color: #6c757d;
    white-space: nowrap;
    
    &:first-child {
      text-align: center;
    }
    
    &:nth-child(2), &:nth-child(3) {
      text-align: left;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
  
  td {
    padding: 16px;
    font-size: 14px;
    
    &:first-child {
      text-align: center;
    }
    
    &:nth-child(2), &:nth-child(3) {
      text-align: left;
    }
  }
`;

const AssetCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AssetLogo = styled.img`
  width: 32px;
  height: 32px;
`;

const AssetName = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetFullName = styled.span`
  font-weight: 600;
  color: #212529;
`;

const AssetSymbol = styled.span`
  color: #6c757d;
  font-size: 12px;
`;

const PriceChangePositive = styled.div`
  color: #16c784;
  font-weight: 600;
`;

const PriceChangeNegative = styled.div`
  color: #ea3943;
  font-weight: 600;
`;

const Supply = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SupplyInfo = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const SortableHeader = styled.th<{ isActive: boolean }>`
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: #e9ecef;
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
  }
  
  &.asc::after {
    border-bottom: 5px solid #6c757d;
  }
  
  &.desc::after {
    border-top: 5px solid #6c757d;
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