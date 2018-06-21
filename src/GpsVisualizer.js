import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import MapContainer from './MapContainer';
import RouteInfo from './RouteInfo';
import convertToRoutes from './convertToRoutes';
import { format } from 'date-fns';

const embed = %embed%;

class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			min: props.min,
			max: props.max,
			value: props.min,
			valueInt: props.min,
			lastValueInt: props.min,
			mouseDown: false,
			mouseDownX: 0
		};
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.onMouseUp.bind(this));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.onMouseUp.bind(this));
		document.removeEventListener('mousemove', this.onMouseMove.bind(this));
	}

	onMouseUp(e) {

		this.setState({mouseDown: false});
	}

	onMouseMove(e) {
		if(this.state.mouseDown) {
			const { clientX: x } = e;
			const { left, width } = this.container.getBoundingClientRect(); 

			const p = (x - left) / width;

			let value = (this.state.max - this.state.min) * p;

			if(value < this.state.min) value = this.state.min;
			else if(value > this.state.max) value = this.state.max;

			const valueInt = Math.round(value);

			this.setState({
				lastValueInt: this.state.valueInt,
				value,
				valueInt
			}, () => {
				if(this.props.onSlide) {
					if(this.state.valueInt !== this.state.lastValueInt) {
						this.props.onSlide(this.state.valueInt);
					}
				}
			});
		}
	}

	defaultTrack() {
		return props => (
			<div style={{backgroundColor: '#aaa', height: props.height}}></div>
		);
	}

	render() {
		const height = 15;
		const Track = this.props.track || this.defaultTrack();

		const vp = this.state.value / (this.state.max - this.state.min);

		const style = {
			container: {
				height: height
			},
			handle: {
				width: 16,
				height: height + 6,
				backgroundColor: '#ccc',
				position: 'relative',
				borderRadius: 5,
				top: -height - 3,
				left: (vp * 100) + '%',
				marginLeft: -8
			}
		};

		return (
			<div style={Object.assign({}, style.container, this.props.style)} ref={ref => this.container = ref}>
				<Track height={height} />

				<div
					style={style.handle}
					onMouseDown={e => this.setState({mouseDown: true})}
				>

				</div>
			</div>
		);
	}
}

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
			polylines: routeCollection.routes.map(r => r.getPolyline())
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

	render() {
		const title = this._generateTitle();

		const parts = [];

		let remaining = 100;
		for(const route of this.state.routeCollection.routes) {
			const p = Math.ceil(route.count / this.state.routeCollection.totalCount * 100);

			parts.push({
				width:  Math.min(p, remaining) + '%',
				background: route.color
			});

			remaining -= p;
		}

		const track = props => <div style={{height: props.height}}>
					{
						parts.map((p, i) => (
							<div key={i} style={{
								width: p.width,
								height: '100%',
								float: 'left',
								background: p.background
							}}></div>
						))
					}
				</div>;

		return <div>
				<h5>{title}</h5>
				
				<Slider
					track={track}
					style={{width: 400, marginBottom: 10}}
					min={0}
					max={100}
					onSlide={val => {
						console.log(val);
					}}
				/>

				<div style={{clear: 'both'}}>
					<MapContainer
						google={this.props.google}
						ref={ref => this.map = ref}
						bounds={this.state.bounds}
						polylines={this.state.polylines}
					/>
					<RouteInfo routes={this.state.routeCollection} />
				</div>
			</div>;
	}
}

export default GoogleApiWrapper(props => ({
	apiKey: props.options.apiKey
}))(GpsVisualizer);