import React, { useState } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Validacionfechas = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CO2',
        data: [],
        fill: false,
        borderColor: 'grey',
        backgroundColor: 'grey',
        borderWidth: 2,
      }
    ]
  });
  const [error, setError] = useState('');

  // Validar que la fecha cumple con el formato esperado (YYYY-MM-DD)
  const validateDate = (date) => {
    return moment(date, "YYYY-MM-DD", true).isValid();
  }

  // Validar que la hora cumple con el formato esperado (HH:mm)
  const validateTime = (time) => {
    return moment(time, "HH:mm", true).isValid();
  }

  // Función para actualizar la gráfica
  const updateChart = (fetchedData) => {
    setChartData({
      labels: fetchedData.map(item => item.formattedTimestamp),
      datasets: [
        {
          label: 'CO2',
          data: fetchedData.map(item => item.co2), // Asegúrate de que tus objetos de datos tienen una propiedad 'co2'
          fill: false,
          borderColor: 'grey',
          backgroundColor: 'grey',
          borderWidth: 2,
        }
      ]
    });
  };

  // Función para obtener los datos
  const fetchData = async () => {
    setError(''); // Resetear el mensaje de error
    if (!validateDate(selectedDate) || !validateTime(startTime) || !validateTime(endTime)) {
      setError('Formato de fecha o hora inválido.');
      return;
    }

    const startDateTime = moment(`${selectedDate}T${startTime}`).unix();
    const endDateTime = moment(`${selectedDate}T${endTime}`).unix();

    try {
      const url = new URL('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data');
      url.searchParams.append('start_date', startDateTime.toString());
      url.searchParams.append('end_date', endDateTime.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`La respuesta de la red no fue exitosa: ${response.status}`);
      }

      const result = await response.json();
      const filteredAndFormattedData = result
        .filter(item => {
          const itemTimestamp = item.timestamp / 1000;
          return itemTimestamp >= startDateTime && itemTimestamp <= endDateTime;
        })
        .map(item => ({
          ...item,
          formattedTimestamp: moment.unix(item.timestamp / 1000).format('DD/MM/YYYY HH:mm:ss'),
          co2: item.co2, // Asegúrate de que la respuesta de la API tiene un campo 'co2'
        }));

      setData(filteredAndFormattedData);
      updateChart(filteredAndFormattedData);

    } catch (error) {
      setError(`Error al obtener datos: ${error.message}`);
    }
  }

  return (
    <div>
      <input type="date" id="selectedDate" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <button onClick={fetchData}>Obtener Datos</button>
      
      {error && <p>{error}</p>}
      
      <p>Fecha y hora de inicio: {selectedDate} {startTime}</p>
      <p>Fecha y hora de finalización: {selectedDate} {endTime}</p>

      {data.length > 0 && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}

      {/* Gráfico */}
      <div>
        <Line 
          data={chartData}
          options={{
            title: {
              display: true,
              text: 'Medición CO2 entre fechas'
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'CO2'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Tiempo'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Validacionfechas;