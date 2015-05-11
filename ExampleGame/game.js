var displayWidth = 640;
var displayHeight = 480;

var graphics;
var input;

var pathingPolygon = new PathingPolygon();
pathingPolygon.useTightTests = true;
var pathfinder = new Pathfinder();
pathfinder.trimPaths = true;
var playerPoint = null;
var playerDestination = null;
var playerPath = null;

pathfinder.checkNode = function(column, row, userData) {
	var node = pathingPolygon.nodes[(row * pathingPolygon.width) + column];
	return node != null && node.isPathable;
}

$(document).ready(function() {
	graphics = new Graphics(displayWidth, displayHeight);
	graphics.clearColor = '#000000';

	input = new Input();
	input.onMouseUp = function(which, cursorX, cursorY) {
		var destination = findGridNode(cursorX, cursorY);
		if(destination == null || !destination.node.isPathable)
			return;

		if(playerPoint == null)
			playerPoint = new Point(destination.column, destination.row);
		else {
			playerDestination = new Point(destination.column, destination.row);
			playerPath = pathfinder.findPathEx(playerPoint, new Point(destination.column, destination.row), pathingPolygon);
		}
	};

	pathingPolygon.points.push(new Point(116, 180));
	pathingPolygon.points.push(new Point(355, 63));
	pathingPolygon.points.push(new Point(487, 119));
	pathingPolygon.points.push(new Point(538, 304));
	pathingPolygon.points.push(new Point(275, 397));
	pathingPolygon.points.push(new Point(134, 375));
	pathingPolygon.points.push(new Point(262, 328));
	pathingPolygon.points.push(new Point(392, 272));
	pathingPolygon.points.push(new Point(315, 178));
	pathingPolygon.points.push(new Point(116, 180));
	pathingPolygon.close();
	pathingPolygon.createGrid(16, 16);

	startGameLoop(update, draw, 30);
});

function findGridNode(x, y) {
	for(var row = 0; row < pathingPolygon.height; ++row) {
		for(var column = 0; column < pathingPolygon.width; ++column) {
			var node = pathingPolygon.nodes[(row * pathingPolygon.width) + column];
			if(x > node.bounds.x && x < node.bounds.x + node.bounds.width &&
				y > node.bounds.y && y < node.bounds.y + node.bounds.height)
				return {
					column: column,
					row: row,
					node: node
				};
		}
	}
	return null;
}

function update(delta) {}

function draw() {
	graphics.clear();

	var boxColor = "#800000";
	var lineColor = "#ff0000";
	pathingPolygon.debugDraw(
		function (start, end, index) {
			if(index == 0)
				graphics.fillRectangle(start.x - 4, start.y - 4, 8, 8, boxColor);
			graphics.fillRectangle(end.x - 4, end.y - 4, 8, 8, boxColor);
			graphics.drawLine(start.x, start.y, end.x, end.y, lineColor, 1);
		},
		function (node) {
			graphics.drawRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#ffffff", 1);
		});

	if(playerPoint != null) {
		var node = pathingPolygon.nodes[(playerPoint.y * pathingPolygon.width) + playerPoint.x];
		graphics.fillRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#00ff00");
	}

	if(playerDestination != null) {
		var node = pathingPolygon.getNodeAtColumnRow(playerDestination.x, playerDestination.y);
		graphics.fillRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#ff0000");
	}

	boxColor = "#ffff00";
	lineColor = "#00ff00";
	if(playerPath != null) {
		playerPath.debugDraw(function (start, end, index) {
			if(index == 0)
				graphics.fillRectangle(start.x - 4, start.y - 4, 8, 8, boxColor);
			graphics.fillRectangle(end.x - 4, end.y - 4, 8, 8, boxColor);
			graphics.drawLine(start.x, start.y, end.x, end.y, lineColor, 1);
		});
	}
}