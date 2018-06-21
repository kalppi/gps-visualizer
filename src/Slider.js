import React from 'react';

export default class Slider extends React.Component {
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

	setValue(value) {
		if(value < this.state.min) value = this.state.min;
		else if(value > this.state.max) value = this.state.max;

		this.setState({ value });
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