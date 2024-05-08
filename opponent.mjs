import {randint} from "./utils.mjs";

const decider = [
	[null,	null,	null,	null,	null,	false,	null,	null	],
	[null,	null,	false,	true,	false,	false,	false,	true	],
	[null,	true,	null,	true,	false,	false,	false,	false	],
	[null,	false,	false,	null,	true,	false,	false,	false	],
	[null,	true,	true,	false,	null,	false,	false,	false	],
	[true,	true,	true,	true,	true,	null,	false,	false	],
	[null,	true,	true,	false,	true,	true,	null,	false	],
	[null,	false,	true,	true,	true,	true,	true,	false	],
];

const brain = [
	[	4,	1,	10,	6,	6,	2,	10,	2,	], // 000 
	[	1,	1,	1,	0,	4,	4,	0,	2,	], // 001
	[	2,	2,	0,	1,	1,	0,	1,	2,	], // 010
	[	1,	4,	0,	0,	0,	8,	0,	6,	], // 011
	[	1,	0,	4,	3,	4,	4,	4,	10,	], // 100
	[	2,	0,	2,	0,	10, 99,	0,	10,	], // 101
	[	1,	0,	1,	0,	5,	10,	10,	99,	], // 110
	[	1,	0,	1,	0,	5,	10,	10,	99,	], // 111
];

class Opponent {
	constructor() {
		this.choices = {}
		this.player_choices = {}
		for (let i = 0; i < 8; i++) {
			this.choices[i] = true;
			this.player_choices[i] = true;
		}
	}

	decide(scene, player_card) {
		if (scene.opponent_will_peek) {
			// perfect counter
		}

		if (scene.player_will_peek) {
			// riskless choices
		}

		if (scene.turn >= 5) {
			// pure logic
		}
		
		let my_advantage = (scene.opponent_has_advantage? 1:0);
		let player_advantage = (scene.player_has_advantage? 2:0);
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
		let choice = randint(1, last_sum);
		console.log(choice);
		for (const [k,v] of Object.entries(sums)){
			if (choice <= v){choice = k; break;}
		}

		this.choices[choice] = null;
		if (player_card != null) {this.player_choices[player_card.getid()] = null;}
	
		console.log(choice);
		return choice;
	}
}

let TheOpponent = new Opponent();
export default TheOpponent;