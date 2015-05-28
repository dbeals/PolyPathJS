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
Description: The Pathfinder class, which is used to generate the actual
 * path; uses the A* algorithm.
****************************** Change Log ******************************
4/26/2015 3:49:53 PM - Created initial file. (dbeals)
***********************************************************************/
function Pathfinder() {
	this.trimPaths = false;
	
	function continuesHorizontally(previousPoint, currentPoint, nextPoint) {
		return currentPoint.y == nextPoint.y && nextPoint.y == previousPoint.y && currentPoint.x != nextPoint.x;
	}
	
	function continuesVertically(previousPoint, currentPoint, nextPoint) {
		return currentPoint.x == nextPoint.x && nextPoint.x == previousPoint.x && currentPoint.y != nextPoint.y;
	}
	
	function continuesDiagonallyTest(previousPoint, currentPoint, nextPoint, xOffset, yOffset) {
		return (currentPoint.x + xOffset == nextPoint.x && currentPoint.y + yOffset == nextPoint.y) &&
			(currentPoint.x + -xOffset == previousPoint.x && currentPoint.y + -yOffset == previousPoint.y);
	}
	
	function continuesDiagonally(previousPoint, currentPoint, nextPoint) {
		return continuesDiagonallyTest(previousPoint, currentPoint, nextPoint, 1, -1) ||
			continuesDiagonallyTest(previousPoint, currentPoint, nextPoint, 1, 1) ||
			continuesDiagonallyTest(previousPoint, currentPoint, nextPoint, -1, 1) ||
			continuesDiagonallyTest(previousPoint, currentPoint, nextPoint, -1, -1);
	}

	this.checkNode = function(column, row) {
		return true;
	}

	this.createPath = function(node, depth, userData) {
		if(userData === undefined || userData === null)
			userData = {};
		
		if(userData.popFirstWaypoint === undefined)
			userData.popFirstWaypoint = false;
		
		if(userData.popLastNWaypoints === undefined)
			userData.popLastNWaypoints = 0;
		
		var output = [];
		var parent = node;
		while(parent != null) {
			output.unshift(parent.position);
			parent = parent.parent;
		}
		
		if(userData != null) {
			var poppingWaypoints = false;
			for(var index = output.length - 1; index >= 0; --index) {
				poppingWaypoints = userData.popWaypointTest(output[index], index);
				if(!poppingWaypoints)
					break;
				
				output.splice(-1, 1);
			}
			
			if(userData.popFirstWaypoint)
				output.shift();
			
			if(userData.popLastNWaypoints > 0) {
				if(userData.popLastNWaypoints > output.length) {
					depth.value = 0;
					return [];
				}
				
				output.splice(output.length - userData.popLastNWaypoints, userData.popLastNWaypoints);
			}
		}
		
		depth.value = output.length;

		if(this.trimPaths) {
			var indicesToRemove = [];
			for(var index = 1; index < output.length - 1; ++index) {
				var previousPoint = output[index - 1];
				var currentPoint = output[index];
				var nextPoint = output[index + 1];

				if(continuesHorizontally(previousPoint, currentPoint, nextPoint) || continuesVertically(previousPoint, currentPoint, nextPoint) || continuesDiagonally(previousPoint, currentPoint, nextPoint))
					indicesToRemove.push(index);
			}

			for(var index = indicesToRemove.length - 1; index >= 0; --index)
				output.splice(indicesToRemove[index], 1);
		}

		return output;
	}

	this.checkNodeList = function(nodes, x, y) {
		for(var index = 0; index < nodes.length; ++index) {
			var node = nodes[index];
			if(node.position.x == x && node.position.y == y)
				return true;
		}
		return false;
	}

	this.processNode = function(currentNode, columnOffset, rowOffset, openNodes, closedNodes) {
		var newNode = {
			position: new Point(currentNode.position.x + columnOffset, currentNode.position.y + rowOffset),
			parent: currentNode,
			weight: 0
		};
		if((this.checkNode == null || this.checkNode(newNode.position.x, newNode.position.y)) &&
			!this.checkNodeList(closedNodes, newNode.position.x, newNode.position.y) &&
			!this.checkNodeList(openNodes, newNode.position.x, newNode.position.y)) {
			openNodes.push(newNode);
			return newNode;
		}
		return null;
	}

	this.findPath = function(startPosition, endPosition, depth) {
		var closedNodes = [];
		var openNodes = [];

		openNodes.push({
			position: startPosition,
			parent: null,
			weight: 0,
		});

		while(true) {
			if(openNodes.length == 0) {
				depth.value = 0;
				return null;
			}

			var currentNode = openNodes[0];
			var currentPosition = currentNode.position;
			if(closedNodes.indexOf(currentNode) == -1) {
				if(currentPosition.x == endPosition.x && currentPosition.y == endPosition.y)
					return this.createPath(currentNode, depth);

				var left = this.processNode(currentNode, -1, 0, openNodes, closedNodes);
				var up = this.processNode(currentNode, 0, -1, openNodes, closedNodes);
				var right = this.processNode(currentNode, 1, 0, openNodes, closedNodes);
				var down = this.processNode(currentNode, 0, 1, openNodes, closedNodes);

				if(left != null && up != null)
					this.processNode(currentNode, -1, -1, openNodes, closedNodes);
				if(right != null && up != null)
					this.processNode(currentNode, 1, -1, openNodes, closedNodes);
				if(right != null && down != null)
					this.processNode(currentNode, 1, 1, openNodes, closedNodes);
				if(left != null && down != null)
					this.processNode(currentNode, -1, 1, openNodes, closedNodes);

				closedNodes.push(currentNode);
			}

			openNodes.shift();
		}
	}

	this.findPathEx = function(startPosition, endPosition, pathingPolygon) {
		var depth = {};
		var pathPoints = this.findPath(startPosition, endPosition, depth);
		if(pathPoints == null)
			return null;

		var output = new Path();
		output.depth = depth.value;
		for(var index = 0; index < pathPoints.length; ++index) {
			var point = pathPoints[index];
			var node = pathingPolygon.getNodeAtColumnRow(point.x, point.y);
			output.addWaypoint((node.bounds.width / 2) + node.bounds.x, (node.bounds.height / 2) + node.bounds.y);
		}
		return output;
	}
}