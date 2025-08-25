import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RoomAvailabilityChart = ({ data }) => {
  const chartRef = useRef(null);

  // Destroy chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Sort rooms by usage (descending)
  const sortedData = [...data].sort((a, b) => b.usage - a.usage);

  const chartData = {
    labels: sortedData.map(room => room.name),
    datasets: [{
      label: 'Weekly Usage (hours)',
      data: sortedData.map(room => room.usage),
      backgroundColor: 'rgba(40, 167, 69, 0.7)',
      borderColor: 'rgba(40, 167, 69, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} hours this week`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours Used',
          color: '#666',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        title: {
          display: true,
          text: 'Meeting Rooms',
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="room-analytics-container">
      <div className="chart-container" style={{ height: '250px' }}>
        <Bar 
          ref={chartRef}
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
      
      <div className="room-status-list">
        <h4>Room Availability</h4>
        <div className="rooms-grid">
          {sortedData.map(room => (
            <div key={room.name} className={`room-status-item ${room.available ? 'available' : 'booked'}`}>
              <span className="room-name">{room.name}</span>
              <span className="room-status">
                {room.available ? 'Available' : 'Booked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityChart;