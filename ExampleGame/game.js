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

pathfinder.checkNode = function(column, row) {
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

	for(var row = 0; row < pathingPolygon.height; ++row) {
		for(var column = 0; column < pathingPolygon.width; ++column) {
			var node = pathingPolygon.nodes[(row * pathingPolygon.width) + column];
			if(node.isPathable)
				graphics.drawRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#ffffff", 1);
		}
	}

	for(var index = 0; index < pathingPolygon.points.length; ++index) {
		if(index + 1 >= pathingPolygon.points.length)
			break;

		var point1 = pathingPolygon.points[index];
		var point2 = pathingPolygon.points[index + 1];
		if(index == 0)
			graphics.fillRectangle(point1.x - 4, point1.y - 4, 8, 8, "#800000");
		graphics.fillRectangle(point2.x - 4, point2.y - 4, 8, 8, "#800000");
		graphics.drawLine(point1.x, point1.y, point2.x, point2.y, "#ff0000", 1);
	}

	if(playerPoint != null) {
		var node = pathingPolygon.nodes[(playerPoint.y * pathingPolygon.width) + playerPoint.x];
		graphics.fillRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#00ff00");
	}

	if(playerDestination != null) {
		var node = pathingPolygon.getNodeAtColumnRow(playerDestination.x, playerDestination.y);
		graphics.fillRectangle(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, "#ff0000");
	}

	if(playerPath != null) {
		for(var index = 1; index < playerPath.waypoints.length; ++index) {
			var startPoint = playerPath.waypoints[index - 1];
			var endPoint = playerPath.waypoints[index];

			var startPointArea = new Rectangle(startPoint.x - 4, startPoint.y - 4, 8, 8);
			var endPointArea = new Rectangle(endPoint.x - 4, endPoint.y - 4, 8, 8);

			if(index == 1)
				graphics.fillRectangle(startPointArea.x, startPointArea.y, startPointArea.width, startPointArea.height, "#ffff00");

			graphics.fillRectangle(endPointArea.x, endPointArea.y, endPointArea.width, endPointArea.height, "#ffff00");
			graphics.drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, "#00ff00", 1);
		}
	}
}