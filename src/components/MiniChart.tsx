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
  width: 160px;
  height: 60px;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 40px;
  }
`;

const MiniChart: React.FC<MiniChartProps> = ({ data, isPositive }) => {
    const positiveColor = 'rgba(22, 199, 132, 1)';
    const negativeColor = 'rgba(234, 57, 67, 1)';
    const positiveGradient = 'rgba(22, 199, 132, 0.1)';
    const negativeGradient = 'rgba(234, 57, 67, 0.1)';

    const chartData = {
        labels: ['', '', '', '', '', '', ''], // Empty labels for 7 days
        datasets: [
            {
                data: data,
                borderColor: isPositive ? positiveColor : negativeColor,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: isPositive ? positiveColor : negativeColor,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                tension: 0.3,
                fill: true,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 60);
                    if (isPositive) {
                        gradient.addColorStop(0, positiveGradient);
                        gradient.addColorStop(1, 'rgba(22, 199, 132, 0)');
                    } else {
                        gradient.addColorStop(0, negativeGradient);
                        gradient.addColorStop(1, 'rgba(234, 57, 67, 0)');
                    }
                    return gradient;
                },
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(20, 30, 51, 0.9)',
                titleFont: {
                    family: 'Inter',
                    size: 12,
                },
                bodyFont: {
                    family: 'Inter',
                    size: 12,
                },
                padding: 8,
                cornerRadius: 4,
                displayColors: false,
            },
        },
        scales: {
            x: {
                display: false,
                grid: {
                    display: false,
                }
            },
            y: {
                display: false,
                grid: {
                    display: false,
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            line: {
                cubicInterpolationMode: 'monotone',
            }
        }
    };

    return (
        <ChartContainer>
            <Line data={chartData} options={options} />
        </ChartContainer>
    );
};

export default MiniChart; 