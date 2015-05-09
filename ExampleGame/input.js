function Input() {
	__inputSingleton = this;
	this.cursorX = 0;
	this.cursorY = 0;
	this.previousCursorX = 0;
	this.previousCursorY = 0;
	this.cursorMovementX = 0;
	this.cursorMovementY = 0;

	this.buttonStates = new Array();
	this.buttonStates[0] = 'up';
	this.buttonStates[1] = 'up';
	this.buttonStates[2] = 'up';
	this.onMouseDown = null;
	this.onMouseUp = null;
	this.onMouseMove = null;
	this.onClick = null;
	this.keydown = keydown;

	this.buttonIsDown = function(buttonIndex) {
		return this.buttonStates[buttonIndex] == 'down';
	};

	this.buttonIsUp = function(buttonIndex) {
		return this.buttonStates[buttonIndex] == 'up';
	};

	var canvas = $("#gameCanvas");
	canvas.mousemove(function(e) {
		var bounds = this.getBoundingClientRect();

		__inputSingleton.cursorX = e.clientX - bounds.left;
		__inputSingleton.cursorY = e.clientY - bounds.top;

		__inputSingleton.cursorMovementX = __inputSingleton.cursorX - __inputSingleton.previousCursorX;
		__inputSingleton.cursorMovementY = __inputSingleton.cursorY - __inputSingleton.previousCursorY;

		if(__inputSingleton.onMouseMove != null)
			__inputSingleton.onMouseMove(__inputSingleton.cursorX, __inputSingleton.cursorY);
	});

	canvas.mousedown(function(e) {
		__inputSingleton.buttonStates[e.which - 1] = 'down';
		__inputSingleton.previousCursorX = __inputSingleton.cursorX;
		__inputSingleton.previousCursorY = __inputSingleton.cursorY;

		if(__inputSingleton.onMouseDown != null)
			__inputSingleton.onMouseDown(e.which - 1, __inputSingleton.cursorX, __inputSingleton.cursorY);
	});

	canvas.mouseup(function(e) {
		__inputSingleton.buttonStates[e.which - 1] = 'up';

		if(__inputSingleton.onMouseUp != null)
			__inputSingleton.onMouseUp(e.which - 1, __inputSingleton.cursorX, __inputSingleton.cursorY);
	});

	canvas.click(function() {
		if(__inputSingleton.onClick != null)
			__inputSingleton.onClick();
	});
}