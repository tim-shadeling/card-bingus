export default class Point {
	constructor(x = 0,y = 0,size_x = 0, size_y = 0) {
		this.x = x;
		this.y = y;
		this.size_x = size_x;
		this.size_y = size_y;
	}

	SetPos(x,y) {
		this.x = x;
		this.y = y;
	}

	SetSize(x,y) {
		this.size_x = x;
		this.size_y = y;
	}

	IsPointWithin(x,y) {
		return x >= this.x && x <= this.x + this.size_x && y >= this.y && y <= this.y + this.size_y;
	}

	Diff(pt) {
		return new Point(pt.x - this.x, pt.y - this.y);
	}
}