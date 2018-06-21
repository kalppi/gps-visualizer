import Coordinate from './Coordinate';

export default class RouteCollection {
	constructor(routes) {
		this._routes = routes;
		this._totalCount = 0;

		let hue = 20;
		for(const route of routes) {
			this._totalCount += route.count;

			route.color = `hsl(${Math.round(hue)},100%,50%)`;

			hue += 50;
		}
	}

	get routes() {
		return this._routes;
	}

	get totalCount() {
		return this._totalCount;
	}

	get firstPoint() {
		return this._routes[0].data[0];
	}

	get lastPoint() {
		const l = this._routes[this._routes.length - 1];
		return l.data[l.data.length - 1];
	}

	get lastRoute() {
		return this._routes[this.routes.length - 1];
	}

	getBounds() {
		let s, n, e, w;

		s = n = this._routes[0].data[0].lat;
		w = e = this._routes[0].data[0].lng;

		for(let i in this._routes) {
			for(let j in this._routes[i].data) {
				const p = this._routes[i].data[j];

				if(p.lat < s) {
					s = p.lat;
				}
				
				if(p.lat > n) {
					n = p.lat;
				}
				
				if(p.lng > e) {
					e = p.lng;
				}
				
				if(p.lng < w) {
					w = p.lng;
				}
			}
		}

		return {
			north: n,
			south: s,
			west: w,
			east: e
		};
	}

	findRouteIndexByPathIndex(index) {
		for(var i = 0, a = 0; i < this._routes.length; i++) {
			if(a + this.routes[i].count > index) {
				break;
			}
			
			a += this.routes[i].count;
		}

		return i;
	}

	findRoutePathStartIndex(r) {
		for(let i = 0, s = 0; i < this._routes.length; i++) {
			if(r == i) {
				return s;
			}

			s += this._routes[i].count;
		}
		
		return null;
	}
			
	findCoordinateFromTime(time) {
		let s = 0;

		for(let i = 0; i < this._routes.length; i++) {
			for(let j = 0; j < this._routes[i].count; j++) {
				if(this._routes[i].data[j].time > time) {
					return {
						route: i,
						point: j,
						slider: s,
						position: {lat: this._routes[i].data[j].lat, lng: this._routes[i].data[j].lng}
					};
				}
				
				s++;
			}
		}
		
		return null;
	}
		
	findNearestPoint(p, smooth) {
		let route = 0;
		let point = 0;
		let s = 0;
		let ps = 0;

		const path = (smooth ? 'smoothPath' : 'data'); 

		let min = Coordinate.distance(this._routes[0][path][0], p);
		
		for(let i = 0; i < this._routes.length; i++) {
			for(let j = 0; j < this._routes[i][path].length; j++) {
				const d = Coordinate.distance(this._routes[i][path][j], p);

				if(d < min) {
					min = d;
					route = i;
					point = j;
					ps = s;
				}
				
				s++;
			}
		}

		return {
			route: route,
			point: point,
			position: this._routes[route][path][point],
			slider: ps
		};
	}
}