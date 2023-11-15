import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Validacionfechas = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState('');

  // Este efecto se actualiza cada vez que 'data' cambia.
  useEffect(() => {
    if (data.length > 0) {
      setChartData({
        labels: data.map(item => item.formattedTimestamp),
        datasets: [
          {
            label: 'CO2',
            data: data.map(item => item.sensor),
            fill: false,
            borderColor: 'grey',
            backgroundColor: 'grey',
            borderWidth: 2,
          }
        ]
      });
    }
  }, [data]);

  // Asumiendo que los datos están almacenados localmente o pasados a este componente,
  // aquí se podrían filtrar los datos en base a las fechas seleccionadas.
  const fetchData = (startDate, endDate) => {
    // Simulamos una llamada a la API que devuelve los datos.
    // En un caso real, aquí iría la llamada a la API.
    const fetchedData = [
      // ... (tus datos van aquí)
    ];

    const startDateTime = moment(startDate, "DD/MM/YYYY HH:mm:ss").unix();
    const endDateTime = moment(endDate, "DD/MM/YYYY HH:mm:ss").unix();

    const filteredData = fetchedData.filter(item => {
      const itemTimestamp = parseInt(item.timestamp, 10);
      return itemTimestamp >= startDateTime && itemTimestamp <= endDateTime;
    }).map(item => ({
      ...item,
      formattedTimestamp: moment.unix(item.timestamp).format('DD/MM/YYYY HH:mm:ss'),
    }));

    setData(filteredData);
  }

  // Llamamos a fetchData cuando el usuario selecciona las fechas y hace clic en el botón.
  const handleFetchData = () => {
    if (validateDate(selectedDate) && validateTime(startTime) && validateTime(endTime)) {
      const startDate = `${selectedDate} ${startTime}`;
      const endDate = `${selectedDate} ${endTime}`;
      fetchData(startDate, endDate);
    } else {
      setError('Formato de fecha o hora inválido.');
    }
  }

  return (
    <div>
      <input type="date" id="selectedDate" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <button onClick={handleFetchData}>Obtener Datos</button>
      
      {error && <p>{error}</p>}
      
      {/* Gráfico */}
      {data.length > 0 && (
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
      )}
    </div>
  );
}

export default Validacionfechas;