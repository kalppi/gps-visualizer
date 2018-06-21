import ReactDOM from 'react-dom';
import React from 'react';
import GpsVisualizer from './src/GpsVisualizer';

if(process.env.NODE_ENV === 'development') {
	require('./public/standalone.html');
}

const gpsVisualizer = (element, data, options) => {
	ReactDOM.render(<GpsVisualizer data={data} options={options}/>, element);
};

module.exports = gpsVisualizer;
