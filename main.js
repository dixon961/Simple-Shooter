/* W - 87 | S - 83 | A - 65 | D - 68 | SPACE - 32 | CTRL - 17 | SHIFT - 16 | ALT - 18
*
*
*
*/
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var Rect = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

function overlaps(r1, r2){
	return !(r1.x + r1.width < r2.x || 
           r1.x > r2.x + r2.width || 
           r1.y + r1.height < r2.y ||
           r1.y > r2.y + r2.height);
}

var enemyQ = 10;
var borderWidth = 5;
var  gameOverImage = new Image();
gameOverImage.src = "over.png";
var leftBorder = new Rect(0, 0, borderWidth, canvas.height);
var rightBorder = new Rect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
var topBorder = new Rect(0, 0, canvas.width, borderWidth);
var bottomBorder = new Rect(0, canvas.height - borderWidth, canvas.width, borderWidth);

var mouse = {
	x : 0,
	y : 0
};
var player = {
	x : canvas.width / 2,
	y : canvas.height / 2,
	width : 35,
	height : 35,
	dy : 0,
	dx : 0,
	speed : 1.7,
	color : "#336699",
	rect : new Rect(this.x, this.y, this.width, this.height),
	update : function(keys) {
		this.rect.x = this.x;
		this.rect.y = this.y;
		this.rect.width = this.width;
		this.rect.height = this.height;
		this.x += this.speed * this.dx;
		this.y += this.speed * this.dy;
		if (keys.upPressed)
			this.dy = -1;
		if (keys.downPressed)
			this.dy = 1;
		if (keys.rightPressed)
			this.dx = 1;
		if (keys.leftPressed)
			this.dx = -1;
		if (!keys.upPressed && !keys.downPressed)
			this.dy = 0;
		if (!keys.rightPressed && !keys.leftPressed)
			this.dx = 0;
		if (overlaps(leftBorder, this.rect)){
			this.x = leftBorder.width + 0.0000001;
		}
		if (overlaps(rightBorder, this.rect)){
			this.x = rightBorder.x - this.width - 0.0000001;
		}
		if (overlaps(topBorder, this.rect)){
			this.y = topBorder.y + topBorder.height +  0.0000001;
		}
		if (overlaps(bottomBorder, this.rect)){
			this.y = bottomBorder.y - this.height - 0.0000001;
		}
	}
};
var keys = {
	rightPressed : false,
	leftPressed : false,
	upPressed : false,
	downPressed : false,
	spacePressed : false,
	shiftPressed : false,
	altPressed : false,
	ctrlPressed : false,
	mousePressed : false
};
var gameState = {
	play : true,
	gameOver : false
};
var bullet = {
	x : player.x + player.width / 2,
	y : player.y + player.height / 2,
	width : 4,
	height : 4,
	dy : 0,
	dx : 0,
	speed : 5,
	flying : false,
	color : "#111111",
	rect : new Rect(this.x, this.y, this.width, this.height),
	update : function(keys) {
		this.rect.x = this.x;
		this.rect.y = this.y;
		this.rect.width = this.width;
		this.rect.height = this.height;
		if (this.flying){
			this.x += this.speed * this.dx;
			this.y += this.speed * this.dy;
		}
		else {
			this.x = player.x + player.width / 2;
			this.y = player.y + player.height / 2;
		}
		
		if (keys.mousePressed && !this.flying) {
			this.flying = true;
			var deltaX = mouse.x - (player.x + player.width / 2);
			var deltaY = mouse.y - (player.y + player.height / 2);
			if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) === Math.abs(deltaX)){
				if (deltaX > 0){
					this.dx = 1;
					this.dy = this.dx / deltaX * deltaY;
				}
				else {
					this.dx = -1;
					this.dy = this.dx / deltaX * deltaY;
				}
			}
			else {
				if (deltaY < 0){
					this.dy = -1;
					this.dx = this.dy / deltaY * deltaX;
				}
				else {
					this.dy = 1;
					this.dx = this.dy / deltaY * deltaX;
				}
			}
			
		}
		if (overlaps(leftBorder, this.rect)){
			this.flying = false;
			this.x = player.x + player.width / 2;
			this.y = player.y + player.height / 2;
			this.dx = 0;
			this.dy = 0;
		}
		if (overlaps(rightBorder, this.rect)){
			this.flying = false;
			this.x = player.x + player.width / 2;
			this.y = player.y + player.height / 2;
			this.dx = 0;
			this.dy = 0;
		}
		if (overlaps(topBorder, this.rect)){
			this.flying = false;
			this.x = player.x + player.width / 2;
			this.y = player.y + player.height / 2;
			this.dx = 0;
			this.dy = 0;
		}
		if (overlaps(bottomBorder, this.rect)){
			this.flying = false;
			this.x = player.x + player.width / 2;
			this.y = player.y + player.height / 2;
			this.dx = 0;
			this.dy = 0;
		}
	}
};
var enemies = [];
for (var i = 0; i < enemyQ; i++){
	enemies[i] = new Rect(Math.floor(Math.random() * (canvas.width - 20)), Math.floor(Math.random() * (canvas.height - 20)), 20, 20);
	enemies[i].color = "#999900";
	if (Math.round(Math.random()) == 0){
		enemies[i].dx = Math.round(Math.random()) * 2 - 1;
		enemies[i].dy = Math.random() * 2 - 1;
	}
	else {
		enemies[i].dy = Math.round(Math.random()) * 2 - 1;
		enemies[i].dx = Math.random() * 2 - 1;
	}	
	enemies[i].speed = 1.2;
}

function updateEnemies() {
	for (var i = 0; i < enemies.length; i++){
		enemies[i].x += enemies[i].speed * enemies[i].dx;
		enemies[i].y += enemies[i].speed * enemies[i].dy;
		if (overlaps(leftBorder, enemies[i])){
			enemies[i].dx *= -1;
		}
		if (overlaps(rightBorder, enemies[i])){
			enemies[i].dx *= -1;
		}
		if (overlaps(topBorder, enemies[i])){
			enemies[i].dy *= -1;
		}
		if (overlaps(bottomBorder, enemies[i])){
			enemies[i].dy *= -1;
		}
		if (overlaps(bullet.rect, enemies[i])){
			enemies.splice(i, 1);
			bullet.flying = false;
			bullet.x = player.x + player.width / 2;
			bullet.y = player.y + player.height / 2;
			bullet.dx = 0;
			bullet.dy = 0;
			for (var j = 0; j < enemies.length; j++){
				enemies[j].speed += 0.3;
			}
		}
		if (overlaps(player.rect, enemies[i])){
			gameState.play = false;
		}

	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
    	case 87:
    		keys.upPressed = true;
    		break;
    	case 83:
    		keys.downPressed = true;
    		break;
    	case 65:
    		keys.leftPressed = true;
    		break;
    	case 68:
    		keys.rightPressed = true;
    		break;
    	case 32:
    		keys.spacePressed = true;
    		break;
    	case 17:
    		keys.ctrlPressed = true;
    		break;
    	case 16:
    		keys.shiftPressed = true;
    		break;
    	case 18:
    		keys.altPressed = true;
    		break;
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
    	case 87:
    		keys.upPressed = false;
    		break;
    	case 83:
    		keys.downPressed = false;
    		break;
    	case 65:
    		keys.leftPressed = false;
    		break;
    	case 68:
    		keys.rightPressed = false;
    		break;
    	case 32:
    		keys.spacePressed = false;
    		break;
    	case 17:
    		keys.ctrlPressed = false;
    		break;
    	case 16:
    		keys.shiftPressed = false;
    		break;
    	case 18:
    		keys.altPressed = false;
    		break;
    }
}

function mouseMoveHandler(e) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
}

function mouseDownHandler(e){
	keys.mousePressed = true;
}

function mouseUpHandler(e){
	keys.mousePressed = false;
}

function resetAll(){
	player.x = canvas.width / 2,
	player.y = canvas.height / 2
	for (var i = 0; i < enemyQ; i++){
		enemies[i] = new Rect(Math.floor(Math.random() * (canvas.width - 20)), Math.floor(Math.random() * (canvas.height - 20)), 20, 20);
		enemies[i].color = "#999900";
		if (Math.round(Math.random()) == 0){
			enemies[i].dx = Math.round(Math.random()) * 2 - 1;
			enemies[i].dy = Math.random() * 2 - 1;
		}
		else {
			enemies[i].dy = Math.round(Math.random()) * 2 - 1;
			enemies[i].dx = Math.random() * 2 - 1;
		}
		enemies[i].speed = 1.2;
	}
	gameState.play = true;
}

function drawRect(x, y, w, h, color){
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawCircle(x, y, r, color){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.closePath();
}

function drawBorder(color){
	drawRect(leftBorder.x, leftBorder.y, leftBorder.width, leftBorder.height, color);
	drawRect(rightBorder.x, rightBorder.y, rightBorder.width, rightBorder.height, color);
	drawRect(topBorder.x, topBorder.y, topBorder.width, topBorder.height, color);
	drawRect(bottomBorder.x, bottomBorder.y, bottomBorder.width, bottomBorder.height, color);
}

function drawEnd(){
	ctx.drawImage(gameOverImage, 0, 0);
}

function mainLoop() {
	if (gameState.play){
		if (!(enemies.length === 0)) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color);
			drawRect(player.x, player.y, player.width, player.height, player.color);
			for (var i = 0; i < enemies.length; i++){
				drawRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height, enemies[i].color);
			}		
			drawBorder("#222222");
			player.update(keys);
			bullet.update(keys);
			updateEnemies();
		}
		else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBorder("#222222");
			if (keys.spacePressed){
				resetAll();
			}
		}
		
	}
	else {
		drawEnd();
	}
	if (keys.spacePressed){
		resetAll();
	}
}

setInterval(mainLoop, 10);