import React from 'react';
import { Map, Polyline, Marker } from 'google-maps-react';

const options = {strokeOpacity: 0.3, strokeWeight: 2};
const activeOptions = {strokeOpacity: 1, strokeWeight: 3};

export default class MapContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		setTimeout(() => {
			this.marker.marker.setPosition(this.props.markerPosition);
		}, 0)
	}

	// optimization, let's not create a new marker every time it changes, but update the
	// existing one
	shouldComponentUpdate(nextProps) {
		if(this.props.markerPosition.lat !== nextProps.markerPosition.lat
			|| this.props.markerPosition.lng !== nextProps.markerPosition.lng
			|| this.props.markerRotation !== nextProps.markerRotation) {

				this.marker.marker.setPosition(nextProps.markerPosition);
			
				this.marker.marker.setIcon({ 
					path: this.marker.marker.icon.path,
					scale: this.marker.marker.icon.scale,
					rotation: Number(nextProps.markerRotation)
				});

			return false;
		}

		return true;
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
					this.props.polylines.map((group, gi) => (
						group.lines.map((p, i) => (
							<Polyline
								key={`${group.route.key}.${i}.${gi === this.props.activeRoute}`}
								path={p.path}
								strokeColor={p.strokeColor}
								{... (gi === this.props.activeRoute ? activeOptions : options) }
							/>
						))
					))
				}

				<Marker
					icon={{
						path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
						scale: 4
					}}
					ref={ref => this.marker = ref}
				/>
			</Map>
		);
	}
}