function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.getArea = function() {
		return this.width * this.height;
	}

	this.getCenter = function() {
		return new Point(this.x + (this.width / 2), this.y + (this.height / 2));
	}

	this.isEmpty = function() {
		return this.width == 0 || this.height == 0;
	}
}

function Point(x, y) {
	this.x = x;
	this.y = y;

	this.isZero = function() {
		return this.x == 0 && this.y == 0;
	}
}