import smooth from './smooth';
import { format } from 'date-fns'; 

const lineOptions = {strokeOpacity: 0.3, strokeWeight: 2};
const selectedLineOptions = {strokeOpacity: 1, strokeWeight: 3};

class PolylineGroup {
	constructor(lines, options) {
		this._lines = lines;
		this._options = options;
	}

	get lines() {
		return this._lines;
	}

	get options() {
		return this._options;
	}

	set options(opts) {
		this._options = opts;
	}
}

class Polyline {
	constructor(line, options) {
		this._line = line;
		this._options = options;
	}

	get lines() {
		return [this._line];
	}

	get options() {
		return this._options;
	}

	set options(opts) {
		this._options = opts;
	}
}

export default class Route {
	constructor(data) {
		for(let name in data) {
			this[name] = data[name];
		}

		this.smoothPath = smooth(this.data);
	}

	pointToString(p) {
		let text = format(this.data[p].time * 1000, 'd.M. YYYY HH:mm');
		
		text += " " + this.data[p].speed + 'kn';
		text += " " + this.travel[p].toFixed(2) + "km / " + this.traveled.toFixed(2) + "km";
		
		return text;
	}

	toString() {
		let text = format(this.data[0].time * 1000, 'd.M. YYYY HH:mm');
		text += " - " + format(this.data[this.data.length - 1].time * 1000, 'd.M. YYYY HH:mm');
		text += " / " + this.traveled.toFixed(2) + "km";
		
		return text;
	}

	getPolyline(speed_coloring = true) {
		const path = this.smoothPath;

		const getColor = speed => {
			const value = speed / 15;
		    const hue = ((1 - value) * 120).toString(10);

		    return `hsl(${Math.round(hue)},100%,50%)`;
		};

		if(speed_coloring) {
			const polylines = [];

			for(let i = 1; i < path.length; i++) {
				let gPath = [];

				let speed = path[i - 1].speed;
				for(;i < path.length; i++) {
					gPath.push(path[i - 1]);
					gPath.push(path[i]);

					if(path[i].speed != speed) {
						break;
					}
				}

				polylines.push({
					path: gPath,
					strokeColor: getColor(path[i - 1].speed)
				});
			}

			return new PolylineGroup(polylines, {
				strokeOpacity: lineOptions.strokeOpacity,
				strokeWeight: lineOptions.strokeWeight
			});
		} else {
			const gPath = [];

			for(let j = 0; j < path.length; j++) {
				gPath.push({lat: path[j].lat, lng: path[j].lng});
			}

			return new Polyline({
				path: gPath,
				strokeColor: '#FF0000'
			}, {
				strokeOpacity: lineOptions.strokeOpacity,
				strokeWeight: lineOptions.strokeWeight,
			});
		}
	}
}
