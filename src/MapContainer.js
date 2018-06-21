import React from 'react';
import { Map, Polyline } from 'google-maps-react';
import { Slider } from './Slider';

export default class MapContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const style = {
			position: 'static',
			width: '400px',
			height: '400px'
		};

		return (
			<Map
				google={this.props.google}
				containerStyle={{
					position: 'static',
					width: style.width,
					height: style.height,
					display: 'inline-block'
				}}
				style={style}
				initialCenter={{
					lat: 60.192059,
					lng: 24.945831
				}}
				bounds={this.props.bounds}
			>
				{
					this.props.polylines.map(group => (
						group.lines.map((p, i) => (
							<Polyline
								key={i}
								path={p.path}
								strokeColor={p.strokeColor}
								strokeOpacity={group.options.strokeOpacity}
								strokeWeight={group.options.strokeWeight}
							/>
						))
					))
				}
			</Map>
		);
	}
}