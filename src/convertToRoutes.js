import Coordinate from './Coordinate';
import Route from './Route';
import RouteCollection from './RouteCollection';

const MAX_GAP = 6 * 60 * 60;

const next = (data, i) => {
	const routeData = [];
	const travel = [];
	let traveled = 0;
	let last = null;

	for(; i < data.length; i++) {
		if(last !== null && data[i].time - last.time > MAX_GAP) {
			break;
		}

		if(last !== null) traveled += Coordinate.distance(last, data[i]);
		
		travel.push(traveled);

		routeData.push({
			lat: Number(data[i].lat),
			lng: Number(data[i].lng),
			course: Number(data[i].course),
			time: Number(data[i].time),
			lasttime: Number(data[i].lasttime),
			speed: Number(data[i].speed)
		});

		last = data[i];
	}
	
	if(routeData.length == 0) return {i, route: null};

	return {
		i,
		route: {
			start: i,
			data: routeData,
			traveled: traveled,
			count: routeData.length,
			travel: travel
		}
	};
}


const convertToRoutes = data => {
	let i = 0, route = null;
	const routes = [];

	while(true) {
		({ i, route } = next(data, i));

		if(route === null) break;

		if(route.count > 5 && route.traveled > 3) {
			routes.push(new Route(route));
		}
	};
	
	return new RouteCollection(routes);
};

export default convertToRoutes;