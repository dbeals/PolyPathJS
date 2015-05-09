function clearCanvas(canvas, canvasWidth, canvasHeight, color) {
	canvas.fillStyle = color;
	canvas.fillRect(0, 0, canvasWidth, canvasHeight);
}

function Graphics(canvasWidth, canvasHeight) {
	this.canvas = createCanvas(canvasWidth, canvasHeight);
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.clearColor = 'black';

	this.clear = function() {
		clearCanvas(this.canvas, this.canvasWidth, this.canvasHeight, this.clearColor);
	}

	this.drawLine = function(startX, startY, endX, endY, color, lineWidth) {
		this.canvas.beginPath();
		this.canvas.strokeStyle = color;
		this.canvas.lineWidth = lineWidth;

		this.canvas.moveTo(startX, startY);
		this.canvas.lineTo(endX, endY);
		this.canvas.closePath();
		this.canvas.stroke();
	}

	this.drawRectangle = function(x, y, width, height, color, lineWidth) {
		this.canvas.beginPath();
		this.canvas.strokeStyle = color;
		this.canvas.lineWidth = lineWidth;

		this.canvas.moveTo(x, y);
		this.canvas.lineTo(x + width, y);
		this.canvas.lineTo(x + width, y + height);
		this.canvas.lineTo(x, y + height);
		this.canvas.lineTo(x, y);
		this.canvas.closePath();
		this.canvas.stroke();
	}

	this.drawRoundedRectangle = function(x, y, width, height, cornerRadius, color, lineWidth) {
		var left = Math.min(x, x + width);
		var top = Math.min(y, y + height);
		var right = Math.max(x, x + width);
		var bottom = Math.max(y, y + height);

		this.canvas.beginPath();
		this.canvas.strokeStyle = color;
		this.canvas.lineWidth = lineWidth;

		this.canvas.moveTo(left, top - cornerRadius);
		this.canvas.lineTo(right, top - cornerRadius);
		this.canvas.arc(right, top, cornerRadius, degreesToRadians(270), degreesToRadians(360));
		this.canvas.lineTo(right + cornerRadius, bottom);
		this.canvas.arc(right, bottom, cornerRadius, degreesToRadians(0), degreesToRadians(90));
		this.canvas.lineTo(left, bottom + cornerRadius);
		this.canvas.arc(left, bottom, cornerRadius, degreesToRadians(90), degreesToRadians(180));
		this.canvas.lineTo(left - cornerRadius, top);
		this.canvas.arc(left, top, cornerRadius, degreesToRadians(180), degreesToRadians(270));

		this.canvas.closePath();
		this.canvas.stroke();
	}

	this.fillRectangle = function(x, y, width, height, color) {
		this.canvas.beginPath();
		this.canvas.fillStyle = color;
		this.canvas.fillRect(x, y, width, height);
	}

	this.fillRoundedRectangle = function(x, y, width, height, cornerRadius, color) {
		var left = Math.min(x, x + width);
		var top = Math.min(y, y + height);
		var right = Math.max(x, x + width);
		var bottom = Math.max(y, y + height);


		this.canvas.beginPath();
		this.canvas.fillStyle = color;

		this.canvas.moveTo(left, top - cornerRadius);
		this.canvas.lineTo(right, top - cornerRadius);
		this.canvas.arc(right, top, cornerRadius, degreesToRadians(270), degreesToRadians(360));
		this.canvas.lineTo(right + cornerRadius, bottom);
		this.canvas.arc(right, bottom, cornerRadius, degreesToRadians(0), degreesToRadians(90));
		this.canvas.lineTo(left, bottom + cornerRadius);
		this.canvas.arc(left, bottom, cornerRadius, degreesToRadians(90), degreesToRadians(180));
		this.canvas.lineTo(left - cornerRadius, top);
		this.canvas.arc(left, top, cornerRadius, degreesToRadians(180), degreesToRadians(270));

		this.canvas.closePath();
		this.canvas.fill();
	}

	this.drawArc = function(x, y, radius, start, stop, color, lineWidth) {
		this.canvas.beginPath();
		this.canvas.strokeStyle = color;
		this.canvas.lineWidth = lineWidth;

		this.canvas.arc(x, y, radius, start, stop);
		this.canvas.closePath();
		this.canvas.stroke();
	}

	this.fillArc = function(x, y, radius, start, stop, color) {
		this.canvas.beginPath();
		this.canvas.fillStyle = color;

		this.canvas.arc(x, y, radius, start, stop, false);
		this.canvas.lineTo(x, y);
		this.canvas.closePath();
		this.canvas.fill();
	}

	this.drawCircle = function(x, y, radius, color, lineWidth) {
		this.drawArc(x, y, radius, 0, 2 * Math.PI, color, lineWidth);
	}

	this.fillCircle = function(x, y, radius, color) {
		this.fillArc(x, y, radius, 0, 2 * Math.PI, color);
	}
}