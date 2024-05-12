import * as utils from "./utils.mjs";

const decider = [];
decider[0] = [	// no buffs
	[null,	null,	null,	null,	null,	false,	null,	null	],
	[null,	null,	false,	true,	false,	false,	false,	true	],
	[null,	true,	null,	true,	false,	false,	false,	false	],
	[null,	false,	false,	null,	true,	false,	true,	false	],
	[null,	true,	true,	false,	null,	false,	false,	false	],
	[true,	true,	true,	true,	true,	null,	false,	false	],
	[null,	true,	true,	false,	true,	true,	null,	false	],
	[null,	false,	true,	true,	true,	true,	true,	null	],
];
decider[1] = [ // opp has buff
	[null,	null,	null,	null,	null,	false,	null,	null	],
	[null,	true,	true,	null,	false,	false,	false,	true	],
	[null,	true,	true,	false,	null,	false,	false,	false	],
	[null,	false,	false,	false,	false,	null,	true,	false	],
	[null,	true,	true,	false,	true,	true,	null,	false	],
	[true,	true,	true,	true,	true,	true,	true,	null	],
	[null,	null,	null,	null,	null,	null,	null,	null	], // never happens!
	[null,	false,	true,	true,	true,	true,	true,	null	],
];
decider[2] = [ // player has buff 					!!!!!
	[null,	null,	null,	null,	null,	false,	null,	null	],
	[null,	false,	false,	true,	false,	false,	null,	true	],
	[null,	false,	false,	true,	false,	false,	null,	false	],
	[null,	null,	true,	true,	true,	false,	null,	false	],
	[null,	true,	null,	true,	false,	false,	null,	false	],
	[true,	true,	true,	null,	false,	false,	null,	false	],
	[null,	true,	true,	false,	null,	false,	null,	false	],
	[null,	false,	true,	true,	true,	null,	null,	false	],
];

const brain = [
	[	7,	1,	10,	8,	6,	1,	10,	2,	], // 000 
	[	1,	1,	1,	0,	4,	4,	0,	2,	], // 001
	[	2,	2,	0,	1,	1,	0,	1,	2,	], // 010
	[	1,	4,	0,	0,	0,	8,	0,	6,	], // 011
	[	1,	0,	4,	3,	4,	4,	4,	10,	], // 100
	[	2,	0,	2,	0,	10, 99,	0,	10,	], // 101
	[	1,	0,	1,	0,	5,	10,	10,	99,	], // 110
	[	1,	0,	1,	0,	5,	10,	10,	99,	], // 111
];

const counters = [
	[	[4,	5],	3,	6,	0,	1,	7,	],
	[	4,	6,	0,	5,	1,	3,	7,	],
	[	[4,	5],	6,	7,	3,	1,	0,	],
	[	[1,	3],[0,	5],	7,	6,	4,	],
	[	[3,	6],	5,	[0,	4],	7,	1,	],
	[	6,	7,	5,	3,	4,	[1,	0],	],
	[	3,	6,	0,	7,	4,	5,	1,	],
	[	1,	0,	7,	3,	4,	6,	5,	],
];

const counters_buffed = [
	[	[4,	5],	3,	6,	0,	1,	7,	],
	[	4,	6,	0,	5,	3,	1,	7,	],
	[	5,	6,	3,	4,	7,	1,	0,	],
	[	3,	1,	0,	[5,	7],	6,	4,	],
	[	3,	6,	0,	7,	5,	4,	1,	],
	[	7,	3,	4,	6,	5,	[1,	0],	],
	[	3,	6,	0,	7,	4,	5,	1,	], // never happens!
	[	1,	0,	7,	3,	4,	6,	5,	],
];

const safe_options = 		[	[0,	3],	[4,	2, 6],	5,	1,	7,	];
const safe_options_buffed = [	5,	0,	2,	4,	3,	1,	7,	6	];

class Opponent {
	constructor() {
		this.choices = {}
		this.player_choices = {}
		for (let i = 0; i < 8; i++) {
			this.choices[i] = true;
			this.player_choices[i] = true;
		}
	}

	Decide(scene, player_card) {
		let choice = null;
		let my_advantage = (scene.opp_has_advantage? 1:0);
		let player_advantage = (scene.player_has_advantage? 2:0);
		if (scene.opp_will_peek) {
			let counter_table = (player_advantage!=0? counters_buffed:counters);
			let sequence = counter_table[player_card.id];
			for (const c of sequence) {
				if (typeof(c) === "number" && this.choices[c]) {
					choice = c;
					break;
				} else if (typeof(c) != "number") {
					let variants = [];
					for (const v of c) {
						if (this.choices[v]) {variants.push(v);}
					}
					if (variants.length > 0) {
						choice = variants[utils.randint(0,variants.length)]
						break;
					}
				}
			}
			console.log("В ответ на карту", player_card.id, "сыграю", choice);
		} else if (scene.player_will_peek) {
			let safe_table = (my_advantage!=0? safe_options_buffed:safe_options);
			for (const c of safe_table) {
				console.log(c);
				if (typeof(c) === "number" && this.choices[c]) {
					choice = c;
					break;
				} else if (typeof(c) != "number") {
					let variants = [];
					for (const v of c) {
						if (this.choices[v]) {variants.push(v);}
					}
					if (variants.length > 0) {
						choice = variants[utils.randint(0,variants.length)]
						break;
					}
				}
			}
			console.log("Игрок подглядывает, так что поставлю карту", choice);
		} else if (scene.turn >= 5) {
			let best_card = null;
			let best_count = -1;
			let counter = 0;
			let deciding_table = decider[(my_advantage + player_advantage) % 3]
			for (const [opp_c, x] of Object.entries(this.choices)) {
				if (x === null) {continue;}
				for (const [player_c, y] of Object.entries(this.player_choices)) {
					if (y === null) {continue;}
					if (deciding_table[opp_c][player_c] == true) {counter++;}
				}
				if (counter > best_count) {
					best_card = opp_c;
					best_count = counter;
				}
				counter = 0
			}
			choice = best_card;
			console.log("Лучший выбор -- это карта", choice);
		} else {
			let no_prince_counters = (this.player_choices[0] && this.player_choices[1] && this.player_choices[7]? 0:4);
			let neuron = brain[my_advantage + player_advantage + no_prince_counters];
			let last_sum = 0
			let sums = {};
			for (const [k,v] of Object.entries(this.choices)){
				if (v != null) {
					this.choices[k] = neuron[k];
					sums[k] = last_sum + neuron[k];
					last_sum+=neuron[k];
				} 
			}
			choice = utils.randint(1, last_sum);
			//console.log(choice);
			for (const [k,v] of Object.entries(sums)){
				if (choice <= v){choice = k; break;}
			}
			console.log("Попробую сыграть", choice);
		}

		this.choices[choice] = null;
		if (player_card != null) {this.player_choices[player_card.id] = null;}
	
		return choice;
	}
}

let TheOpponent = new Opponent();
export default TheOpponent;
