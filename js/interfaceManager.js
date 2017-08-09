function InterfaceManager() {}

InterfaceManager.prototype.setup = function() {
	$('#bestTime').text("-");

	// buttons
	$('#quitButton').addClass("disabled");
	$('#resetButton').addClass("disabled");

	// radio buttons
	$("#radioBeginner").prop("checked", true);

	this.configureRadioButtons(9, 9, 10, true);
	this.bindControls();
}

InterfaceManager.prototype.bindControls = function() {
	$('#radioBeginner').on('click', () => {
		if ($('#radioBeginner').hasClass("disabled")) {
			return;
		}

		gameManager.difficulty = 0;
		this.configureRadioButtons(9, 9, 10, true);
	});

	$('#radioIntermediate').on('click', () => {
		if ($('#radioIntermediate').hasClass("disabled")) {
			return;
		}

		gameManager.difficulty = 1;
		this.configureRadioButtons(16, 16, 40, true);
	});

	$('#radioExpert').on('click', () => {
		if ($('#radioExpert').hasClass("disabled")) {
			return;
		}

		gameManager.difficulty = 2;
		this.configureRadioButtons(16, 30, 99, true);
	});

	$('#radioCustom').on('click', () => {
		if ($('#radioCustom').hasClass("disabled")) {
			return;
		}

		gameManager.difficulty = 3;
		this.configureRadioButtons("", "", "", false);
	});

	$('#playButton').on('click', () => {
		if ($('#playButton').hasClass("disabled")) {
			return;
		}

		gameManager.startGame();
	});
}

InterfaceManager.prototype.isFormValid = function() {
	var rows = parseInt($('#gridHeight').val());
	var columns = parseInt($('#gridWidth').val());
	var mines = parseInt($('#numberOfMines').val());

	return (rows !== NaN && rows >= 9 && rows <= 50) 
	&& (columns !== NaN && columns >= 9 && columns <= 50) 
	&& (mines !== NaN && mines >= 1 && mines <= (rows * columns) / 2);
}

InterfaceManager.prototype.configureRadioButtons = function(height, width, numberOfMines, enabled) {
	$("#gridHeight").val(height);
	$("#gridWidth").val(width);
	$("#numberOfMines").val(numberOfMines);
	$("#gridHeight").prop("disabled", enabled);
	$("#gridWidth").prop("disabled", enabled);
	$("#numberOfMines").prop("disabled", enabled);
}

InterfaceManager.prototype.updateMinesFound = function() {
	var minesFound = gameManager.findTotalMinesFound();
	$('#minesFound').text(`${minesFound}/${gameManager.numMines}`);
}

InterfaceManager.prototype.updateTimer = function() {
	if (!gameManager.timeStarted) {
		return;
	}

	gameManager.ellapsedTime = millis() - gameManager.timeStarted;
	$("#timer").text(this.getFormattedTime(gameManager.ellapsedTime));
}

InterfaceManager.prototype.updateBestTime = function() {
	if (gameManager.bestTime === null) {
		$("#bestTime").text("-");
	} else {
		$("#bestTime").text(this.getFormattedTime(gameManager.bestTime));
	}
}

InterfaceManager.prototype.getFormattedTime = function(ellapsedTime) {
	var minutes = parseInt(ellapsedTime / 60000);
	var seconds = parseInt((ellapsedTime - minutes * 60000) / 1000);
	var milliseconds = parseInt((ellapsedTime - minutes * 60000) - seconds * 1000);
	
	return `${("  0" + minutes).slice(-4)}:${("00" + seconds).slice(-2)}.${("000" + milliseconds).slice(-3)}`;
}