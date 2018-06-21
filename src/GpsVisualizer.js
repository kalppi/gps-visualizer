import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import MapContainer from './MapContainer';
import RouteInfo from './RouteInfo';
import Slider from './Slider';
import convertToRoutes from './convertToRoutes';
import { format } from 'date-fns';

const embed = %embed%;

class GpsVisualizer extends React.Component {
	constructor(props) {
		super(props);

		let routeCollection = null;

		if(props.data) {
			routeCollection = convertToRoutes(props.data);
		} else if(embed) {
			routeCollection = convertToRoutes(embed);
		}

		this.state = {
			bounds: null,
			routeCollection: routeCollection,
			polylines: routeCollection.routes.map(r => r.polyline),
			activeRoute: 0,
			markerPosition: {
				lat: routeCollection.firstPoint.lat,
				lng: routeCollection.firstPoint.lng
			},
			markerRotation: 0
		};
	}

	componentDidMount() {
		this.setState({
			bounds: this.state.routeCollection.getBounds()
		});
	}

	_generateTitle() {
		const from = format(this.state.routeCollection.firstPoint.time * 1000, 'd.M. YYYY');
		const to = format(this.state.routeCollection.lastPoint.time * 1000, 'd.M. YYYY');;

		let km = 0;

		for(let i = 0; i < this.state.routeCollection.routes.length; i++) {
			km += this.state.routeCollection.routes[i].traveled;
		}
		
		return `${from} - ${to}  / ${km.toFixed(2)} km`;
	}

	setActiveRoute(index) {
		if(index !== this.state.activeRoute) {
			this.setState({activeRoute: index});
		}
	}

	setMarkerAtRoute(index, pos) {
		const route = this.state.routeCollection.routes[index];
		const path = route.data[pos];

		this.setState({
			markerPosition: {
				lat: path.lat,
				lng: path.lng
			},
			markerRotation: path.course
		});
	}

	render() {
		const { routeCollection } = this.state;
		const title = this._generateTitle();

		const parts = [];
		let remaining = 100;

		for(let i = 0; i < routeCollection.routes.length - 1; i++) {
			const route = routeCollection.routes[i];
			const p = route.count / routeCollection.totalCount * 100;

			parts.push({
				width:  Math.min(p, remaining),
				color: route.color
			});

			remaining -= p;
		}

		parts.push({
			width: remaining,
			color: routeCollection.lastRoute.color
		});

		const track = props => (
			<div style={{height: props.height}}>
				{
					parts.map((p, i) => (
						<div key={i} style={{
							width: p.width + '%',
							height: '100%',
							float: 'left',
							background: p.color
						}}></div>
					))
				}
			</div>
		);

		return <div>
				<h5>{title}</h5>
				
				<Slider
					track={track}
					style={{width: 400, marginBottom: 10}}
					min={0}
					max={routeCollection.totalCount - 1}
					onSlide={val => {
						const index = routeCollection.findRouteIndexByPathIndex(val);

						this.setActiveRoute(index);						
					}}
					ref={ref => this.slider = ref}
				/>

				<div style={{clear: 'both'}}>
					<MapContainer
						google={this.props.google}
						ref={ref => this.map = ref}
						bounds={this.state.bounds}
						polylines={this.state.polylines}
						markerPosition={this.state.markerPosition}
						markerRotation={this.state.markerRotation}
						activeRoute={this.state.activeRoute}
					/>
					<RouteInfo
						routes={routeCollection}
						activeRoute={this.state.activeRoute}
						onClick={index => {
							this.setActiveRoute(index);
							this.setMarkerAtRoute(index, 0);

							this.slider.setValue(routeCollection.findRoutePathStartIndex(index));
						}}
					/>
				</div>
			</div>;
	}
}

export default GoogleApiWrapper(props => ({
	apiKey: props.options.apiKey
}))(GpsVisualizer);