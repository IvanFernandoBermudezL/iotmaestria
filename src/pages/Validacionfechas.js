import React, { useState } from 'react';
import moment from 'moment';

const Validacionfechas = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Validar que la fecha cumple con el formato esperado (YYYY-MM-DD)
  const validateDate = (date) => {
    return moment(date, "YYYY-MM-DD", true).isValid();
  }

  // Validar que la hora cumple con el formato esperado (HH:mm)
  const validateTime = (time) => {
    return moment(time, "HH:mm", true).isValid();
  }

  // Función para obtener los datos
  const fetchData = async () => {
    setError(''); // Resetear el mensaje de error
    if (!validateDate(selectedDate) || !validateTime(startTime) || !validateTime(endTime)) {
      setError('Formato de fecha o hora inválido.');
      return;
    }

    // Convertir la fecha y hora seleccionada a un timestamp de Unix en segundos
    const startDateTime = moment(`${selectedDate}T${startTime}`).unix();
    const endDateTime = moment(`${selectedDate}T${endTime}`).unix();

    try {
      const url = new URL('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data');
      url.searchParams.append('start_date', startDateTime.toString());
      url.searchParams.append('end_date', endDateTime.toString());

      const response = await fetch(url.toString()); // Convertir la URL a string

      if (!response.ok) {
        throw new Error(`La respuesta de la red no fue exitosa: ${response.status}`);
      }

      const result = await response.json();
      const filteredAndFormattedData = result
        .filter(item => {
          const itemTimestamp = item.timestamp / 1000; // Convertir milisegundos a segundos
          return itemTimestamp >= startDateTime && itemTimestamp <= endDateTime;
        })
        .map(item => ({
          ...item,
          // Formatear el timestamp
          formattedTimestamp: moment.unix(item.timestamp / 1000).format('DD/MM/YYYY HH:mm:ss')
        }));

      setData(filteredAndFormattedData);

      // Imprimir los datos en la consola del navegador para verificar
      console.log(filteredAndFormattedData);
    } catch (error) {
      // Manejo de errores en caso de fallo en la solicitud
      setError(`Error al obtener datos: ${error.message}`);
    }
  }

  return (
    <div>
      <input type="date" id="selectedDate" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <button onClick={fetchData}>Obtener Datos</button>
      
      {/* Mostrar mensajes de error */}
      {error && <p>{error}</p>}
      
      {/* Mostrar fecha y hora seleccionada */}
      <p>Fecha y hora de inicio: {selectedDate} {startTime}</p>
      <p>Fecha y hora de finalización: {selectedDate} {endTime}</p>

      {/* Mostrar datos si están disponibles */}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default Validacionfechas;

