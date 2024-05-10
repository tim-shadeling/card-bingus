const card_defs = [
	new Map([
		["id", 0],
		["name", "CARD_0"],
		["image", "card_0"],
	]),

	new Map([
		["id", 1],
		["name", "CARD_1"],
		["image", "card_1"],
	]),

	new Map([
		["id", 2],
		["name", "CARD_2"],
		["image", "card_2"],
	]),
	
	new Map([
		["id", 3],
		["name", "CARD_3"],
		["image", "card_3"],
	]),
	
	new Map([
		["id", 4],
		["name", "CARD_4"],
		["image", "card_4"],
	]),
	
	new Map([
		["id", 5],
		["name", "CARD_5"],
		["image", "card_5"],
	]),
	
	new Map([
		["id", 6],
		["name", "CARD_6"],
		["image", "card_6"],
	]),
	
	new Map([
		["id", 7],
		["name", "CARD_7"],
		["image", "card_7"],
	]),
];

export default class Card {
	constructor(def_id) {
		let def = card_defs[def_id];
		this.id = def.get('id');
		this.name = def.get('name');
		this.image = document.getElementById(def.get('image'));
		this.ability = def.get('ability');
		this.x = 0;
		this.y = 0;
		this.size_x = 0;
		this.size_y = 0;
		this.active = false;
		this.enabled = true;
	}

	setpos(x,y) {
		this.x = x;
		this.y = y;
	}

	setdest(x,y) {
		this.dest_x = x;
		this.dest_y = y;
		this.vel_x = (this.dest_x - this.x)/30;
		this.vel_y = (this.dest_y - this.y)/30;
	}

	setsize(x,y) {
		this.size_x = x;
		this.size_y = y;
	}

	getid() {
		return this.id;
	}

	getname() {
		return this.name;
	}

	ispointwithin(x,y) {
		return x >= this.x && x <= this.x + this.size_x && y >= this.y && y <= this.y + this.size_y
	}

	move() {
		this.frames_to_move = 30;
		this.enabled = false;
		this.active = false;
	}

	onmousemove(e, got_active) {
		if (got_active) {this.active = false; return false};
		if (this.enabled) {
			this.active = this.ispointwithin(e.clientX, e.clientY);
		} else {
			this.active = false
		}
		return this.active;
	}

	onclick(e) {
		if (this.active) {
			console.log(this.name);
			this.move();
			return true;
		}
		return false;
	}

	hide() {
		this.hidden = true;
	}

	draw(ctx) {
		if (this.hidden) {return;}

		if (this.frames_to_move > 0) {
			this.frames_to_move--;
			this.setpos(this.x+this.vel_x, this.y+this.vel_y);
		}

		ctx.beginPath();
		ctx.drawImage(this.image, this.x, this.y - (this.active? 10:0), this.size_x, this.size_y)
  		/*ctx.rect(this.x, this.y, this.size_x, this.size_y);
  		ctx.fillStyle = "#AAAADD";
  		ctx.fill();*/

  		ctx.closePath();
	}
}