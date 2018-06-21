export default (points) => {
	let i, t, ax, ay, bx, by, cx, cy, dx, dy, lat, lon;
	let nPoints = [];
	
	let p = points[0];
	nPoints.push({lat: p.lat, lng: p.lng, speed: p.speed, course: p.course});
	
	for (i = 2; i < points.length - 2; i++) {
		for (t = 0; t < 1; t += 0.2) {
			ax = (-points[i - 2].lat + 3 * points[i - 1].lat - 3 * points[i].lat + points[i + 1].lat) / 6;
			ay = (-points[i - 2].lng + 3 * points[i - 1].lng - 3 * points[i].lng + points[i + 1].lng) / 6;
			bx = (points[i - 2].lat - 2 * points[i - 1].lat + points[i].lat) / 2;
			by = (points[i - 2].lng - 2 * points[i - 1].lng + points[i].lng) / 2;
			cx = (-points[i - 2].lat + points[i].lat) / 2;
			cy = (-points[i - 2].lng + points[i].lng) / 2;
			dx = (points[i - 2].lat + 4 * points[i - 1].lat + points[i].lat) / 6;
			dy = (points[i - 2].lng + 4 * points[i - 1].lng + points[i].lng) / 6;
			lat = ax * Math.pow(t + 0.1, 3) + bx * Math.pow(t + 0.1, 2) + cx * (t + 0.1) + dx;
			lon = ay * Math.pow(t + 0.1, 3) + by * Math.pow(t + 0.1, 2) + cy * (t + 0.1) + dy;

			nPoints.push({lat: lat, lng: lon, speed: points[i].speed, course: points[i].course});
		}
	}
	
	p = points[points.length - 1];
	nPoints.push({lat: p.lat, lng: p.lng, speed: p.speed, course: p.course});

	return nPoints;
};