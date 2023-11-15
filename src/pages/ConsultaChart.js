import React, { Component } from 'react';

class DataDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastEntry: null,
      max: null,
      min: null,
      average: null,
      error: null
    };
  }

  fetchData = () => {
    Promise.all([
      fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/last'),
      fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/max'),
      fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/min'),
      fetch('https://pq6hb87peh.execute-api.us-east-2.amazonaws.com/BETA/data/avg')
    ])
    .then(responses => Promise.all(responses.map(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })))
    .then(([lastEntryResponse, maxResponse, minResponse, avgResponse]) => {
      this.setState({
        lastEntry: lastEntryResponse.Value_last?.sensor,
        max: maxResponse.Value_max,
        min: minResponse.Value_min,
        average: avgResponse.Value_avg,
        error: null 
      });
    })
    .catch(error => {
      this.setState({
        error: error,
        lastEntry: null,
        max: null,
        min: null,
        average: null
      });
    });
  }

  render() {
    const { lastEntry, max, min, average, error } = this.state;

    // Inline CSS styles
    const styles = {
      container: {
        backgroundColor: '#f4f4f4', // Light gray background
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
        maxWidth: '600px',
        margin: '20px auto',
        fontFamily: 'Arial, sans-serif',
      },
      button: {
        backgroundColor: '#333', // Dark gray button
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
      },
      dataPoint: {
        backgroundColor: 'white',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ddd', // Light gray border
        color: '#333', // Dark gray text
      },
      error: {
        color: 'red',
        margin: '10px 0',
      },
      label: {
        fontWeight: 'bold',
      }
    };

    return (
      <div style={styles.container}>
        <button onClick={this.fetchData} style={styles.button}>Obtener Datos</button>
        {error && <div style={styles.error}>Error al obtener los datos: {error.message}</div>}
        <div style={styles.dataPoint}><span style={styles.label}>Última Entrada:</span> {lastEntry !== null ? lastEntry : 'Cargando...'}</div>
        <div style={styles.dataPoint}><span style={styles.label}>Máximo:</span> {max !== null ? max : 'Cargando...'}</div>
        <div style={styles.dataPoint}><span style={styles.label}>Mínimo:</span> {min !== null ? min : 'Cargando...'}</div>
        <div style={styles.dataPoint}><span style={styles.label}>Promedio:</span> {average !== null ? average : 'Cargando...'}</div>
      </div>
    );
  }
}

export default DataDisplay;