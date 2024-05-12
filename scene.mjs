import Card from "./card.mjs";
import Point from "./point.mjs";
import TheOpponent from "./opponent.mjs";
import * as _C from "./constants.mjs";
import * as utils from "./utils.mjs";

const BASE_CARD_SIZE_X = 34;
const BASE_CARD_SIZE_Y = 45;

const PLAYER_CARD_OFFSET_X = 20;
const PLAYER_CARD_OFFSET_Y = 200;
const PLAYER_PILE_OFFSET_X = 200;
const PLAYER_PILE_OFFSET_Y = 200;

const OPP_CARD_OFFSET_X = 80;
const OPP_CARD_OFFSET_Y = 50;
const OPP_CARD_ROW_MARGIN = 50;
const OPP_CARD_OFFSET_X_RIGHT = 40;
const OPP_CARDS_PER_ROW = 4;

const PLAYER_POINTS_OFFSET_X = 20;
const PLAYER_POINTS_OFFSET_Y = 20;
const PLAYER_POINTS_OFFSET_Y_BOTTOM = 450
const OPP_POINTS_OFFSET_X = 90;
const OPP_POINTS_OFFSET_Y = 20;
const OPP_POINTS_OFFSET_Y_BOTTOM = 450

const ROUND_POINTS_OFFSET_X = 130;
const ROUND_POINTS_OFFSET_Y = 50;

export default class Scene {
	constructor(canvas_width, canvas_height) {
		this.controls_enabled = true;
		this.frames_to_wait = 0;
		this.width = window.innerWidth
		this.height = window.innerHeight

		this.turn = 0;

		this.cards = {};
		this.opp_cards = {};
		this.preview_card = null;

		this.player_score = 0;
		this.opp_score = 0;
		this.round_value = 1;

		this.player_has_advantage = false;
		this.player_will_peek = false;
		this.opp_has_advantage = false;
		this.opp_will_peek = false;

		let player_card_points = utils.spaceout_pt(	new Point(PLAYER_CARD_OFFSET_X, this.height - PLAYER_CARD_OFFSET_Y),
													new Point(this.width - PLAYER_CARD_OFFSET_X, this.height - PLAYER_CARD_OFFSET_Y),
														_C.CARD_AMOUNT
		);
		let opp_card_points_top = utils.spaceout_pt(new Point(this.width/2 - OPP_CARD_OFFSET_X, OPP_CARD_OFFSET_Y), 
													new Point(this.width/2 + OPP_CARD_OFFSET_X, OPP_CARD_OFFSET_Y),
														_C.CARD_AMOUNT/2
		);
		let opp_card_points_bottom = utils.spaceout_pt(	new Point(this.width/2 - OPP_CARD_OFFSET_X, OPP_CARD_OFFSET_Y+OPP_CARD_ROW_MARGIN), 
														new Point(this.width/2 + OPP_CARD_OFFSET_X, OPP_CARD_OFFSET_Y+OPP_CARD_ROW_MARGIN),
														_C.CARD_AMOUNT/2
		);
		for (let i = _C.CARD_AMOUNT-1; i >= 0; i--) {
			let newcard = new Card(i);
			newcard.SetPos(player_card_points[i].x, player_card_points[i].y);
			newcard.SetSize(_C.CARD_SIZE_MULT*BASE_CARD_SIZE_X, _C.CARD_SIZE_MULT*BASE_CARD_SIZE_Y);
			//newcard.setdest(this.width/2-200,this.height/2-200);
			this.cards[i] = newcard;

			newcard = new Card(i, true);
			if (i < _C.CARD_AMOUNT/2) {
				newcard.SetPos(opp_card_points_top[i].x, opp_card_points_top[i].y)
			} else {
				newcard.SetPos(opp_card_points_bottom[i-_C.CARD_AMOUNT/2].x, opp_card_points_bottom[i-_C.CARD_AMOUNT/2].y)
			}
			newcard.SetSize(BASE_CARD_SIZE_X, BASE_CARD_SIZE_Y);
			this.opp_cards[i] = newcard;
		}

		this.point_indicators = {
			"player_score" : utils.spaceout_pt(new Point(PLAYER_POINTS_OFFSET_X, PLAYER_POINTS_OFFSET_Y), new Point(PLAYER_POINTS_OFFSET_X, PLAYER_POINTS_OFFSET_Y_BOTTOM), _C.POINTS_TO_WIN),
			"opp_score" :  utils.spaceout_pt(new Point(this.width - OPP_POINTS_OFFSET_X, OPP_POINTS_OFFSET_Y), new Point(this.width - OPP_POINTS_OFFSET_X, OPP_POINTS_OFFSET_Y_BOTTOM), _C.POINTS_TO_WIN),
			"round_value" :  utils.spaceout_pt(new Point(this.width/2 - ROUND_POINTS_OFFSET_X, this.height/2+ROUND_POINTS_OFFSET_Y), new Point(this.width/2 + ROUND_POINTS_OFFSET_X, this.height/2+ROUND_POINTS_OFFSET_Y), _C.POINTS_TO_WIN),
		}
		this.point_image = document.getElementById("point");
		this.point_off_image = document.getElementById("point_off");
		/*for (let i = 0; i < 4; i++) {
			this.point_indicators["player_score"][i] = new Point(20, 50+100*i, 56, 96);
			this.point_indicators["opp_score"][i] = new Point(100, 50+100*i, 56, 96);
			this.point_indicators["round_value"][i] = new Point(this.width/2 - 130 + 65*i, 400, 56, 96);
		}*/

		this.buff_6_image = document.getElementById("buff_6");
		this.buff = {
			"player" : new Point(this.width/2 - 130 - 70 - 124, 400, 124,124),
			"opponent" : new Point(this.width/2 + 130 + 70, 400, 124, 124),
		}
	}

	Wait(time) {
		this.controls_enabled = false;
		setTimeout(function(scene){
			scene.controls_enabled = true
			if (scene.player_will_peek) {
				scene.preview_card = scene.opp_cards[TheOpponent.Decide(scene, null)];
				//console.log("Вы подглядываете карту", scene.preview_card.name)
				scene.preview_card.SetSize(_C.CARD_SIZE_MULT*BASE_CARD_SIZE_X, _C.CARD_SIZE_MULT*BASE_CARD_SIZE_Y);
				scene.preview_card.SetPos(scene.width/2+64, -180);
				scene.preview_card.Move(scene.width/2+64,scene.height/2-200);
			}
		}, time, this);
	}	

	Evaluate(my_card, opp_card) {
		let forced_draw = false;
		let reversed_duel = false;
		let reverse_broken = false;

		let player_advantage = this.player_has_advantage
		let opponent_advantage = this.opp_has_advantage
		this.player_has_advantage = false;
		this.opp_has_advantage = false;

		if (my_card.id!=5 && opp_card.id!=5) {
			switch (my_card.id) {
				case 0:
				forced_draw = true;
				break;
				case 1:
				if (opp_card.id === 7) {
					this.round_value+=3
					return true;
				}
				break;
				case 2:
				this.player_will_peek = true;
				break;
				case 3:
				reversed_duel = true;
				break;
				case 4:
				break;
				case 5:
				break;
				case 6:
				this.player_has_advantage = true;
				break;
				case 7:
				reverse_broken = true;
				break;
			}
			switch (opp_card.id) {
				case 0:
				forced_draw = true;
				break;
				case 1:
				if (my_card.id === 7) {
					this.round_value+=3
					return false;
				}
				break;
				case 2:
				this.opp_will_peek = true;
				break;
				case 3:
				reversed_duel = true;
				break;
				case 4:
				break;
				case 5:
				break;
				case 6:
				this.opp_has_advantage = true;
				break;
				case 7:
				reverse_broken = true;
				break;
			}
		}

		if (this.opp_will_peek && this.player_will_peek) {
			this.opp_will_peek = false;
			this.player_will_peek = false;
		}

		let player_wins = null;
		if (!forced_draw) {
			let my_rank = my_card.id + (player_advantage? 2:0);
			let opp_rank = opp_card.id + (opponent_advantage? 2:0);
			//console.log(my_rank, opp_rank)
			if (my_rank > opp_rank) {
				player_wins = !(reversed_duel && !reverse_broken)
			} else if (my_rank < opp_rank) {
				player_wins = (reversed_duel && !reverse_broken)
			} else {
				player_wins = null;
			}
		}

		if (my_card.id!=5 && opp_card.id!=5) {
			if (player_wins === true && my_card.id === 4 || player_wins === false && opp_card.id === 4 || player_wins === null && (my_card.id === 4 || opp_card.id === 4)) {
				this.round_value+=1;
			}
		}

		return player_wins;
	}

	CheckWinner() {
		if (this.player_score >= 4 || this.turn >= 8 && this.player_score > this.opp_score) {
			alert("Вы победили!");
			this.game_over = true;
		} else if (this.opp_score >= 4 || this.turn >= 8 && this.player_score < this.opp_score) {
			alert("Вы проиграли.");
			this.game_over = true;
		} else if (this.turn >= 8) {
			alert("Ничья.");
			this.game_over = true;
		};
	}

	DrawCards(ctx) {
		for (let i = 0; i < _C.CARD_AMOUNT; i++) {
			this.cards[i].Draw(ctx);
			this.opp_cards[i].Draw(ctx);
		}
	}

	DrawPointIndicators(ctx) {
		let counter = 0;
		for (const c of this.point_indicators["player_score"]) {
			ctx.beginPath();
			ctx.drawImage((counter++ < this.player_score? this.point_image:this.point_off_image), c.x, c.y, _C.POINT_INDICATOR_SIZE_X, _C.POINT_INDICATOR_SIZE_Y);
			ctx.closePath();
		}
		counter = 0;
		for (const c of this.point_indicators["opp_score"]) {
			ctx.beginPath();
			ctx.drawImage((counter++ < this.opp_score? this.point_image:this.point_off_image), c.x, c.y, _C.POINT_INDICATOR_SIZE_X, _C.POINT_INDICATOR_SIZE_Y);
			ctx.closePath();
		}
		counter = 0;
		for (const c of this.point_indicators["round_value"]) {
			ctx.beginPath();
			ctx.drawImage((counter++ < this.round_value? this.point_image:this.point_off_image), c.x, c.y, _C.POINT_INDICATOR_SIZE_X, _C.POINT_INDICATOR_SIZE_Y);
			ctx.closePath();
		}
	}

	DrawBuff(ctx) {
		if (this.player_has_advantage) {
			let pt = this.buff["player"];
			ctx.beginPath();
			ctx.drawImage(this.buff_6_image, pt.x, pt.y, pt.size_x, pt.size_y);
			ctx.closePath();
		}
		if (this.opp_has_advantage) {
			let pt = this.buff["opponent"];
			ctx.beginPath();
			ctx.drawImage(this.buff_6_image, pt.x, pt.y, pt.size_x, pt.size_y);
			ctx.closePath();
		}
	}

	MouseMoveHandler(e) {
		if (!this.controls_enabled || this.game_over) {return;}

		let active_card = false;
		for (let i = _C.CARD_AMOUNT-1; i >= 0; i--) {
			if (this.cards[i].OnMouseMove(e, active_card)) {active_card = true};
		}
		/*for (const c of Object.values(this.opp_cards)) {
			c.onmousemove(e);
		}*/
	}

	MouseClickHandler(e) {
		if (this.game_over) {return;}

		for (let i = _C.CARD_AMOUNT-1; i >= 0; i--) {
			let c = this.cards[i];
			if (c.OnClick(e)) {
				this.turn++;
				this.Wait(_C.WAIT_MULT*140*17);
				c.Move(this.width/2-200,this.height/2-200);
				//console.log("Вы сыграли:", c.name);
				let card = this.preview_card;
				if (!this.player_will_peek) {
					card = this.opp_cards[TheOpponent.Decide(this, c)];
					setTimeout(function(scene) {
						card.SetSize(_C.CARD_SIZE_MULT*BASE_CARD_SIZE_X, _C.CARD_SIZE_MULT*BASE_CARD_SIZE_Y);
						card.image = document.getElementById("card_"+card.id);
						card.SetPos(scene.width/2+64, -180);
						card.Move(scene.width/2+64,scene.height/2-200);
						scene.winner = scene.Evaluate(c, card);
					},_C.WAIT_MULT*30*17,this);
				} else {
					setTimeout(function(scene) {
						TheOpponent.player_choices[c.id] = null;
						scene.winner = scene.Evaluate(c, card);
					},_C.WAIT_MULT*30*17,this);
				}
				setTimeout(function(scene) {
					if (scene.winner === true) {
						scene.player_score+=scene.round_value;
						scene.round_value = 1;
					} else if (scene.winner === false) {
						scene.opp_score+=scene.round_value;
						scene.round_value = 1;
					} else {
						scene.round_value+=1;
					}
				},_C.WAIT_MULT*60*17,this)
				setTimeout(function(scene) {
					c.Hide()
					card.Hide();
					scene.CheckWinner();
					//console.log("Раунд теперь стоит:", scene.round_value);
				},_C.WAIT_MULT*120*17,this)
				this.player_will_peek = false;
				this.opp_will_peek = false;
				//this.preview_card = null;
				break;
			}
		}
		/*for (const c of Object.values(this.opp_cards)) {
			c.onclick(e);
		}*/
	}
}