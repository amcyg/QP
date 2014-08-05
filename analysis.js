function countSteps ( inputData ) {
	var AVG_EWMA = 9.78;
	var UPPER = [];
	var outputData = [];
	var STATE = 'DOWN';
	var steps = 0;
	for (var i = 0; i < inputData.length; i++) {
		var row = inputData[i];
		var acceleration = convertToScalar(row);
		STATE = checkState(acceleration, AVG_EWMA);
		console.log(STATE);
		if (STATE === 'UP') {
			console.log(steps);
			collectUpperCurveData(acceleration, UPPER);
		}
		if (STATE === 'DOWN') {
			if (UPPER.length > 0) {
				steps = findUpperMax(steps, UPPER);
				UPPER = []; 
			}
		}

		outputData.push({
			x: row.x,
			y: row.y,
			z: row.z,
			acceleration: acceleration,
			steps: steps
		})

	}
	
	return outputData;
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
	console.log("It got into the collect upper curve function!");
	UPPER.push(acceleration);
}

function findUpperMax ( steps, UPPER ) {
	upperMax = Math.max.apply(Math, UPPER);
	console.log("Max of upper curve: " , upperMAX);
	if (upperMax > 10){
		steps = steps + 1;
	}
	return steps;
}