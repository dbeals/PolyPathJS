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
Description: The Path class, which contains the generated path as a set
 * of X/Y coordinates.
****************************** Change Log ******************************
4/26/2015 3:49:04 PM - Created initial file. (dbeals)
***********************************************************************/
function Path() {
	this.waypoints = new Array();
	this.depth = 0;

	this.getNextWaypoint = function() {
		if(this.waypoints.length == 0)
			return null;
		return this.waypoints[0];
	}

	this.getLastWaypoint = function() {
		if(this.waypoints.length == 0)
			return null;
		return this.waypoints[this.waypoints.length - 1];
	}

	this.getDistanceVectorToNextWaypoint = function(point) {
		var nextWaypoint = this.getNextWaypoint();
		if(nextWaypoint == null) {
			return {
				x: 0,
				y: 0
			};
		}
		return {
			x: nextWaypoint.x - point.x,
			y: nextWaypoint.y - point.y
		};
	}

	this.getDirectionVectorToNextWaypoint = function(point) {
		var distance = this.getDistanceToNextWaypoint(point);
		if(distance.x == 0 && distance.y == 0)
			return distance;
		var length = Math.sqrt((distance.x * distance.x) + (distance.y * distance.y));
		return {
			x: distance.x / length,
			y: distance.y / length
		};
	}

	this.addWaypoint = function(x, y) {
		this.waypoints.push({
			x: x,
			y: y
		});
	}

	this.addWaypoints = function(waypoints) {
		for(var index = 0; index < waypoints.length; ++index)
			this.waypoints.push(waypoints[index]);
	}

	this.popWaypoint = function() {
		if(this.waypoints == null || this.waypoints.length == 0) {
			return {
				x: 0,
				y: 0
			};
		}

		var output = this.getNextWaypoint();
		this.waypoints = this.waypoints.splice(0, 1);
		return output;
	}

	this.clear = function() {
		this.waypoints.length = 0;
	}
	
	this.debugDraw = function(drawLine) {
		if(drawLine == null)
			return;
		
		for(var index = 0; index < this.waypoints.length - 1; ++index) {
			var current = this.waypoints[index];
			var next = this.waypoints[index + 1];
			drawLine(current, next, index);
		}
	}
}