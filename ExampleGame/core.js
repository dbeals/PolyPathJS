function createCanvas(canvasWidth, canvasHeight) {
	var centerElement = $("<center></center>");
	var canvasElement = $("<canvas id='gameCanvas' width='" + canvasWidth + "' height='" + canvasHeight + "'>Your browser does not support the HTML5 canvas tag.</canvas>");

	canvasElement.appendTo(centerElement);
	centerElement.appendTo('body');
	return canvasElement.get(0).getContext("2d");
}

function startGameLoop(updateFunction, drawFunction, FPS) {
	var lastTimestamp = 0;
	setInterval(function() {
		var currentTimestamp = Date.now();
		var delta = (currentTimestamp - lastTimestamp) / 1000;

		updateFunction(Math.min(delta, FPS / 1000));
		drawFunction();
		lastTimestamp = currentTimestamp;
	}, 1000 / FPS);
}