import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface MiniChartProps {
    data: number[];
    isPositive: boolean;
}

const ChartContainer = styled.div`
  width: 120px;
  height: 50px;

  @media (max-width: 768px) {
    width: 80px;
    height: 40px;
  }
`;

const MiniChart: React.FC<MiniChartProps> = ({ data, isPositive }) => {
    const chartData = {
        labels: ['', '', '', '', '', '', ''], // Empty labels for 7 days
        datasets: [
            {
                data: data,
                borderColor: isPositive ? '#16c784' : '#ea3943',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1,
                fill: false,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };

    return (
        <ChartContainer>
            <Line data={chartData} options={options} />
        </ChartContainer>
    );
};

export default MiniChart; 