//===================================================
// To be refactored jens
//===================================================

function drawWarpGatesOnGameArea() {
    let xLocalUp = selectedPlanet.xWarpGateUp; 
    let yLocalUp = selectedPlanet.yWarpGateUp - selectedPlanet.yCropOffset; 

    let xLocalDown = selectedPlanet.xWarpGateDown;
    let yLocalDown = selectedPlanet.yWarpGateDown - selectedPlanet.yCropOffset; 

    const currentTime = millis();
    const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;
    const cooldownRatio = isCooldown ?
        (currentTime - me.lastWarpTime) / WARP_COOLDOWN_TIME : 1;

    push(); 
    angleMode(RADIANS); 

    if (isCooldown) {
        fill('darkblue');
        stroke('white');
        strokeWeight(2);
        circle(GAME_AREA_X + xLocalUp, GAME_AREA_Y + yLocalUp, selectedPlanet.diameterWarpGate);

        noFill();
        stroke('cyan');
        strokeWeight(4);

        arc(
            GAME_AREA_X + xLocalUp,
            GAME_AREA_Y + yLocalUp,
            selectedPlanet.diameterWarpGate * 0.8,
            selectedPlanet.diameterWarpGate * 0.8,
            0,
            cooldownRatio * TWO_PI
        );

    } else {
        fill('cyan');
        stroke('white');
        strokeWeight(2);
        circle(GAME_AREA_X + xLocalUp, GAME_AREA_Y + yLocalUp, selectedPlanet.diameterWarpGate);

    }
    noFill();
    stroke('white');
    circle(GAME_AREA_X + xLocalUp, GAME_AREA_Y + yLocalUp, selectedPlanet.diameterWarpGate * 0.7);

    fill('white');
    noStroke();

    triangle(
        GAME_AREA_X + xLocalUp, GAME_AREA_Y + yLocalUp - 15,
        GAME_AREA_X + xLocalUp - 10, GAME_AREA_Y + yLocalUp + 5,
        GAME_AREA_X + xLocalUp + 10, GAME_AREA_Y + yLocalUp + 5
    );


    if (isCooldown) {
        fill('darkmagenta');
        stroke('white');
        strokeWeight(2);
        circle(GAME_AREA_X + xLocalDown, GAME_AREA_Y + yLocalDown, selectedPlanet.diameterWarpGate);

        noFill();
        stroke('magenta');
        strokeWeight(4);
        arc(
            GAME_AREA_X + xLocalDown,
            GAME_AREA_Y + yLocalDown,
            selectedPlanet.diameterWarpGate * 0.8,
            selectedPlanet.diameterWarpGate * 0.8,
            0,
            cooldownRatio * TWO_PI
        );


    } else {
        fill('magenta');
        stroke('white');
        strokeWeight(2);
        circle(GAME_AREA_X + xLocalDown, GAME_AREA_Y + yLocalDown, selectedPlanet.diameterWarpGate);
    }
    noFill();
    stroke('white');
    circle(GAME_AREA_X + xLocalDown, GAME_AREA_Y + yLocalDown, selectedPlanet.diameterWarpGate * 0.7);

    fill('white');
    noStroke();

    triangle(
        GAME_AREA_X + xLocalDown, GAME_AREA_Y + yLocalDown + 15,
        GAME_AREA_X + xLocalDown - 10, GAME_AREA_Y + yLocalDown - 5,
        GAME_AREA_X + xLocalDown + 10, GAME_AREA_Y + yLocalDown - 5
    );

    pop();
}

function checkCollisionsWithWarpGate() {
    if (!selectedPlanet) {
        return; 
    }

    const currentTime = millis();
    const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;

    if (isCooldown) {
        return;
    }

    let di = dist(me.xGlobal + me.xLocal, me.yGlobal + me.yLocal + selectedPlanet.yCropOffset, selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp + selectedPlanet.yCropOffset);

    if (di < selectedPlanet.diameterWarpGate / 2) {
        isWarpingUp = true;
        me.lastWarpTime = currentTime;
        me.bullets = []; // Clear bullets when warping

        if (me.planetIndex === 4) { 
            me.planetIndex = 0;
        } else {
            me.planetIndex++;
        }
        me.xLocal = solarSystem.planets[me.planetIndex].xWarpGateUp;
        me.yLocal = solarSystem.planets[me.planetIndex].yWarpGateUp;

        selectedPlanet = solarSystem.planets[me.planetIndex];

        return;
    }

    di = dist(me.xGlobal + me.xLocal, me.yGlobal + me.yLocal, selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown);

    if (di < selectedPlanet.diameterWarpGate / 2) {

        isWarpingUp = false;
        me.lastWarpTime = currentTime;

        if (me.planetIndex === 0) {
            me.planetIndex = 4;
        } else {
            me.planetIndex--;
        }
        me.xLocal = solarSystem.planets[me.planetIndex].xWarpGateDown;
        me.yLocal = solarSystem.planets[me.planetIndex].yWarpGateDown;

        selectedPlanet = solarSystem.planets[me.planetIndex];

        return;
    }
} 