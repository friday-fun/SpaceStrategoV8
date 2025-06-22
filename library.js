class Spacecraft {
    constructor(config) {
        this.playerNumber = config.playerNumber;
        this.playerName = config.playerName || '';
        this.playerDisplayName = config.playerDisplayName || '';
        this.team = config.team || '';
        this.characterId = config.characterId;
        this.characterRank = config.characterRank;
        this.characterName = config.characterName;
        this.characterInstanceId = config.characterInstanceId;
        this.iAmHost = config.iAmHost;
        this.diameter = config.diameter;
        this.size = this.diameter;
        this.isReady = config.isReady;
        this.hasCharacter = config.hasCharacter
        this.hasBattled = config.hasBattled;
        this.status = config.status
        this.lastProcessedResetFlag = config.lastProcessedResetFlag;
        this.xLocal = config.xLocal;
        this.yLocal = config.yLocal;
        this.xGlobal = 0
        this.yGlobal = 0
        this.xMouse = config.xMouse;
        this.yMouse = config.yMouse;
        this.playerColor = config.playerColor;
        this.bullets = config.bullets || [];
        this.hits = config.hits || Array(15).fill(0);
        this.planetIndex = config.planetIndex;
        this.fixedMinimapIndex = config.planetIndex;
    }

    setSpacecraftColor() {
        if (!this.playerColor) return;

        fill(this.playerColor);
        strokeWeight(3);
        if (this.team === 'blue') {
            stroke(133, 69, 196);
        } else {
            stroke(0, 200, 100);
        }
    }
    drawSpacecraft2(characterData) {
        if (!this.hasCharacter || !this.characterId ||
            this.status === 'lost') {
            return;
        }

        if (!characterData || characterData.status === 'lost') {
            return;
        }
        let yCropOffset = selectedPlanet.yCropOffset || 0; // Use the yCropOffset from the selected planet

        let xLocalDisplay = this.xLocal
        let yLocalDisplay = this.yLocal - yCropOffset

        const myCharacterData = shared.characterList.find(c => c.instanceId === this.characterInstanceId);
        if (!myCharacterData) return;

        let diameter = this.diameter * planetColors[this.planetIndex].planetSizeFactor;

        if (showGraphics && allImagesLoadedSuccessfully) {
            push();
            angleMode(RADIANS);
            imageMode(CENTER);
            translate(GAME_AREA_X + xLocalDisplay, GAME_AREA_Y + yLocalDisplay);

            let head = createVector(
                this.xMouse - this.xLocal,
                this.yMouse - this.yLocal
            ).normalize().heading();
            rotate(head + 1.555);

            let imageId = getImageId(this.characterId);

            if (this.team === 'blue') {
                image(spacecraftPurpleImages[imageId], 0, 0, diameter * 1.5, diameter * 1.2);
            } else {
                image(spacecraftGreenImages[imageId], 0, 0, diameter * 1.5, diameter * 1.2);
            }

            pop();
        } else {
            push();
            angleMode(RADIANS); 
            imageMode(CENTER);
            translate(GAME_AREA_X + xLocalDisplay, GAME_AREA_Y + yLocalDisplay);

            let head = createVector(
                this.xMouse - this.xLocal,
                this.yMouse - this.yLocal
            ).normalize().heading();
            rotate(head + 1.555);

            this.setSpacecraftColor()
            ellipse(0, 0, diameter, diameter);
            rect(-diameter / 6, -diameter / 2 - diameter / 3, diameter / 3, diameter / 3);
            pop();

            push();
            noStroke();
            translate(GAME_AREA_X + xLocalDisplay, GAME_AREA_Y + yLocalDisplay);

            if (!myCharacterData.canCloake || !this.isCloaked) {
                textSize(diameter * 0.45);
                textAlign(CENTER, CENTER);
                text(this.characterId, 0, 0);
            }
            pop()
        }

        push();
        translate(GAME_AREA_X + xLocalDisplay, GAME_AREA_Y + yLocalDisplay);

        let hitByOthers = numberOfTimesBeingHit(this.playerNumber);
        let hitsRemaining = MAX_LIVES - hitByOthers;

        let barWidth = diameter;
        let barHeight = 1;
        let barY = diameter / 2 + 15;

        if (!this.isCloaked) {

            // Draw background (empty health bar)
            noFill();
            stroke(50);
            strokeWeight(1);
            rect(-barWidth / 2, barY, barWidth, barHeight);

            // Draw filled portion of health bar
            noStroke();  

            // Determine health bar color based on remaining health
            if (hitsRemaining > 5) {  
                fill(0); // Dark grey for high health
            } else if (hitsRemaining > 4) {
                fill(117, 245, 66); // Yellow for medium health
            } else if (hitsRemaining > 3) {
                fill(255, 255, 0); // Yellow for medium health
            } else if (hitsRemaining > 2) {
                fill(245, 147, 66); // Yellow for medium health
            } else if (hitsRemaining > 1) {
                fill(252, 148, 3); // Orange for medium health
            } else {
                fill(255, 0, 0); // Red for low health
            }

            // Draw the filled portion of the health bar
            let fillWidth = map(hitsRemaining, 0, MAX_LIVES, 0, barWidth);
            rect(-barWidth / 2, barY, fillWidth, barHeight);
        }
        /*
        // Draw text indicator for player name if it's the current player
        if (this.playerNumber === me.playerNumber) {
            fill(255, 255, 0);
            textSize(11);
            textAlign(CENTER, BOTTOM);
            text("YOU", 0, barY - 2);
        } else {
            */
            // Draw text indicator for player name if it's the current player
            if (showColorBlindText) {
                fill(255, 255, 0);
                textSize(11);
                textAlign(CENTER, BOTTOM);
                if (this.team === 'blue') {
                   text('purple', 0, barY - 2);
                } else {
                   text(this.team, 0, barY - 2);
                }
            }
//        }


        pop();
    }

    drawBullets() {
        if (this.planetIndex < 0) { return; }
        if (this.bullets) {
            this.bullets.forEach(bullet => {
                this.drawBullet(bullet);
            });
        }
    }

    drawBullets2() {
        if (this.planetIndex < 0) { return; }
        if (this.bullets) {
            this.bullets.forEach(bullet => {
                this.drawBullet2(bullet);
            });
        }
    }

    drawBullet(bullet) {
        if (this.planetIndex < 0) { return; }
        push();

        if (this.team === 'blue') {
            fill(133, 69, 196);
        } else {
            fill(0, 200, 100);
        }

        imageMode(CENTER);
        angleMode(RADIANS);

        let posX = bullet.xLocal
        let posY = bullet.yLocal - yCropOffset

        translate(GAME_AREA_X + posX, GAME_AREA_Y + posY);
        circle(0, 0, 10)
        pop();
    }

    drawBullet2(bullet) {
        if (this.planetIndex < 0) { return; }
        push();

        if (this.team === 'blue') {
            fill(133, 69, 196);
        } else {
            fill(0, 200, 100);
        }

        angleMode(RADIANS);
        imageMode(CENTER);

        let yCropOffset = selectedPlanet.yCropOffset || 0;
        let posX = bullet.xLocal
        let posY = bullet.yLocal - yCropOffset

        translate(GAME_AREA_X + posX, GAME_AREA_Y + posY);
        circle(0, 0, 10);
        pop();
    }

    syncFromShared(sharedSpacecraft) {
        Object.assign(this, sharedSpacecraft);
        if (typeof this.size !== 'undefined') {
            this.diameter = this.size;
        }
    }
}
function onLocalScreenArea(xLocal, yLocal) {
    return true
    if (!selectedPlanet) {
        return false;
    }
    return xLocal >= 0 && xLocal <= GAME_AREA_WIDTH_NEW && yLocal >= selectedPlanet.yCropOffset && yLocal <= selectedPlanet.yCropOffset + GAME_AREA_HEIGHT_NEW;
}

class Canon {
    constructor(config) {
        this.objectNumber = config.objectNumber;
        this.objectName = config.objectName;
        this.xGlobal = config.xGlobal;
        this.yGlobal = config.yGlobal;
        this.diameter = config.diameter;
        this.xSpawnGlobal = config.xSpawnGlobal;
        this.ySpawnGlobal = config.ySpawnGlobal;
        this.color = config.color;
        this.type = config.type;
        this.bullets = config.bullets || [];
        this.hits = config.hits || Array(15).fill(0);
        this.planetIndex = config.planetIndex;
        this.angle = 0;
        this.amplitude = 50;
        this.speed = 0.02;
        this.lastShotTime = 0;
    }

    draw() {
        this.drawCanonTower();
        this.drawBullets();
    }

    move() {
        this.angle += this.speed;
        this.xGlobal = this.xSpawnGlobal + sin(this.angle) * this.amplitude;
        this.yGlobal = this.ySpawnGlobal + cos(this.angle * 0.7) * this.amplitude;
    }

    drawCanonTower() {

        let planet = solarSystem.planets[this.planetIndex];
        let xLocal = this.xGlobal;
        let yLocal = this.yGlobal - planet.yCropOffset;

        if (onLocalScreenArea(xLocal, yLocal)) {

            push();
            imageMode(CENTER);
            // Adjust position to be relative to the game area and player's global position
            translate(GAME_AREA_X + xLocal, GAME_AREA_Y + yLocal);

            if (showGraphics && allImagesLoadedSuccessfully) {
                image(canonImages[this.type], 0, 0, this.diameter * 3, this.diameter * 3);
            } else {
                fill(this.color);
                // Draw the base
                noStroke();
                circle(0, 0, this.diameter);

                // Draw the cannon barrel
                fill(this.color);
                rect(-this.diameter / 2 - 20, -this.diameter / 3 - 30, this.diameter / 2 - 30, this.diameter / 3 - 30);
            }

            pop();
        }
    }

    drawBullets() {
        if (this.bullets) {
            this.bullets.forEach(bullet => {
                this.drawBullet(bullet);
            });
        }
    }

    drawBullet(bullet) {

        let planet = solarSystem.planets[this.planetIndex];
        let xLocal = bullet.xGlobal - me.xGlobal;
        let yLocal = bullet.yGlobal - me.yGlobal - planet.yCropOffset;

        if (onLocalScreenArea(xLocal, yLocal)) {

            fill('yellow');
            push();
            imageMode(CENTER);
            translate(GAME_AREA_X + xLocal, GAME_AREA_Y + yLocal);
            let head = createVector(
                bullet.xMouseStart - bullet.xStart,
                bullet.yMouseStart - bullet.yStart
            ).normalize().heading();
            rotate(head + 1.555);
            rect(-3, -3, 10, 10);
            pop();
        }
    }

    findNearestSpacecraft(spacecraftsOnPlanet3) {
        let nearestSpacecraft = null;
        let minDistance = Infinity;

        spacecraftsOnPlanet3.forEach(spacecraft => {
            const distance = dist(this.xGlobal, this.yGlobal, spacecraft.xLocal, spacecraft.yLocal);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSpacecraft = spacecraft;
            }
        });
        if (minDistance < 200) {
            return nearestSpacecraft;
        } else {
            return null;
        }
    }

    shoot(nearestSpacecraft) {
        if (!nearestSpacecraft) return;
        let bullet = {
            xStart: this.xGlobal,
            yStart: this.yGlobal,
            xMouseStart: nearestSpacecraft.xLocal,
            yMouseStart: nearestSpacecraft.yLocal,
            xGlobal: this.xGlobal,
            yGlobal: this.yGlobal
        };
        console.log(bullet)
        this.bullets.push(bullet);
    }

    moveBullets() {
        let planet = solarSystem.planets[this.planetIndex];
        if (!planet) return;

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            let bulletVector = createVector(
                int(bullet.xMouseStart) - bullet.xStart,
                int(bullet.yMouseStart) - bullet.yStart,
            ).normalize();

            let bulletSpeed = BULLET_SPEED; // Default bullet speed

            if (me.planetIndex === 3) {
                bulletSpeed--
            }
            if (me.planetIndex === 4) {
                bulletSpeed++
            }

            bullet.xGlobal += bulletVector.x * (parseInt(bulletSpeed) * 2);
            bullet.yGlobal += bulletVector.y * (parseInt(bulletSpeed) * 2);

            if (!planet.onPlanet(bullet.xGlobal, bullet.yGlobal) ||
                dist(bullet.xGlobal, bullet.yGlobal, this.xGlobal, this.yGlobal) > 200) {
                this.bullets.splice(i, 1);
            }
        }
    }

    checkCollisionsWithSpacecrafts() {

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];

            activeCharacters.forEach((spacecraft) => {
                if (spacecraft.xLocal >= 0 && this.planetIndex === spacecraft.planetIndex) {

                    let spacecraftDiameter = spacecraft.diameter * planetColors[spacecraft.planetIndex].planetSizeFactor;

                    let d = dist(spacecraft.xLocal, spacecraft.yLocal, bullet.xGlobal, bullet.yGlobal);
                    if (d < (spacecraftDiameter + BULLET_DIAMETER) / 2) {
                        shared.canonTowerHits[spacecraft.playerNumber]++;
                        this.hits[spacecraft.playerNumber]++; // Not used for anything
                        this.bullets.splice(i, 1);
                    }
                }
            });
        }
    }
}

class BasicMinimap {
    constructor(xMinimap, yMinimap, diameterMinimap, colorMinimap, diameterPlanet) {
        this.xMinimap = xMinimap;
        this.yMinimap = yMinimap;
        this.diameterMinimap = diameterMinimap;
        this.colorMinimap = colorMinimap;
        this.diameterPlanet = diameterPlanet;
    }

    draw() {

        const colorScheme = planetColors[me.planetIndex];

        if (showGraphics && allImagesLoadedSuccessfully) {
            image(fixedMinimapImage[me.planetIndex], this.xMinimap - this.diameterMinimap / 2, this.yMinimap - this.diameterMinimap / 2, this.diameterMinimap, this.diameterMinimap);
        } else {

            noStroke();
            fill(colorScheme.center[0], colorScheme.center[1], colorScheme.center[2]);
            circle(this.xMinimap, this.yMinimap, this.diameterMinimap);
        }

        let yWarpGateUpDisplay = selectedPlanet.yWarpGateUp;
        let yWarpGateDownDisplay = selectedPlanet.yWarpGateDown;

        fixedMinimap.drawObject(selectedPlanet.xWarpGateUp, yWarpGateUpDisplay, 10, 'cyan');
        fixedMinimap.drawObject(selectedPlanet.xWarpGateDown, yWarpGateDownDisplay, 10, 'magenta');

        this.drawSpacecrafts()

        // Draw planet name
        push();
        fill('white');
        textAlign(CENTER, BOTTOM);
        textSize(14);
        text(colorScheme.name, this.xMinimap, this.yMinimap + this.diameterMinimap / 2 + 20);
        pop();
    }
    simpleDraw() {

        const colorScheme = planetColors[me.planetIndex];

        if (showGraphics && allImagesLoadedSuccessfully) {
            image(fixedMinimapImage[me.planetIndex], this.xMinimap - this.diameterMinimap / 2, this.yMinimap - this.diameterMinimap / 2, this.diameterMinimap, this.diameterMinimap);
        } else {

            noStroke();
            fill(colorScheme.center[0], colorScheme.center[1], colorScheme.center[2]);
            circle(this.xMinimap, this.yMinimap, this.diameterMinimap);
        }

        let yWarpGateUpDisplay = selectedPlanet.yWarpGateUp;
        let yWarpGateDownDisplay = selectedPlanet.yWarpGateDown;

        this.drawObject(selectedPlanet.xWarpGateUp, yWarpGateUpDisplay, 10, 'cyan');
        this.drawObject(selectedPlanet.xWarpGateDown, yWarpGateDownDisplay, 10, 'magenta');

        this.drawSpacecrafts()

        // Draw planet name
        push();
        fill('white');
        textAlign(CENTER, BOTTOM);
        textSize(14);
        text(colorScheme.name, this.xMinimap, this.yMinimap + this.diameterMinimap / 2 + 20);
        pop();
    }

    drawWarpGateIndicators() {

        const upGateX = map(this.xWarpGateUp, 0, this.diameterPlanet,
            this.xMinimap - this.diameterMinimap / 2,
            this.xMinimap + this.diameterMinimap / 2);
        const upGateY = map(this.yWarpGateUp, 0, this.diameterPlanet,
            this.yMinimap - this.diameterMinimap / 2,
            this.yMinimap + this.diameterMinimap / 2);

        const downGateX = map(this.xWarpGateDown, 0, this.diameterPlanet,
            this.xMinimap - this.diameterMinimap / 2,
            this.xMinimap + this.diameterMinimap / 2);
        const downGateY = map(this.yWarpGateDown, 0, this.diameterPlanet,
            this.yMinimap - this.diameterMinimap / 2,
            this.yMinimap + this.diameterMinimap / 2);

        push();
        fill('cyan');
        stroke('white');
        strokeWeight(1);
        circle(upGateX, upGateY, 10);
        pop();

        push();
        fill('magenta');
        stroke('white');
        strokeWeight(1);
        circle(downGateX, downGateY, 10);
        pop();
    }

    isOnPlanet(xGlobalPlusLocal, yGlobalPlusLocal) {
        let xCenterPlanet = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);
        let yCenterPlanet = xCenterPlanet;

        let distance = dist(xGlobalPlusLocal, yGlobalPlusLocal, xCenterPlanet, yCenterPlanet);
        let dMapped = map(this.diameterMinimap, 0, this.diameterMinimap, 0, this.diameterPlanet);
        return distance < dMapped / 2;
    }

    drawObject(xGlobalPlusLocal, yGlobalPlusLocal, diameter, color) {

        fill(color);

        // Calculate position relative to minimap center
        let xObjectOnMinimap = map(xGlobalPlusLocal, 0, this.diameterPlanet,
            this.xMinimap - this.diameterMinimap / 2,
            this.xMinimap + this.diameterMinimap / 2);

        let yObjectOnMinimap = map(yGlobalPlusLocal, 0, this.diameterPlanet,
            this.yMinimap - this.diameterMinimap / 2,
            this.yMinimap + this.diameterMinimap / 2);

        circle(xObjectOnMinimap, yObjectOnMinimap, diameter);
    }

    drawSpacecrafts() {
        activeCharacters.forEach(spacecraft => {

            if (!spacecraft.playerColor
                || !spacecraft.hasCharacter
                || spacecraft.status === 'lost'
                || spacecraft.planetIndex != me.planetIndex
                || spacecraft.isCloaked
            ) return;

            this.drawSpacecraft(spacecraft);
        });
    }
    drawSpacecraft(spacecraft) {

        // Calculate position relative to minimap center
        let posX = map(spacecraft.xLocal, 0, this.diameterPlanet,
            this.xMinimap - this.diameterMinimap / 2,
            this.xMinimap + this.diameterMinimap / 2);

        let posY = map(spacecraft.yLocal, 0, this.diameterPlanet,
            this.yMinimap - this.diameterMinimap / 2,
            this.yMinimap + this.diameterMinimap / 2);

        push()
        if (spacecraft.playerNumber === me.playerNumber) {
            fill('red')
        } else {
            spacecraft.setSpacecraftColor()
        }
        circle(posX, posY, 18);
        pop()

    }
    update(diameterPlanet, xWarpGateUp, yWarpGateUp, xWarpGateDown, yWarpGateDown, diameterWarpGate) {
        this.diameterPlanet = diameterPlanet;
        this.xWarpGateUp = xWarpGateUp;
        this.yWarpGateUp = yWarpGateUp;
        this.xWarpGateDown = xWarpGateDown;
        this.yWarpGateDown = yWarpGateDown;
        this.diameterWarpGate = diameterWarpGate;
    }
}

class BackgroundStarManager {
    constructor(starCount, xRange, yRange) {
        this.stars = [];
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new BackgroundStar(random(xRange), random(yRange)));
        }
    }

    move() {
        for (let star of this.stars) {
            star.move();
        }
    }

    show() {
        stroke(255, this.alpha);
        fill(255, this.alpha);
        for (let star of this.stars) {
            star.show();
        }
        strokeWeight(0);
    }
}

class CelestialObject {
    constructor(angle, distance, tiltEffect) {
        this.angle = angle;
        this.distance = distance;
        this.tiltEffect = tiltEffect;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    drawOrbit() {
        stroke(100);
        noFill();
        beginShape();
        for (let a = 0; a < 360; a++) {
            let x = cos(a) * this.distance;
            let y = sin(a) * this.distance * this.tiltEffect;
            vertex(x, y);
        }
        endShape(CLOSE);
    }
}

class Planet extends CelestialObject {
    constructor(angle, baseSpeed, distance, tiltEffect, diameterPlanet, color, yCropOffset, xWarpGateUp, yWarpGateUp, xWarpGateDown, yWarpGateDown, diameterWarpGate) {
        super(angle, distance, tiltEffect);
        this.baseSpeed = baseSpeed;
        this.baseSize = diameterPlanet / 30;
        this.color = color;
        this.diameterPlanet = diameterPlanet;
        this.diameterMinimap = this.baseSize;
        this.planetIndex = 0;
        this.yCropOffset = yCropOffset; // Offset for y position to adjust for minimap cropping
        this.xWarpGateUp = xWarpGateUp
        this.yWarpGateUp = yCropOffset + yWarpGateUp
        this.xWarpGateDown = xWarpGateDown
        this.yWarpGateDown = yCropOffset + yWarpGateDown
        this.diameterWarpGate = diameterWarpGate
    }

    update(speedMultiplier, planetSpeed, diameterMinimap) {
        this.angle += this.baseSpeed * speedMultiplier * planetSpeed;
        this.diameterMinimap = diameterMinimap;
    }

    draw() {

        const colorScheme = planetColors[this.planetIndex];

        if (showGraphics && allImagesLoadedSuccessfully) {
            image(fixedMinimapImage[this.planetIndex], this.x, this.y, this.diameterMinimap, this.diameterMinimap);
        } else {
            noStroke();
            fill(colorScheme.center[0], colorScheme.center[1], colorScheme.center[2]);
            circle(this.x + this.diameterMinimap / 2, this.y + this.diameterMinimap / 2, this.diameterMinimap);
        }

        this.drawWarpGateIndicators()

        this.drawSpacecrafts();

        // Draw planet name
        push();
        fill('white');
        textAlign(CENTER, BOTTOM);
        textSize(14);
        text(colorScheme.name, this.x + this.diameterMinimap / 2, this.y + this.diameterMinimap + 20);
        pop();
    }

    onPlanet(xF, yF) {

        let posX = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);
        let posY = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);

        let distance = dist(xF, yF, posX, posY);
        let dMapped = map(this.diameterMinimap, 0, this.diameterMinimap, 0, this.diameterPlanet);
        return distance < dMapped / 2 && yF > selectedPlanet.yCropOffset && yF < selectedPlanet.yCropOffset + GAME_AREA_HEIGHT_NEW;  // Return true if the point is inside the planet        
    }

    onPlanetBullet(xF, yF) { 

        let posX = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);
        let posY = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);

        let distance = dist(xF, yF, posX, posY);
        let dMapped = map(this.diameterMinimap, 0, this.diameterMinimap, 0, this.diameterPlanet);
        return distance < dMapped;  // Return true if the point is inside the planet        
    }

    onPlanet2(xF, yF) {
        let posX = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);
        let posY = map(this.diameterMinimap / 2, 0, this.diameterMinimap, 0, this.diameterPlanet);

        let distance = dist(xF, yF, posX, posY);
        let dMapped = map(this.diameterMinimap, 0, this.diameterMinimap, 0, this.diameterPlanet);
        return distance < dMapped / 2;  // Return true if the point is inside the planet        
    }

    drawSpacecrafts() {
        activeCharacters.forEach(spacecraft => {  

            if (!spacecraft.playerColor
                || !spacecraft.hasCharacter
                || spacecraft.status === 'lost'
                || spacecraft.planetIndex != this.planetIndex
                || spacecraft.isCloaked
            ) return;

            this.drawSpacecraft(spacecraft);
        });
    }


    drawSpacecraft(spacecraft) {
        let posX = this.x + map(spacecraft.xLocal, 0, this.diameterPlanet, 0, this.diameterMinimap);
        let posY = this.y + map(spacecraft.yLocal, 0, this.diameterPlanet, 0, this.diameterMinimap);
        push()
        if (spacecraft.playerNumber === me.playerNumber) {
            fill('red')
        } else {
            spacecraft.setSpacecraftColor()
        }
        circle(posX, posY, 18);
        pop()
    }

    drawWarpGateIndicators() {

        // When drawing the solar system we transform the coordinates to the solar system coordinates
        let upGateX = this.x + map(this.xWarpGateUp, 0, this.diameterPlanet, 0, this.diameterMinimap);
        let upGateY = this.y + map(this.yWarpGateUp, 0, this.diameterPlanet, 0, this.diameterMinimap);

        let downGateX = this.x + map(this.xWarpGateDown, 0, this.diameterPlanet, 0, this.diameterMinimap);
        let downGateY = this.y + map(this.yWarpGateDown, 0, this.diameterPlanet, 0, this.diameterMinimap);

        push();
        fill('cyan');
        stroke('white');
        strokeWeight(1);
        circle(upGateX, upGateY, 10);
        pop();

        // Draw down gate
        push();
        fill('magenta');
        stroke('white');
        strokeWeight(1);
        circle(downGateX, downGateY, 10);
        pop();
    }

}

class Star extends CelestialObject {
    constructor(orbit, mass) {
        super(0, orbit, 0.15);
        this.mass = mass;
    }

    drawStarEffect(x, y, hsb2, hsb3, hsb4, hsb5, fill1, fill2, fill3, fill4, cr, coronaEffect) {

        if (showBlurAndTintEffects) {
            push();
            blendMode(BLEND);
            colorMode(HSB, hsb2, hsb3, hsb4, hsb5);
            blendMode(ADD);
            for (let d = 0; d < 1; d += 0.01) {
                fill(fill1, fill2, fill3, (1.1 - d * 1.2) * fill4);
                circle(x, y, cr * d + random(0, coronaEffect));
            }
            pop();
        } else {
            push();
            fill(255, 0, 0);
            stroke(255, 0, 0);
            strokeWeight(2);
            circle(x, y, cr / 3);
            pop();
        }
    }
}

class BlackHole extends Star {
    draw() {
        this.drawStarEffect(this.x, this.y, 1000, 100, 100, 710, 50, 100, 100, 30, 150, 10);
        fill(0);
        circle(this.x, this.y, 30);
    }
}

class YellowStar extends Star {
    draw() {
        fill(0);
        circle(this.x, this.y, 110);
        this.drawStarEffect(this.x, this.y, 430, 800, 1500, 1010, 50, 550, 300, 400, 300, 0);
    }
}

class SolarSystem {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.angleStars = 0;
        this.starSpeed = 0.5;
        this.planetSpeed = 0.2;
        this.planets = [
            new Planet(random(360), 0.7, 400, 0.05, 2000, [0, 102, 204], 450, 369, 945, 1796, 735, 100),
            new Planet(random(360), 0.5, 700, 0.08, 2000, [0, 122, 174], 450, 1232, 440, 1610, 260, 100),
            new Planet(random(360), 0.4, 1100, 0.04, 2000, [0, 142, 144], 250, 1062, 660, 305, 295, 200),
            new Planet(random(360), 0.3, 1400, 0.06, 2000, [0, 162, 114], 300, 833, 840, 610, 973, 200),
            new Planet(random(360), 0.25, 1800, 0.03, 2000, [0, 182, 84], 800, 1080, 876, 1638, 277, 200)
        ];

        this.blackHole = new BlackHole(75, 5);
        this.yellowStar = new YellowStar(300, 1);

        // Assign planetIndex to each planet
        this.planets.forEach((planet, index) => {
            planet.planetIndex = index;
        });
    }

    update() {
        this.angleStars += this.starSpeed;
        let totalMass = this.blackHole.mass + this.yellowStar.mass;

        // Update stars
        this.blackHole.updatePosition(
            cos(this.angleStars) * this.blackHole.distance * (this.yellowStar.mass / totalMass),
            sin(this.angleStars) * this.blackHole.distance * this.blackHole.tiltEffect
        );

        this.yellowStar.updatePosition(
            -cos(this.angleStars) * this.yellowStar.distance * (this.blackHole.mass / totalMass),
            -sin(this.angleStars) * this.yellowStar.distance * this.yellowStar.tiltEffect
        );

        // Update planets
        this.planets.forEach(planet => {
            let planetX = cos(planet.angle) * planet.distance;
            let planetY = sin(planet.angle) * planet.distance * planet.tiltEffect;

            let distanceFactor = map(planetY, 0, planet.distance * planet.tiltEffect, 1.5, 0.5);
            //distanceFactor= 3
            let diameterMinimap = planet.baseSize * (4 - distanceFactor);
            let speedMultiplier = map(distanceFactor, 0.5, 1.5, 1.5, 0.8);

            planet.update(speedMultiplier, this.planetSpeed, diameterMinimap);
            planet.updatePosition(planetX, planetY);
        });
    }

    draw() {
        translate(this.x, this.y);

        // Sort and draw planets based on y position
        const frontPlanets = this.planets.filter(p => p.y >= 0);
        const backPlanets = this.planets.filter(p => p.y < 0);

        backPlanets.forEach(planet => planet.draw());

        if (this.yellowStar.y > 0) {
            this.blackHole.draw();
            this.yellowStar.draw();
        } else {
            this.yellowStar.draw();
            this.blackHole.draw();
        }

        frontPlanets.forEach(planet => planet.draw());
    }
    drawCenter() {
        translate(this.x, this.y);

        if (this.yellowStar.y > 0) {
            this.blackHole.draw();
            this.yellowStar.draw();
        } else {
            this.yellowStar.draw();
            this.blackHole.draw();
        }
    }
}

class BackgroundStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = random(0, 0.1);
        this.alpha = map(this.speed, 0, 0.08, 0, 200);
    }
    move() {
        this.x -= this.speed;

        if (this.x < 0) {
            this.x += width;
            this.y = random(height);
        }
    }

    show() {
        if (this.speed > 0.09) {
            strokeWeight(3);
        } else if (this.speed > 0.08) {
            strokeWeight(2);
        } else {
            strokeWeight(1);
        }
        ellipse(this.x, this.y, 1, 1);
    }
}