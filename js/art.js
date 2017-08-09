function Art() {}

Art.prototype.drawBlankCell = function(cell) {
	this.drawCell(cell, 255);
}

Art.prototype.drawCell = function(cell, fillColor) {
	stroke(0);
	fill(fillColor);
	rect(cell.cellPosition.x, 
		cell.cellPosition.y, 
		gameManager.cellWidth, 
		gameManager.cellWidth);
}

Art.prototype.drawCellText = function(cell) {
	this.drawCell(cell, 200);

	textAlign(CENTER);
	fill(0);
	textSize(gameManager.cellWidth * .6);

	text(cell.totalNeighboringMines == 0 
		? '' 
		: cell.totalNeighboringMines, 
		cell.cellPosition.x + gameManager.cellWidth / 2, 
		cell.cellPosition.y + gameManager.cellWidth * .7);
}

Art.prototype.drawMine = function(cell) {
	this.drawCell(cell, 200);

	fill(80);

	triangle(cell.cellPosition.x + gameManager.cellWidth * .2,
		cell.cellPosition.y + gameManager.cellWidth * .2,
		cell.cellPosition.x + gameManager.cellWidth * .3,
		cell.cellPosition.y + gameManager.cellWidth * .45,
		cell.cellPosition.x + gameManager.cellWidth * .45,
		cell.cellPosition.y + gameManager.cellWidth * .3);

	rect(cell.cellPosition.x + gameManager.cellWidth * .4625,
		cell.cellPosition.y + gameManager.cellWidth * .16,
		gameManager.cellWidth * .075,
		gameManager.cellWidth * .34);

	triangle(cell.cellPosition.x + gameManager.cellWidth * .8,
		cell.cellPosition.y + gameManager.cellWidth * .2,
		cell.cellPosition.x + gameManager.cellWidth * .7,
		cell.cellPosition.y + gameManager.cellWidth * .45,
		cell.cellPosition.x + gameManager.cellWidth * .55,
		cell.cellPosition.y + gameManager.cellWidth * .3);

	rect(cell.cellPosition.x + gameManager.cellWidth * .5,
		cell.cellPosition.y + gameManager.cellWidth * .4625,
		gameManager.cellWidth * .34,
		gameManager.cellWidth * .075);

	triangle(cell.cellPosition.x + gameManager.cellWidth * .8,
		cell.cellPosition.y + gameManager.cellWidth * .8,
		cell.cellPosition.x + gameManager.cellWidth * .7,
		cell.cellPosition.y + gameManager.cellWidth * .55,
		cell.cellPosition.x + gameManager.cellWidth * .55,
		cell.cellPosition.y + gameManager.cellWidth * .7);

	rect(cell.cellPosition.x + gameManager.cellWidth * .4625,
		cell.cellPosition.y + gameManager.cellWidth * .5,
		gameManager.cellWidth * .075,
		gameManager.cellWidth * .34);

	triangle(cell.cellPosition.x + gameManager.cellWidth * .2,
		cell.cellPosition.y + gameManager.cellWidth * .8,
		cell.cellPosition.x + gameManager.cellWidth * .3,
		cell.cellPosition.y + gameManager.cellWidth * .55,
		cell.cellPosition.x + gameManager.cellWidth * .45,
		cell.cellPosition.y + gameManager.cellWidth * .7);

	rect(cell.cellPosition.x + gameManager.cellWidth * .16,
		cell.cellPosition.y + gameManager.cellWidth * .4625,
		gameManager.cellWidth * .34,
		gameManager.cellWidth * .075);

	ellipse(cell.cellPosition.x + gameManager.cellWidth / 2, 
		cell.cellPosition.y + gameManager.cellWidth / 2, 
		gameManager.cellWidth / 2);
}

Art.prototype.drawFlag = function(cell) {
	this.drawCell(cell, 255);
	
	fill(127);
	rect(cell.cellPosition.x + gameManager.cellWidth * .3,
		cell.cellPosition.y + gameManager.cellWidth * .2, 
		gameManager.cellWidth * .050, 
		gameManager.cellWidth * .600);

	fill(255, 0 , 0);
	triangle(cell.cellPosition.x + gameManager.cellWidth * .360,
		cell.cellPosition.y + gameManager.cellWidth * .600,
		cell.cellPosition.x + gameManager.cellWidth * .360,
		cell.cellPosition.y + gameManager.cellWidth * .200,
		cell.cellPosition.x + gameManager.cellWidth * .775,
		cell.cellPosition.y + gameManager.cellWidth * .400);
}

Art.prototype.drawFalseFlag = function(cell) {
	this.drawFlag(cell);

	
	strokeWeight(2);
	line(cell.cellPosition.x + gameManager.cellWidth * .2,
		cell.cellPosition.y + gameManager.cellWidth * .2,
		cell.cellPosition.x + gameManager.cellWidth * .8,
		cell.cellPosition.y + gameManager.cellWidth * .8);

	line(cell.cellPosition.x + gameManager.cellWidth * .8,
		cell.cellPosition.y + gameManager.cellWidth * .2,
		cell.cellPosition.x + gameManager.cellWidth * .2,
		cell.cellPosition.y + gameManager.cellWidth * .8);
	strokeWeight(1);
}

Art.prototype.playerWon = function() {
	textSize(60);
	textAlign(CENTER);
	fill(200, 30, 30);
	stroke(0);
	strokeWeight(4);
	text("You Win!", width / 2, (height - gameManager.cellWidth + 1) / 2);
	strokeWeight(1);
}

Art.prototype.playerLost = function() {
	textSize(60);
	textAlign(CENTER);
	fill(200, 30, 30);
	stroke(0);
	strokeWeight(4);
	text("You Lose...", width / 2, (height - gameManager.cellWidth + 1) / 2);
	strokeWeight(1);
}
