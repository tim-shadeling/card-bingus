import TheScene from "./scene.mjs";

const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
var interval = null;
const x = canvas.width
const y = canvas.height

document.addEventListener("mousemove", function(e){TheScene.mouseMoveHandler(e)}, false);
document.addEventListener("click", function(e){TheScene.mouseClickHandler(e)}, false);

function drawTexts(score) {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Карты противника", x-190, 35);
	ctx.fillText("Счет: "+TheScene.my_score+":"+TheScene.opp_score, 20, 35);
}

function drawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawTexts();
	TheScene.drawCards(ctx);
}

function update() {
	drawAll();
}

function startGame() {
	interval = setInterval(update, 17);
}

startGame();