#PolyPathJS
PolyPathJS is a JavaScript implementation of the C# library [PolyPath](https://github.com/dbeals/PolyPath).

PolyPath is designed for use in a non-grid based game. You provide a polygon and the system generates a grid inside of that, which is then used to generate a path (using the A* algorithm.)

#Finding our way
The first step is to generate the pathing grid. We do so by adding points to the polygon, closing it and then creating the grid:

```JavaScript
var pathingPolygon = new PathingPolygon();
pathingPolygon.useTightTests = true;
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
```

We can now create our pathfinder and find the path:

```JavaScript
var startPoint = new Point(30, 90);
var endPoint = new Point(200, 25);

var startNode = pathingPolygon.getNodeAtXY(startPoint);
if(startNode == null || !startNode.isPathable)
	return;

var endNode = pathingPolygon.getNodeAtXY(endPoint);
if(endNode == null || !endPoint.isPathable)
	return;
	
var pathfinder = new Pathfinder();
pathfinder.trimPaths = true;
var path = pathfinder.findPathEx(startNode.Column, startNode.Row, endNode.Column, endNode.Row, pathingPolygon);
// Note that you can also omit the pathingPolygon in this call and you'll receive a list of Points that are grid coordinates.
// You can then convert that to a path using the pathingPolygon class (this is what  the override used above does.)
```

We now have a set of waypoints and can move along them:

```JavaScript
// delta is the frame-time delta in seconds.
// path is the value at the end of the previous example.
if(path.waypoints.length == 0)
	return;
	
if(getVectorLength(path.getDistanceVectorToNextWaypoint(PlayerObject.position)) < WereCloseEnoughToMoveToTheNextWaypointConstant))
	path.popWaypoint();

if(path.nextWaypoint != null)
{
	PlayerObject.position += (path.getDirectionVectorToNextWaypoint() * delta);
}
```

#To-do
There are still a few things that need to be added:

**Weighting**
The algorithm does not currently incorporate weights.