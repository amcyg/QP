var AVG_EWMA = 9.78;

function StepCounter() {
	this.STATE = 'DOWN';
	this.steps = 0;
	this.UPPER = [];
}

StepCounter.prototype.push = function(row) {
	var acceleration = convertToScalar(row);
	this.STATE = checkState(acceleration, AVG_EWMA);
	// console.log(this.STATE);

	if (this.STATE === 'UP') {
		// console.log(this.steps);
		collectUpperCurveData(acceleration, this.UPPER);
	}
	if (this.STATE === 'DOWN') {
		if (this.UPPER.length > 0) {
			this.steps = findUpperMax(this.steps, this.UPPER);
			this.UPPER = []; 
		}
	}

	return [acceleration, this.steps];
}

function checkState( acceleration, AVG_EWMA ) {
	if (acceleration > AVG_EWMA) {
		return 'UP'
	}
	return 'DOWN'
}

function convertToScalar ( row ) {
	return Math.sqrt(Math.pow(row.x, 2) + Math.pow(row.y, 2) + Math.pow(row.z, 2))
}

function collectUpperCurveData ( acceleration, UPPER ) {
	// console.log("It got into the collect upper curve function!");
	UPPER.push(acceleration);
}

function findUpperMax ( steps, UPPER ) {
	var upperMax = Math.max.apply(Math, UPPER);
	// console.log("Max of upper curve: " , upperMax);
	if (upperMax > 13.75){
		steps = steps + 1;
	}
	return steps;
}