var calcButton = document.getElementById('calcButton');

// Set handler
if (calcButton.attachEvent) {
    calcButton.attachEvent('onclick', newRate);
} else {
    calcButton.addEventListener('click', newRate);
}

function newRate() {
    var currentBG = parseFloat(document.getElementById('currentBG').value, 10),
        lastBG = parseFloat(document.getElementById('lastBG').value, 10),
        timeSinceLastBG = parseFloat(document.getElementById('timeSinceLastBG').value, 10),
        currentRate = parseFloat(document.getElementById('currentRate').value, 10);
    
    var rateOfChangeOfBG = (currentBG - lastBG) / timeSinceLastBG;


    function printAlert(msg) {
        document.getElementById('alert').innerHTML = '';
        document.getElementById('alert').innerHTML = msg;
    }

    function printB3(msg) {
        document.getElementById('B3').innerHTML = '';
        document.getElementById('B3').innerHTML = msg;
    }

    function printB6(msg) {
        document.getElementById('B6').innerHTML = '';
        document.getElementById('B6').innerHTML = msg;
    }

    // Calcuating delta table for change in drip rate
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

    var dripRateDelta = changeInDripRate();

    // Sets boolean value to control delta 2X >= 10 alert
    var delta2XAlert = false;

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
        printAlert('<p>Formula value(s) missing</p>');
        return false;
    }

    // Adjust B3 message based on Current BG
    if (currentBG >= 60) {
        printB3('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 50% of original rate.');
    }

    if (currentBG < 60) {
        printB3('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at ' + (currentRate * 0.5) + ' units/hr.');
    }

    // Adjust B6 message based on Current BG
    if (currentBG > 74) {
        printB6('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 75% of original rate.');
    }

    if (currentBG >= 60 && currentBG <= 74) {
        printB6('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at ' + (currentRate * 0.75) + ' units/hr.');
    }

    if (currentBG < 60) {
        printB6('When BG &#8805; 100 mg/dL, wait 1 hour, then restart infusion at 75% of original rate.');
    }


    document.getElementById('alert').innerHTML = '';

    var instructions = giveInstructions();

    if (delta2XAlert) {
        document.getElementById('newRate').innerHTML = '';
        printAlert('<p>CONTACT PHYSICIAN</p>');
    }
    else {
        document.getElementById('newRate').innerHTML = '<p>' + instructions + '</p>';
    }
}