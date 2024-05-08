import Card from "./deck.mjs";
import TheOpponent from "./opponent.mjs";

class Scene {
	constructor(canvas_width, canvas_height) {
		this.controls_enabled = true;
		this.frames_to_wait = 0;
		this.winner = null;
		this.turn = 0;
		this.card_amt = 8;
		this.cards = {};
		this.opp_cards = {};
		this.size_mult = 4;
		this.my_score = 0;
		this.opp_score = 0;
		this.round_value = 1;
		this.x = window.innerWidth
		this.y = window.innerHeight

		this.player_has_advantage = false;
		this.player_will_peek = false;
		this.opponent_has_advantage = false;
		this.opponent_will_peek = false;

		this.preview_card = null;

		for (let i = 0; i < this.card_amt; i++) {
			let newcard = new Card(i);
			newcard.setpos(20+i*(this.x-this.x%this.card_amt)/this.card_amt, this.y-200);
			newcard.setsize(this.size_mult*34, this.size_mult*45);
			newcard.setdest(this.x/2-200,this.y/2-200);
			this.cards[i] = newcard;

			newcard = new Card(i);
			newcard.setpos(this.x-200+(i%4)*38, 50+60*(i-i%4)/4);
			newcard.setsize(34, 45);
			//newcard.enabled = false;
			this.opp_cards[i] = newcard;
		}
	}

	wait(time) {
		this.controls_enabled = false;
		setTimeout(function(scene){
			scene.controls_enabled = true
			if (scene.player_will_peek) {
				scene.preview_card = scene.opp_cards[TheOpponent.decide(scene, null)];
				console.log("Вы подглядываете карту", scene.preview_card.getid())
				scene.preview_card.setsize(scene.size_mult*34, scene.size_mult*45);
				scene.preview_card.setpos(scene.x/2+64, -180);
				scene.preview_card.setdest(scene.x/2+64,scene.y/2-200);
				scene.preview_card.move();
			}
		}, time, this);
	}	

	mouseMoveHandler(e) {
		if (!this.controls_enabled) {return;}

		for (const c of Object.values(this.cards)) {
			c.onmousemove(e);
		}
		/*for (const c of Object.values(this.opp_cards)) {
			c.onmousemove(e);
		}*/
	}

	evaluate(my_card, opp_card) {
		let forced_draw = false;
		let reversed_duel = false;
		let reverse_broken = false;

		let player_advantage = this.player_has_advantage
		let opponent_advantage = this.opponent_has_advantage
		this.player_has_advantage = false;
		this.opponent_has_advantage = false;

		if (my_card.getid()!=5 && opp_card.getid()!=5) {
			switch (my_card.getid()) {
				case 0:
				forced_draw = true;
				break;
				case 1:
				if (opp_card.getid() === 7) {
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
			switch (opp_card.getid()) {
				case 0:
				forced_draw = true;
				break;
				case 1:
				if (my_card.getid() === 7) {
					this.round_value+=3
					return false;
				}
				break;
				case 2:
				this.opponent_will_peek = true;
				break;
				case 3:
				reversed_duel = true;
				break;
				case 4:
				break;
				case 5:
				break;
				case 6:
				this.opponent_has_advantage = true;
				break;
				case 7:
				reverse_broken = true;
				break;
			}
		}

		if (this.opponent_will_peek && this.player_will_peek) {
			this.opponent_will_peek = false;
			this.player_will_peek = false;
		}

		if (forced_draw) {return null;}

		let my_rank = my_card.getid() + (player_advantage? 2:0);
		let opp_rank = opp_card.getid() + (opponent_advantage? 2:0);
		console.log(my_rank, opp_rank)
		let player_wins = null;
		if (my_rank > opp_rank) {
			player_wins = !(reversed_duel && !reverse_broken)
		} else if (my_rank < opp_rank) {
			player_wins = (reversed_duel && !reverse_broken)
		} else {
			player_wins = null;
		}

		if (player_wins === true && my_card.getid() === 4 || player_wins === false && opp_card.getid() === 4 || player_wins === null && (my_card.getid() === 4 || opp_card.getid())) {
			this.round_value+=1;
		}

		return player_wins;
	}

	checkwinner() {
		if (this.my_score >= 4 || this.turn >= 8 && this.my_score > this.opp_score) {
			alert("Вы победили!");
		} else if (this.opp_score >= 4 || this.turn >= 8 && this.my_score < this.opp_score) {
			alert("Вы проиграли.");
		} else if (this.turn >= 8) {
			alert("Ничья.");
		};
	}

	mouseClickHandler(e) {
		console.log(e);
		for (const c of Object.values(this.cards)) {
			if (c.onclick(e)) {
				this.turn++;
				this.wait(140*17);
				console.log("Вы сыграли:", c.getname());
				let card = this.preview_card;
				if (!this.player_will_peek) {
					card = this.opp_cards[TheOpponent.decide(this, c)];
					setTimeout(function(scene) {
						card.setsize(scene.size_mult*34, scene.size_mult*45);
						card.setpos(scene.x/2+64, -180);
						card.setdest(scene.x/2+64,scene.y/2-200);
						card.move();
						scene.winner = scene.evaluate(c, card);
					},30*17,this);
				} else {
					setTimeout(function(scene) {
						TheOpponent.player_choices[c.getid()] = null;
						scene.winner = scene.evaluate(c, card);
					},30*17,this);
				}
				setTimeout(function(scene) {
					if (scene.winner === true) {
						scene.my_score+=scene.round_value;
						scene.round_value = 1;
					} else if (scene.winner === false) {
						scene.opp_score+=scene.round_value;
						scene.round_value = 1;
					} else {
						scene.round_value++;
					}
				},60*17,this)
				setTimeout(function(scene) {
					c.hide()
					card.hide();
					scene.checkwinner();
				},120*17,this)
				this.player_will_peek = false;
				this.preview_card = null;
				break;
			}
		}
		/*for (const c of Object.values(this.opp_cards)) {
			c.onclick(e);
		}*/
	}

	drawCards(ctx) {
		for (const c of Object.values(this.cards)) {
			c.draw(ctx);
		}
		for (const c of Object.values(this.opp_cards)) {
			c.draw(ctx);
		}
	}
}

let TheScene = new Scene();
export default TheScene;