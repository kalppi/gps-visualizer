function toRad(n) {
	return n * Math.PI / 180;
};

export default class Coodrinate {
	constructor(lat, lng) {
		this._lat = Number(lat);
		this._lng = Number(lng);
	}

	get lat() {
		return this._lat;
	}

	get lng() {
		return this._lng;
	}

	distance(p) {
		const R = 6371;

		const dLat = toRad(this._lat - p.lat),
			dLon = toRad(this._lng - p.lng),
			lat1 = toRad(this._lat),
			lat2 = toRad(p.lat);

		const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		
		return R * c;
	}
}
