/***********************************************************************
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
************************************************************************
Author: Donald Beals
Description: The PathingPolygon class, which is used to house the polygon
 * and generate the pathing grid.
****************************** Change Log ******************************
4/26/2015 4:24:47 PM - Created initial file. (dbeals)
***********************************************************************/
function PathingPolygon() {
	this.points = new Array();
	this.nodes = new Array();
	this.nodeWidth = 16;
	this.nodeHeight = 16;
	this.width = 0;
	this.height = 0;
	this.isClosed = false;
	this.useTightTests = true;

	function isPointInsidePolygon(points, testX, testY) {
		var counter = 0;
		var point1 = points[0];
		for(var index = 1; index <= points.length; ++index) {
			var point2 = points[index % points.length];
			if(testY > Math.min(point1.y, point2.y) &&
				testY <= Math.max(point1.y, point2.y) &&
				testX <= Math.max(point1.x, point2.x) &&
				point1.y != point2.y) {
				var xinters = (testY - point1.y) * (point2.x - point1.x) / (point2.y - point1.y) + point1.x;
				if(point1.x == point2.x || testX <= xinters)
					++counter;
			}
			point1 = point2;
		}
		return counter % 2 != 0;
	}

	function isRectangleInsidePolygon(points, node, tightTest) {
		var leftTopRightBottom = isPointInsidePolygon(points, node.x, node.y) && isPointInsidePolygon(points, node.x + node.width, node.y + node.height);
		var rightTopLeftBottom = isPointInsidePolygon(points, node.x + node.width, node.y) && isPointInsidePolygon(points, node.x, node.y + node.height);

		if(tightTest)
			return leftTopRightBottom && rightTopLeftBottom;
		return leftTopRightBottom || rightTopLeftBottom;
	}

	this.close = function() {
		var firstPoint = this.points[0];
		var lastPoint = this.points[this.points.length - 1];
		if(lastPoint.x != firstPoint.x || lastPoint.y != firstPoint.y)
			this.points.push(firstPoint);
		this.isClosed = true;
	}

	this.clear = function() {
		this.width = 0;
		this.height = 0;
		this.nodeWidth = 16;
		this.nodeHeight = 16;
		this.nodes = new Array();
		this.points.clear();
		this.isClosed = false;
	}

	this.createGrid = function(nodeWidth, nodeHeight) {
		var minX = Number.MAX_VALUE;
		var minY = Number.MAX_VALUE;
		var maxX = Number.MIN_VALUE;
		var maxY = Number.MIN_VALUE;

		for(var index = 0; index < this.points.length; ++index) {
			var point = this.points[index];
			if(point.x < minX)
				minX = point.x;
			if(point.y < minY)
				minY = point.y;
			if(point.x > maxX)
				maxX = point.x;
			if(point.y > maxY)
				maxY = point.y;
		}

		var bounds = {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY,
		};

		this.width = Math.ceil(bounds.width / nodeWidth);
		this.height = Math.ceil(bounds.height / nodeHeight);

		var output = new Array(this.width * this.height);
		for(var row = 0; row < this.height; ++row) {
			for(var column = 0; column < this.width; ++column) {
				var nodeBounds = {
					x: bounds.x + (column * nodeWidth),
					y: bounds.y + (row * nodeHeight),
					width: nodeWidth,
					height: nodeHeight
				};

				output[(row * this.width) + column] = {
					column: column,
					row: row,
					bounds: nodeBounds,
					isPathable: isRectangleInsidePolygon(this.points, nodeBounds, this.useTightTests),
				};

			}
		}
		this.nodes = output;
	}

	this.getNodeAtXY = function(x, y) {
		for(var index = 0; index < this.nodes.length; ++index) {
			var node = this.nodes[index];
			var left = node.x;
			var top = node.y;
			var right = node.x + node.width;
			var bottom = node.y + node.height;

			if(x >= left && y >= top && x < right && y < bottom)
				return node;
		}
		return {
			column: -1,
			row: -1,
			bounds: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
			},
			isPathable: false,
		};
	}

	this.getNodeAtColumnRow = function(column, row) {
		return this.nodes[(row * this.width) + column];
	}
	
	this.containsColumnRow = function(column, row) {
		return column >= 0 && column <= this.width && row >= 0 && row <= this.height;
	}
	
	this.debugDraw = function(drawLine, drawNode) {
		if(drawNode != null && this.isClosed) {
			for(var index = 0; index < this.nodes.length; ++index) {
				var node = this.nodes[index];
				if(!node.isPathable)
					continue;
				drawNode(node);
			}
		}
		
		if(drawLine != null && this.points.length > 1) {
			for(var index = 0; index < this.points.length - 1; ++index) {
				var start = this.points[index];
				var end = this.points[index + 1];
				drawLine(start, end, index);
			}
		}
	}
}