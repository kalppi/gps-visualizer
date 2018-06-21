import React from 'react';
import ReactDOM from 'react-dom';
import GpsVisualizer from './src/GpsVisualizer';

require('./public/index.html');

ReactDOM.render(<GpsVisualizer
		data={process.env.DATA}
		options={{
			apiKey: process.env.GOOGLE_API_KEY
		}}
	/>, document.getElementById('app'));