var gameManager;
var interfaceManager;

function setup() {
	gameManager = new GameManager();
	interfaceManager = new InterfaceManager();
	interfaceManager.setup();
}

function draw() {
	if (gameManager.grid) {
	 	gameManager.grid.update();
	}

	interfaceManager.updateTimer();
}

function mousePressed() {
	gameManager.mousePressed();
}