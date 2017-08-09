function GameManager() {
	this.grid;
	this.canvas;
	this.numMines;
	this.cellWidth = 40;

	this.difficulty = 0;
	this.isGameOver = true;
	this.playerWon = false;
	this.playerLost = false;

	this.timeStarted;
	this.ellapsedTime;
	this.bestTime;

	this.art = new Art();
}

GameManager.prototype.initCanvas = function() {
	if (this.canvas !== undefined) {
		noCanvas();
	}

	this.canvas = createCanvas(this.cellWidth * this.grid.numColumns + 1, this.cellWidth * (this.grid.numRows + 1));
	this.canvas.parent('canvasWrapper');
	this.canvas.position(($("#canvasWrapper").parent().innerWidth() - width)/2, 
		$("#gameInformation").innerHeight() + this.cellWidth);

	$('canvas').on('contextmenu', () => { return false; });
}

GameManager.prototype.initGrid = function() {
	var numRows = parseInt($('#gridHeight').val());
	var numColumns = parseInt($('#gridWidth').val());
	this.numMines = parseInt($('#numberOfMines').val());

	this.grid = new Grid(numColumns, numRows, this.cellWidth);
}

GameManager.prototype.startGame = function() {
	if (!interfaceManager.isFormValid()) {
		alert("Invalid game parameters.");
		return;
	}

	this.initGrid();
	this.initCanvas();
	

	this.isGameOver = false;
	this.playerWon = false;
	this.playerLost = false;

	this.timeStarted = millis();

	if (this.difficulty === 0) {
		this.bestTime = localStorage.getItem("beginnerBestTime");
	} else if (this.difficulty === 1) {
		this.bestTime = localStorage.getItem("intermediateBestTime");
	} else if (this.difficulty === 2) {
		this.bestTime = localStorage.getItem("expertBestTime");
	} else {
		this.bestTime = null;
	}

	interfaceManager.updateBestTime();

	if (this.bestTime === null) {
		this.bestTime = Number.MAX_SAFE_INTEGER;
	}
}

GameManager.prototype.mousePressed = function() {
	if (this.isGameOver) {
		return;
	}

	var columnIndex = floor(mouseX / this.cellWidth);
	var rowIndex = floor(mouseY / this.cellWidth);

	if (this.isClickOnGrid(columnIndex, rowIndex)) {
		if (mouseButton == LEFT) {
			this.ensureFirstClickSafe(columnIndex, rowIndex).then(() => {
				this.grid.reveal(columnIndex, rowIndex);

				if (this.grid.allEmptyCellsRevealed()) {
					this.win();
				}
			});
		} else if (mouseButton == RIGHT) {
			this.grid.flag(columnIndex, rowIndex);
			interfaceManager.updateMinesFound();
		}
	}
}

GameManager.prototype.isClickOnGrid = function(columnIndex, rowIndex) {
	return 0 <= columnIndex && columnIndex < this.grid.numColumns 
	&& 0 <= rowIndex && rowIndex < this.grid.numRows;
}

GameManager.prototype.ensureFirstClickSafe = async function(columnIndex, rowIndex) {
	var firstClick = this.grid.allCellsNotRevealed();

	if (firstClick) {
		await this.grid.generateMines(columnIndex, rowIndex, this.numMines);
		this.grid.countNeighboringMines();
	}
}

GameManager.prototype.findTotalMinesFound = function() {
	return this.grid.findTotalMinesFound();
}

GameManager.prototype.win = function() {
	this.endGame();

	this.playerWon = true;
	this.grid.flagAllMines();

	if (this.ellapsedTime < this.bestTime) {
		interfaceManager.updateBestTime();

		if (this.difficulty === 0) {
			localStorage.setItem("beginnerBestTime", this.bestTime);
		} else if (this.difficulty === 1) {
			localStorage.setItem("intermediateBestTime", this.bestTime);
		} else if (this.difficulty === 2) {
			localStorage.setItem("expertBestTime", this.bestTime);
		}
	}
}

GameManager.prototype.lose = function() {
	this.endGame();

	this.playerLost = true;
	this.grid.revealAllCells();
}

GameManager.prototype.endGame = function() {
	this.isGameOver = true;
	this.timeStarted = undefined;
}