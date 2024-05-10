import Point from "./point.mjs";

export function randint(lower, upper) {
	return Math.floor(lower + Math.random()*(upper-lower));
}

export function div(a,b) {
	return (a-a%b)/b;
}

export function spaceout(start, end, count) {
	let result = [start];
	let temp = start;
	let interval = Math.floor((end-start)/count);
	for (let i = 1; i < count; i++) {
		temp+=interval;
		result[i] = temp;
	}
	return result;
}

export function spaceout_pt(startpt, endpt, count) {
	let spaced_x = spaceout(startpt.x, endpt.x, count);
	let spaced_y = spaceout(startpt.y, endpt.y, count);
	let result = [new Point(startpt.x, startpt.y)];
	for (let i = 1; i < count; i++) {
		result[i] = new Point(spaced_x[i], spaced_y[i]);
	}
	return result;
}