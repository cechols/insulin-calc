'use strict';

var calcButton = document.getElementById('calcButton');

function newRate() {
	var currentBG = parseFloat(document.getElementById('currentBG').value, 10),
		lastBG = parseFloat(document.getElementById('lastBG').value, 10),
		timeSinceLastBG = parseFloat(document.getElementById('timeSinceLastBG').value, 10),
		currentRate = parseFloat(document.getElementById('currentRate').value, 10),
		rateOfChangeOfBG = (currentBG - lastBG) / timeSinceLastBG,
		delta2XAlert = false, // Sets boolean value to control delta 2X >= 10 alert
		dripRateDelta,
		instructions, // gets value from giveInstructions()
		// DOM ELEMENTS
		alert = document.getElementById('alert'),
		newRateTarget = document.getElementById('newRate'),
		B3 = document.getElementById('B3'),
		B6 = document.getElementById('B6');

	function printMessage(msg, target) {
		// Remove previous message text
		target.innerHTML = '';
		// Write new message
		target.innerHTML = msg;
	}

//	function printAlert(msg) {
//		alert.innerHTML = '';
//		alert.innerHTML = msg;
//
//	}
//
//	function printB3(msg) {
//		B3.innerHTML = '';
//		B3.innerHTML = msg;
//	}
//
//	function printB6(msg) {
//		B6.innerHTML = '';
//		B6.innerHTML = msg;
//	}

	// Calculating delta table for change in drip rate
	// Delta determined by current drip rate
	function changeInDripRate() {
		// Reading value of variable currentRate, set in newRate()
		if (currentRate < 3) {
			return 0.5;
		}

		if (currentRate >= 3 && currentRate < 6.5) {
			return 1;
		}

		if (currentRate >= 6.5 && currentRate < 10) {
			return 1.5;
		}

		if (currentRate >= 10 && currentRate < 15) {
			return 2;
		}

		if (currentRate >= 15 && currentRate < 20) {
			return 3;
		}

		if (currentRate >= 20 && currentRate < 25) {
			return 4;
		}

		if (currentRate >= 25) {
			return 5;
		}

	}

	// Assign dripRateDelta
	dripRateDelta = changeInDripRate();


	function giveInstructions() {
		var instructionDelta,
			dripRateDelta2X = dripRateDelta * 2;

		function applyDelta2X() {
			if ((rateOfChangeOfBG > 0 && dripRateDelta2X >= 10) || (rateOfChangeOfBG > 25 && dripRateDelta2X >= 10) || (rateOfChangeOfBG > 50 && dripRateDelta2X >= 10) || (rateOfChangeOfBG > 0 && dripRateDelta2X >= 10) || (rateOfChangeOfBG <= -50 && dripRateDelta2X >= 10) || (rateOfChangeOfBG <= -100 && dripRateDelta2X >= 10)) {
				delta2XAlert = true;
			}
		}

		function calcB5() {

			if (rateOfChangeOfBG > 0) {
				applyDelta2X();
				return 'New Rate: ' + currentRate.toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -25 && rateOfChangeOfBG <= 0) {
				return 'New Rate: ' + (currentRate - dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG < -25) {
				return 'STOP INFUSION. Check BG every 30 minutes. When BG &#8805; 100mg/dL, restart drip at ' + (currentRate * 0.75).toString() + ' units/hr';
			}
		}

		function calcB6() {

			if (rateOfChangeOfBG > 25) {
				applyDelta2X();
				return 'New Rate: ' + (currentRate + dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -25 && rateOfChangeOfBG <= 25) {
				return 'New Rate: ' + currentRate.toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -50 && rateOfChangeOfBG <= -26) {
				return 'New Rate: ' + (currentRate - dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG < -50) {
				return 'Hold infusion for 30 minutes, then start infusion at ' + (currentRate - dripRateDelta2X).toString() + ' units/hr';
			}
		}

		function calcB7() {

			if (rateOfChangeOfBG > 50) {
				applyDelta2X();
				return 'New Rate: ' + (currentRate + dripRateDelta2X).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= 0 && rateOfChangeOfBG <= 50) {
				return 'New Rate: ' + (currentRate + dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -50 && rateOfChangeOfBG <= -1) {
				return 'New Rate: ' + currentRate.toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -75 && rateOfChangeOfBG <= -51) {
				return 'New Rate: ' + (currentRate - dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG <= -50) {
				applyDelta2X();
				return 'Hold infusion for 30 minutes, then start infusion at ' + (currentRate - dripRateDelta2X).toString() + ' units/hr';
			}
		}

		function calcB8() {

			if (rateOfChangeOfBG > 0) {
				applyDelta2X();
				return 'New Rate: ' + (currentRate + dripRateDelta2X).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -25 && rateOfChangeOfBG <= 0) {
				return 'New Rate: ' + (currentRate + dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -75 && rateOfChangeOfBG <= -26) {
				return 'New Rate: ' + currentRate.toString() + ' units/hr';
			}

			if (rateOfChangeOfBG >= -100 && rateOfChangeOfBG <= -76) {
				return 'New Rate: ' + (currentRate - dripRateDelta).toString() + ' units/hr';
			}

			if (rateOfChangeOfBG < -100) {
				applyDelta2X();
				return 'Hold infusion for 30 minutes, then start infusion at ' + (currentRate - dripRateDelta2X).toString() + ' units/hr';
			}
		}

		if (currentBG < 75) {
			instructionDelta = 'STOP INFUSION';
		}

		if (currentBG >= 75 && currentBG <= 99) {
			instructionDelta = calcB5();
		}

		if (currentBG >= 100 && currentBG <= 139) {
			instructionDelta = calcB6();
		}

		if (currentBG >= 140 && currentBG <= 199) {
			instructionDelta = calcB7();
		}

		if (currentBG >= 200) {
			instructionDelta = calcB8();
		}

		return instructionDelta;
	}

	// Print error message if user provides invalid input
	if ((!currentBG) || (!lastBG) || (!timeSinceLastBG) || (!currentRate)) {
		printMessage('<p>Formula value(s) missing</p>', alert);
		return false;
	}

	// Adjust B3 message based on Current BG
	if (currentBG >= 60) {
		printMessage('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 50% of original rate.', B3);
	}

	if (currentBG < 60) {
		printMessage('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at ' + (currentRate * 0.5) + ' units/hr.', B3);
	}

	// Adjust B6 message based on Current BG
	if (currentBG > 74) {
		printMessage('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 75% of original rate.', B6);
	}

	if (currentBG >= 60 && currentBG <= 74) {
		printMessage('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at ' + (currentRate * 0.75) + ' units/hr.', B6);
	}

	if (currentBG < 60) {
		printMessage('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 75% of original rate.', B6);
	}


	document.getElementById('alert').innerHTML = '';

	instructions = giveInstructions();

	if (delta2XAlert) {
		// Empty newRate
		newRateTarget.innerHTML = '';
		printMessage('<p>CONTACT PHYSICIAN</p>', alert);
	}
	else {
		printMessage('<p>' + instructions + '</p>', newRateTarget);
	}
}

// Set handler on calcButton
if (calcButton.attachEvent) {
    calcButton.attachEvent('onclick', newRate);
} else {
    calcButton.addEventListener('click', newRate);
}