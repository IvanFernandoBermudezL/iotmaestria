import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SensorChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });

  // Function to fetch sensor data
  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const labels = data.map(item => new Date(item.timestamp * 1000).toLocaleTimeString());
        const dataPoints = data.map(item => item.sensor);
        setChartData({
          labels,
          datasets: [
            {
              label: 'CO2 Sensor MQ135 Data',
              data: dataPoints,
              fill: true,
              backgroundColor: 'rgba(75,75,75,0.2)',
              borderColor: 'rgba(0,0,0,1)',
              pointBackgroundColor: 'rgba(0,0,0,1)',
              pointBorderColor: 'rgba(0,0,0,1)'
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Initial call to fetch data
  useEffect(() => {
    fetchSensorData();
  }, []);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'CO2 (ppm)' // Y-axis label for CO2 in ppm
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time' // X-axis label for time
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Datos CO2 sensor MQ135' // Chart title
      }
    }
  };

  const chartContainerStyle = {
    width: '100%',
    height: '500px', // Increased height for a larger presentation
  };

  return (
    <div>
      <div style={chartContainerStyle}>
        {chartData.datasets.length > 0 ? (
          <Line
            data={chartData}
            options={options}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
      <button onClick={fetchSensorData}>Update Data</button> {/* Button to update data */}
    </div>
  );
};

export default SensorChart;