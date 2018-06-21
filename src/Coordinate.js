function toRad(n) {
	return n * Math.PI / 180;
};

export default class Coordinate {
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

	static distance(p1, p2) {
		const R = 6371;

		const dLat = toRad(p1.lat - p2.lat),
			dLon = toRad(p1.lng - p2.lng),
			lat1 = toRad(p1.lat),
			lat2 = toRad(p2.lat);

		const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		
		return R * c;
	}
}
