import React, { useState } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment'; 

const ValidacionFechas = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [datosGrafico, setDatosGrafico] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState('');

  const obtenerDatos = async () => {
    setError('');
    if (!moment(fechaSeleccionada, "YYYY-MM-DD", true).isValid() || 
        !moment(horaInicio, "HH:mm", true).isValid() || 
        !moment(horaFin, "HH:mm", true).isValid()) {
      setError('Formato de fecha o hora inválido.');
      return;
    }

    const inicioDateTime = moment(`${fechaSeleccionada}T${horaInicio}`).unix();
    const finDateTime = moment(`${fechaSeleccionada}T${horaFin}`).unix();

    try {
      const url = new URL('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data');
      url.searchParams.append('start_date', inicioDateTime.toString());
      url.searchParams.append('end_date', finDateTime.toString());

      const respuesta = await fetch(url.toString());

      if (!respuesta.ok) {
        throw new Error(`Error en la respuesta de la red: ${respuesta.status}`);
      }

      const resultado = await respuesta.json();
      console.log('Datos recibidos de la API:', resultado); // Registra los datos recibidos

      if (resultado && resultado.length > 0) {
        const datosFiltrados = resultado.filter(item => {
          const itemTimestamp = parseInt(item.timestamp, 10) / 1000;
          return itemTimestamp >= inicioDateTime && itemTimestamp <= finDateTime;
        });

        console.log('Datos filtrados:', datosFiltrados); // Registra los datos filtrados

        if (datosFiltrados.length === 0) {
          setError('No hay datos disponibles en el rango de tiempo seleccionado.');
        } else {
          configurarGrafico(datosFiltrados);
        }
      } else {
        setError('No se recibieron datos de la API.');
      }
    } catch (error) {
      setError(`Error al obtener datos: ${error.message}`);
      console.error('Error al obtener datos:', error); // Registra los errores
    }
  }

  const configurarGrafico = (datos) => {
    const labels = datos.map(d => d.formattedTimestamp);
    const dataPoints = datos.map(d => d.sensor);
    console.log('Etiquetas para el gráfico:', labels); // Registra las etiquetas
    console.log('Datos para el gráfico:', dataPoints); // Registra los puntos de datos

    setDatosGrafico({
      labels: labels,
      datasets: [
        {
          label: 'Datos CO2 sensor MQ135',
          data: dataPoints,
          fill: false,
          backgroundColor: 'rgba(75, 75, 75, 0.1)',
          borderColor: 'rgba(75, 75, 75, 1)',
        }
      ]
    });
  };

  const opciones = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CO2'
        }
      },
      x: {
        type: 'time',
        time: {
          parser: 'DD/MM/YYYY HH:mm:ss', 
          tooltipFormat: 'DD/MM/YYYY HH:mm:ss',
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'
          },
        },
        title: {
          display: true,
          text: 'Tiempo'
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div>
      <input type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} />
      <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
      <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
      <button onClick={obtenerDatos}>Obtener Datos</button>
      
      {error && <p>{error}</p>}
      
      <p>Fecha y hora de inicio: {fechaSeleccionada} {horaInicio}</p>
      <p>Fecha y hora de finalización: {fechaSeleccionada} {horaFin}</p>

      <div style={{ height: '400px', width: '100%' }}>
        {datosGrafico.datasets && datosGrafico.datasets.length > 0 ? (
          <Line data={datosGrafico} options={opciones} />
        ) : (
          <p>No hay datos para mostrar o esperando datos...</p>
        )}
      </div>
    </div>
  );
};

export default ValidacionFechas;