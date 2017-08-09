function Cell(columnIndex, rowIndex, cellWidth) {
	this.columnIndex = columnIndex;
	this.rowIndex = rowIndex;

	this.cellPosition = {
		x: columnIndex * cellWidth,
		y: rowIndex * cellWidth
	};

	this.isMine = false;
	this.isRevealed = false;
	this.isFlagged = false;

	this.totalNeighboringMines = 0;
}

Cell.prototype.show = function() {
	if (this.isRevealed) {
		if (this.isMine) {
			gameManager.art.drawMine(this);
		} else {
			gameManager.art.drawCellText(this);
		}
	} else if (this.isFlagged) {
		if (!this.isMine && gameManager.isGameOver) {
			gameManager.art.drawFalseFlag(this);
		} else {
			gameManager.art.drawFlag(this);
		}
	} else {
		gameManager.art.drawBlankCell(this);
	}
}

Cell.prototype.flag = function () {
	this.isFlagged = this.isRevealed ? false : !this.isFlagged;
}