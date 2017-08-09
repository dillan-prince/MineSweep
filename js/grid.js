function Grid(numColumns, numRows, cellWidth) {
	this.numColumns = numColumns;
	this.numRows = numRows;
	this.array = make2DCellArray(numColumns, numRows, cellWidth);

	function make2DCellArray(numColumns, numRows, cellWidth) {
		var array = new Array(numColumns);

		for (var i = 0; i < numColumns; i++) {
			array[i] = new Array(numRows);

			for (var j = 0; j < numRows; j++) {
				array[i][j] = new Cell(i, j, cellWidth);
			}
		}

		return array;
	}
}

Grid.prototype.update = function() {
	this.array.forEach((column) => {
		column.forEach((cell) => {
			cell.show();
		});
	});

	if (gameManager.isGameOver) {
		if (gameManager.playerWon) {
			gameManager.art.playerWon();
		} else if (gameManager.playerLost) {
			gameManager.art.playerLost();
		}
	}
}

Grid.prototype.generateMines = function(columnIndex, rowIndex, numMines) {
	var options = []
	for (var i = 0; i < this.numColumns; i++) {
		for (var j = 0; j < this.numRows; j++) {
			if ((i < columnIndex - 1 || i > columnIndex + 1) || (j < rowIndex - 1 || j > rowIndex + 1)) {
				options.push({i: i, j: j});
			}
		}
	}
	
	for (var mineCount = 0; mineCount < numMines; mineCount++) {
		var index = floor(random(options.length));
		
		var i = options[index].i;
		var j = options[index].j;
		
		options.splice(index, 1);
		
		this.array[i][j].isMine = true;
	}
}

Grid.prototype.countNeighboringMines = function(cell) {
	this.array.forEach((column) => {
		column.forEach((cell) => {
			if (cell.isMine) {
				cell.totalNeighboringMines = -1;
				return;
			}

			var totalNeighboringMines = 0;
			for (var xOffset = -1; xOffset <= 1; xOffset++) {
				for (var yOffset = -1; yOffset <= 1; yOffset++) {
					var i = cell.columnIndex + xOffset;
					var j = cell.rowIndex + yOffset;

					if ((0 <= i && i < this.numColumns) && (0 <= j && j < this.numRows)) {
						if (this.array[i][j].isMine) {
							totalNeighboringMines++;
						}
					}
				}
			}

			cell.totalNeighboringMines = totalNeighboringMines;
		});
	});
}

Grid.prototype.countNeighboringFlags = function(columnIndex, rowIndex) {
	var totalNeighboringFlags = 0;
	for (var xOffset = -1; xOffset <= 1; xOffset++) {
		for (var yOffset = -1; yOffset <= 1; yOffset++) {
			var i = columnIndex + xOffset;
			var j = rowIndex + yOffset;

			if (0 <= i && i < this.numColumns && 0 <= j && j < this.numRows) {
				if (this.array[i][j].isFlagged) {
					totalNeighboringFlags++;
				}
			}
		}
	}

	return totalNeighboringFlags;
}

Grid.prototype.allCellsNotRevealed = function() {
	return this.array.every((column) => {
		return column.every((cell) => {
			return !cell.isRevealed;
		});
	});
}

Grid.prototype.reveal = function(columnIndex, rowIndex) {
	if (this.array[columnIndex][rowIndex].isFlagged) {
		return;
	}

	if (this.array[columnIndex][rowIndex].isRevealed) {
		if (this.array[columnIndex][rowIndex].totalNeighboringMines > 0 && this.countNeighboringFlags(columnIndex, rowIndex) == this.array[columnIndex][rowIndex].totalNeighboringMines) {
			this.chord(columnIndex, rowIndex);
		}

		return;
	}

	this.array[columnIndex][rowIndex].isRevealed = true;

	if (this.array[columnIndex][rowIndex].isMine) {
		gameManager.lose();
	} else if (this.array[columnIndex][rowIndex].totalNeighboringMines == 0) {
		this.chord(columnIndex, rowIndex);
	}

}

Grid.prototype.flag = function(columnIndex, rowIndex) {
	this.array[columnIndex][rowIndex].flag();
}

Grid.prototype.chord = function(columnIndex, rowIndex) {
	for (var xOffset = -1; xOffset <= 1; xOffset++) {
		for (var yOffset = -1; yOffset <= 1; yOffset++) {
			var i = columnIndex + xOffset;
			var j = rowIndex + yOffset;

			if (0 <= i && i < this.numColumns && 0 <= j && j < this.numRows) {
				if (!this.array[i][j].isRevealed) {
					this.reveal(i, j);
				}
			}
		}
	}
}

Grid.prototype.allEmptyCellsRevealed = function() {
	return this.array.every((column) => {
		return column.every((cell) => {
			return (!cell.isMine && cell.isRevealed) || (cell.isMine && !cell.isRevealed);
		});
	});
}

Grid.prototype.flagAllMines = function() {
	this.array.forEach((column) => { 
		column.filter((cell) => { 
			return cell.isMine; 
		}).forEach((cell) => { 
			cell.isFlagged = true; 
		}) 
	});

	interfaceManager.updateMinesFound();
}

Grid.prototype.revealAllCells = function() {
	this.array.forEach((column) => {
		column.forEach((cell) => {
			this.reveal(cell.columnIndex, cell.rowIndex);
		});
	});
}

Grid.prototype.findTotalMinesFound = function() {
	return this.array.reduce((totalFlagged, column) => {
		return totalFlagged + column.map((cell) => {
			return cell.isFlagged;
		}).reduce((totalFlagged, isFlagged) => {
			if (isFlagged) totalFlagged++;
			return totalFlagged;
		}, 0);
	}, 0);
}