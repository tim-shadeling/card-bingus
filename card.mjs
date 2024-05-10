import Point from "./point.mjs";
import * as _C from "./constants.mjs";

const CARD_DEFS = []
for (let i = 0; i < _C.CARD_AMOUNT; i++) {
	CARD_DEFS[i] = {
		"rank" : i,
		"name" : _C.CARD_NAMES[i],
		"image": "card_"+i,
	}
}

export default class Card extends Point {
	constructor(def_id) {
		super();
		let def = CARD_DEFS[def_id];
		this.id = def_id;
		this.rank = def['rank'];
		this.name = def['name'];
		this.image = document.getElementById(def['image']);
		this.active = false;
		this.enabled = true;
	}
		
	Move(x,y) {
		this.vel_x = (x - this.x)/_C.MOVING_DURATION;
		this.vel_y = (y - this.y)/_C.MOVING_DURATION;

		this.frames_to_move = _C.MOVING_DURATION;
		this.enabled = false;
		this.active = false;
	}

	OnMouseMove(e, got_active) {
		if (got_active) {this.active = false; return false};
		if (this.enabled) {
			this.active = this.IsPointWithin(e.clientX, e.clientY);
		} else {
			this.active = false
		}
		return this.active;
	}

	OnClick(e) {
		return this.active;
	}

	Hide() {
		this.hidden = true;
	}

	Draw(ctx) {
		if (this.hidden) {return;}

		if (this.frames_to_move > 0) {
			this.frames_to_move--;
			this.SetPos(this.x+this.vel_x, this.y+this.vel_y);
		}

		ctx.beginPath();
		ctx.drawImage(this.image, this.x, this.y - (this.active? 10:0), this.size_x, this.size_y)
  		ctx.closePath();
	}
}