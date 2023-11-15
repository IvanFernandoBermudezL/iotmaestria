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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'CO2 Sensor MQ135 Data',
      data: [],
      fill: true,
      backgroundColor: 'rgba(75,75,75,0.2)',
      borderColor: 'rgba(0,0,0,1)',
      pointBackgroundColor: 'rgba(0,0,0,1)',
      pointBorderColor: 'rgba(0,0,0,1)'
    }]
  });
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const labels = data.map(item => 
          new Date(item.timestamp * 1000).toLocaleTimeString('es-ES')
        );
        const dataPoints = data.map(item => item.sensor);
        setChartData({
          labels,
          datasets: [{
            label: 'CO2 Sensor MQ135 Data',
            data: dataPoints,
            fill: true,
            backgroundColor: 'rgba(75,75,75,0.2)',
            borderColor: 'rgba(0,0,0,1)',
            pointBackgroundColor: 'rgba(0,0,0,1)',
            pointBorderColor: 'rgba(0,0,0,1)'
          }],
        });

        const latestTimestamp = new Date(data[data.length - 1].timestamp * 1000);
        setCurrentTimestamp(latestTimestamp.toLocaleTimeString('es-ES'));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CO2 (ppm)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
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
        text: 'Datos CO2 sensor MQ135'
      }
    }
  };

  const chartContainerStyle = {
    height: '600px', 
    width: '800px'
  };

  return (
    <div>
      <div style={chartContainerStyle}>
        <Line data={chartData} options={options} />
      </div>
      <p>Fecha actualizada: {currentTimestamp}</p>
    </div>
  );
};

export default SensorChart;