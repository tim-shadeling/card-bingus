import TheScene from "./scene.mjs";
import * as _C from "./constants.mjs";

const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
var interval = null;
const x = canvas.width
const y = canvas.height

document.addEventListener("mousemove", function(e){TheScene.MouseMoveHandler(e)}, false);
document.addEventListener("click", function(e){TheScene.MouseClickHandler(e)}, false);

function DrawTexts(score) {
	ctx.font = "20px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Карты противника", x-210, 35);
	ctx.fillText("Счет: "+TheScene.player_score+":"+TheScene.opp_score, 20, 35);
}

function DrawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	DrawTexts();
	TheScene.DrawCards(ctx);
	TheScene.DrawPointIndicators(ctx);
	TheScene.DrawBuff(ctx);
}

function Update() {
	DrawAll();
	if (TheScene.game_over) {clearInterval(interval);}
}

function startGame() {
	interval = setInterval(Update, _C.UPDATE_INTERVAL);
}

startGame();