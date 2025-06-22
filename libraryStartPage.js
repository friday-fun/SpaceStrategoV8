function drawRulesSection() {
    const centerX = IMAGE_RING_X + CIRCLE_RADIUS;
    const centerY = IMAGE_RING_Y + CIRCLE_RADIUS;

    // Game title
    textAlign(CENTER, CENTER);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(100, 200, 255, 0.9)';
    fill(100, 150, 255); 
    textSize(34);
    textFont('Helvetica');
    text("SPACE STRATEGO", centerX + 100, centerY - 180 );
    drawingContext.shadowBlur = 0;

    // Game rules
    fill(200, 220, 255);
    textSize(18);

 const rules = 
        "This game is perfect for a Friday Fun activity where two teams \n" +
        "compete head-to-head to determine who comes out on top. \n\n" +

        "Imagine you are located in a binary star system far away. \n" +
        "The planets are very different from everything you know. You are in \n" +
        "a spacecraft ready to explore and conquer these strange worlds.  \n" +
        "(Note: Hover the images when the images have been loaded.) \n\n" +

        "The optimal number of players are between 5 and 10 on each team (max 15). \n" +
        "Start with a group call including all players (from both teams). The game \n" +
        "organizer can share the screen to ensure that all players have selected \n" +
        "the correct team and to agree on how long time to play for. Rules and\n" +
        "instructions are available after selecting a team. When you are ready \n" +
        "to start the game (each team must choose a Core Commander) then each\n" +
        "team can have a group call to coordinate strategy. Also please use your\n" +
        "real first names. (Use a large HD screen to get the best experience) \n\n" +
        "Have fun. You will need it! Game by Jens Valdez\n";

    text(rules, centerX + 100, centerY + 75);
}

//===================================================
// USER INTERFACE FUNCTIONS
//===================================================

function createNameInput() {

    const centerX = IMAGE_RING_X + CIRCLE_RADIUS - 40;
    const centerY = IMAGE_RING_Y + CIRCLE_RADIUS + 320;

    // Generate a default player name
    const randomNum = Math.floor(Math.random() * 999) + 1;
//    const defaultName = `Player${randomNum}`;
    const defaultName = ` `;
 
    nameInput = createInput(defaultName);
    nameInput.position(centerX, centerY);
    nameInput.size(300, 30);
    nameInput.attribute('placeholder', 'Enter Player Name');

    chooseTeamBlueButton = createButton('Join Purple Team');
    chooseTeamBlueButton.position(centerX, centerY + 50);
    chooseTeamBlueButton.size(145, 40);
    chooseTeamBlueButton.style('background-color', 'purple');
    chooseTeamBlueButton.mousePressed(() => setPlayerInfo('blue'));

    chooseTeamGreenButton = createButton('Join Green Team');
    chooseTeamGreenButton.position(centerX + 155, centerY + 50);
    chooseTeamGreenButton.size(145, 40);
    chooseTeamGreenButton.style('background-color', 'lightgreen');
    chooseTeamGreenButton.mousePressed(() => setPlayerInfo('green'));
}

// Enhanced Jellyfish class with more functionality (renamed from Blob) 2 2
class Jellyfish {
    constructor(x, y, delay, baseXSpeed, baseYSpeed, accel, imageIndex, width, height) {
        this.x = x;
        this.y = y;
        this.active = false;
        this.moving = false;
        this.startTime = 0;
        this.initialDelay = delay;
        this.baseXSpeed = baseXSpeed;
        this.baseYSpeed = baseYSpeed;
        this.acceleration = accel;
        this.speedMultiplier = 1.0;
        this.disabled = false;
        this.imageIndex = imageIndex; 
        this.width = width;          
        this.height = height;      
    }

    activate(currentTime) {
        if (!this.disabled && !this.active) {
            this.active = true;
            this.startTime = currentTime;
            this.moving = false;
            this.speedMultiplier = 1.0;
            return true;
        }
        return false;
    }

    deactivate() {
        this.active = false;
    }

    disable() {
        this.active = false;
        this.disabled = true;
    }

    update(currentTime) {
        if (!this.active || this.disabled) return;

        // Check if we should start moving this jellyfish
        if (!this.moving && currentTime - this.startTime > this.initialDelay) {
            this.moving = true;
            this.speedMultiplier = 1.0; 
        }

        // Move the jellyfish if animation has started
        if (this.moving) {
            // Calculate current speeds with acceleration applied
            const currentXSpeed = this.baseXSpeed * this.speedMultiplier;
            const currentYSpeed = this.baseYSpeed * this.speedMultiplier;

            // Move the jellyfish
            this.x -= currentXSpeed;
            this.y -= currentYSpeed;
 
            // Increase speed over time
            this.speedMultiplier += this.acceleration;

            // Check if the jellyfish is 400px outside the canvas before removing
            if (this.y < -400) {
                this.disable(); 
                return true; 
            }
        }
        return false;
    }

    draw(x, y, jellyfishImages) {
        if (!this.active) return;

        // Use the jellyfish's image index to get the correct image
        const jellyfishImage = jellyfishImages[this.imageIndex % jellyfishImages.length];
        // Position is relative to the panel position, use the jellyfish's width and height
        image(jellyfishImage, x + this.x, y + this.y, this.width, this.height);
    }

    isActive() {
        return this.active;
    }

    isDisabled() {
        return this.disabled;
    }
}

// New Jellyfishs class to manage multiple jellyfishes (renamed from Blobs)
class Jellyfishs {
    constructor() {
        this.jellyfishes = []; 
        this.jellyfishImages = []; 
        this.isPermanentlyDisabled = false;
    }

    // Initialize with jellyfish images
    setImages(images) {
        this.jellyfishImages = images;
    }

    // Add a jellyfish configuration to the collection
    addJellyfish(x, y, delay, baseXSpeed, baseYSpeed, accel, imageIndex, width, height) {
        const jellyfish = new Jellyfish(x, y, delay, baseXSpeed, baseYSpeed, accel, imageIndex, width, height);
        this.jellyfishes.push(jellyfish);
        return jellyfish;
    }

    // Initialize standard set of jellyfishes
    initializeDefaultJellyfishes() {
        this.jellyfishes = [];
        this.isPermanentlyDisabled = false;

        // Each jellyfish now has different image index and size
        this.addJellyfish(108, 565, 2500, 0.15, 0.4, 0.018, 1, 136, 136);    // LeftLeft
        this.addJellyfish(350, 626, 3000, 0.12, 0.5, 0.022, 2, 102, 125);    // LowerMiddle
        this.addJellyfish(532, 583, 6500, 0.14, 0.35, 0.074, 3, 143, 183);   // LowerRight 
        this.addJellyfish(72, 235, 4500, 0.13, 0.38, 0.026, 1, 45, 59);      // upperLeft 
        this.addJellyfish(695, 13, 5000, 0.09, 0.42, 0.021, 2, 50, 57);      // UpperRight
    }

    // Activate all inactive jellyfishes
    activateAll() {
        if (this.isPermanentlyDisabled) return;

        const currentTime = millis();
        for (let jellyfish of this.jellyfishes) {
            jellyfish.activate(currentTime);
        }
    }

    // Deactivate all jellyfishes
    deactivateAll() {
        for (let jellyfish of this.jellyfishes) {
            jellyfish.deactivate();
        }
    }

    // Update all active jellyfishes
    update() {
        if (this.isPermanentlyDisabled) return;

        const currentTime = millis();
        let allDisabled = true;

        for (let jellyfish of this.jellyfishes) {
            jellyfish.update(currentTime);
            if (!jellyfish.isDisabled()) {
                allDisabled = false;
            }
        }

        // If all jellyfishes are disabled, mark the collection as permanently disabled
        if (allDisabled) {
            this.isPermanentlyDisabled = true;
        }

        return this.isPermanentlyDisabled;
    }

    // Draw all active jellyfishes
    draw(panelX, panelY) {
        for (let jellyfish of this.jellyfishes) {
            jellyfish.draw(panelX, panelY, this.jellyfishImages);
        }
    }

    // Check if all jellyfishes are permanently disabled
    areAllDisabled() {
        return this.isPermanentlyDisabled;
    }
}

// New Spejder class to manage spejder animations
class Spejder {
    constructor() {

        // Animation state
        this.currentFrameIndex = 0;
        this.lastUpdateTime = 0;
        this.animationSpeed = 0.15; // Controls the animation frame rate

        // Position and movement
        this.posX = 0;  // Current X position percentage (0-1)
        this.posY = 0;  // Current Y position percentage (0-1)
        this.movementSpeed = 0.00015; // How fast the spejder moves
        this.isMovingLeft = false;

        // Scaling and cycling
        this.scaleFactor = 0.2;  // Start at fifth size
        this.inCycleMode = false;
        this.initialX = 0;
        this.initialY = 0;

        // Base dimensions
        this.baseWidth = 300;
        this.baseHeight = 228;
    }

    // Reset animation state
    reset() {
        this.posX = 0;
        this.posY = 0;
        this.isMovingLeft = false;
        this.inCycleMode = false;
        this.initialX = 0;
        this.initialY = 0;
        this.scaleFactor = 0.2;
        this.currentFrameIndex = 0;
    }

    // Update animation frame and position
    update() {
        // Update animation frame at specified intervals
        const currentTime = millis();
        if (currentTime - this.lastUpdateTime > 1000 * this.animationSpeed) {
            // Update frame index based on movement direction
            if (this.inCycleMode && !this.isMovingLeft) {
                // Play animation in reverse when moving right (going back)
                this.currentFrameIndex = (this.currentFrameIndex - 1 + framesLeft.length) % framesLeft.length;
            } else {
                // Normal forward animation
                this.currentFrameIndex = (this.currentFrameIndex + 1) % framesLeft.length;
            }
            this.lastUpdateTime = currentTime;
        }

        // Calculate panel dimensions
        const circleRightEdge = IMAGE_RING_X + 100 + CIRCLE_RADIUS * 2 + 150;
        const enlargedSize = 800;
        const panelX = circleRightEdge;
        const panelY = height / 2 - enlargedSize / 2 - 100;

        // Calculate actual X and Y positions
        const margin = 20;
        const maxX = enlargedSize - this.baseWidth - margin;
        const maxY = enlargedSize - this.baseHeight - margin;

        const animX = panelX + margin + (maxX * this.posX) + 600;
        const animY = panelY + margin + (maxY * this.posY) + 200;

        // Store initial position when we first start the animation
        if (!this.inCycleMode && this.initialX === 0 && this.initialY === 0) {
            this.initialX = animX;
            this.initialY = animY;
        }

        // Update scale factor based on Y position
        if (animY > 440) {
            this.scaleFactor = 1.0; // Full size when Y > 440
        } else {
            // Scale linearly between 0.2 and 1.0 based on position between start Y and 440
            const scaleProgress = map(animY, this.initialY, 440, 0.2, 1.0);
            this.scaleFactor = constrain(scaleProgress, 0.2, 1.0);
        }

        // Transition to cycle mode when reaching bottom of path
        if (animY >= 550 && !this.inCycleMode) {
            this.inCycleMode = true;
            this.isMovingLeft = false; // Go back to starting position
            //  console.log("Transitioning to cycle mode at Y:", animY);
        }

        // Update position based on cycle mode
        if (this.inCycleMode) {
            if (this.isMovingLeft) {
                // Moving left
                this.posX = this.posX - this.movementSpeed;

                // Also update Y position when moving left in cycle mode
                this.posY = min(this.posY + this.movementSpeed, 0.8);

                // Reverse direction when reaching left boundary
                if (animX <= this.initialX - 300) {
                    this.isMovingLeft = false;
                }
            } else {
                // Moving right (returning to start)
                this.posX = this.posX + this.movementSpeed;

                // Adjust Y position to return to initial Y
                if (animY > this.initialY) {
                    this.posY = this.posY - this.movementSpeed;
                }

                // Check if we've returned to starting position
                const distanceToStart = dist(animX, animY, this.initialX, this.initialY);
                if (distanceToStart < 5) {
                    // Reset to exact starting position
                    this.posX = (this.initialX - (panelX + margin + 600)) / maxX;
                    this.posY = (this.initialY - (panelY + margin + 200)) / maxY;

                    // Start a new cycle
                    this.isMovingLeft = true;
                }

                // If we've gone too far right, correct
                if (animX > this.initialX + 10) {
                    this.isMovingLeft = true;
                }
            }
        } else {
            // Initial phase: just move left
            this.posX = this.posX - this.movementSpeed;

            // Always update Y position if not in cycle mode
            this.posY = min(this.posY + this.movementSpeed, 0.8);
        }

        return { animX, animY, panelX, panelY, margin };
    }

    // Draw the spejder at current position with current animation frame
    draw(panelX, panelY, enlargedSize) {
        // Skip if no frames loaded
        if (framesLeft.length === 0) return;

        // Update animation
        const { animX, animY } = this.update();

        // Apply scaling factor to dimensions
        const animationWidth = this.baseWidth * this.scaleFactor;
        const animationHeight = this.baseHeight * this.scaleFactor;

        // Adjust position to account for scaling (center the scaled image)
        const adjustedX = animX + (this.baseWidth - animationWidth) / 2;
        const adjustedY = animY + (this.baseHeight - animationHeight) / 2;

        // Use appropriate frames based on direction
        const currentFrames = this.isMovingLeft ? framesRight : framesLeft;

        // Draw current frame.
        const currentFrameIndex = this.currentFrameIndex % currentFrames.length;
        image(currentFrames[currentFrameIndex], adjustedX, adjustedY, animationWidth, animationHeight);
    }
}

// New ImageIndex8Manager class to manage all animations for image index 8
class ImageIndex8Manager {
    constructor() {

        // Warpgate A animation properties
        this.warpgateAIndex = 0;
        this.lastWarpgateAUpdate = 0;
        this.warpgateAAnimationSpeed = 0.15;
        this.warpgateAWidth = 109;
        this.warpgateAHeight = 92;

        // LightTower animation properties
        this.warpgateBIndex = 0;
        this.lastWarpgateBUpdate = 0;
        this.warpgateBDirection = 1;
        this.warpgateBAnimationSpeed = 0.15;
        this.warpgateBWidth = 207;
        this.warpgateBHeight = 161;
    }

    // Reset all animations
    reset() {
        // Reset warpgate animation
        this.warpgateAIndex = 0;
        this.lastWarpgateAUpdate = 0;

        // Reset lightTower animation
        this.warpgateBIndex = 0;
        this.warpgateBDirection = 1;
        this.lastWarpgateBUpdate = 0;
    }

    updateWarpgateAAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastWarpgateAUpdate > 1000 * this.warpgateAAnimationSpeed) {
            // Correctly increment the warpgate A index with proper bounds checking
            this.warpgateAIndex = (this.warpgateAIndex + 1) % warpgateAImages.length;

            this.lastWarpgateAUpdate = currentTime;
        }
    }

    // Update warpgate animation frames using ping-pong effect
    updateWarpgateBAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastWarpgateBUpdate > 1000 * this.warpgateBAnimationSpeed) {
            // Update the frame index based on current direction
            this.warpgateBIndex += this.warpgateBDirection;

            // Make sure we stay within the image array bounds
            if (this.warpgateBIndex >= warpgateBImages.length - 1) {
                this.warpgateBIndex = warpgateBImages.length - 1;
                this.warpgateBDirection = -1; // Start going backward
            } else if (this.warpgateBIndex <= 0) {
                this.warpgateBIndex = 0;
                this.warpgateBDirection = 1; // Start going forward
            }

            this.lastWarpgateBUpdate = currentTime;
        }
    }

    // Draw the warpgate animation at specific position
    drawWarpgateAAnimation(panelX, panelY) {
        if (warpgateAImages.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const warpgateX = panelX + 191; // Position from left edge of panel
        const warpgateY = panelY + 382; // Position from top edge of panel

        // Draw current frame
        const currentFrame = warpgateAImages[this.warpgateAIndex];
        if (currentFrame) {
            image(currentFrame, warpgateX, warpgateY, this.warpgateAWidth, this.warpgateAHeight);
        }
    }

    // Draw the warpgate animation at specific position
    drawWarpgateBAnimation(panelX, panelY) {
        if (warpgateBImages.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const warpgateX = panelX + 420; // Position from left edge of panel
        const warpgateY = panelY + 169; // Position from top edge of panel

        // Draw current frame
        const currentFrame = warpgateBImages[this.warpgateBIndex];
        if (currentFrame) {
            image(currentFrame, warpgateX, warpgateY, this.warpgateBWidth, this.warpgateBHeight);
        }
    }

    // Update and render all animations for image index 11
    updateAndDraw(panelX, panelY, enlargedSize) {
        // Update animations
        this.updateWarpgateAAnimation();
        this.updateWarpgateBAnimation();

        // Draw all elements
        this.drawWarpgateAAnimation(panelX, panelY);
        this.drawWarpgateBAnimation(panelX, panelY);
    }
}

// New ImageIndex11Manager class to manage all animations for image index 11
class ImageIndex11Manager {
    constructor() {
        // Create a spejder instance
        //this.spejder = new Spejder();

        // Warpgate animation properties
        this.warpgateIndex = 0;
        this.lastWarpgateUpdate = 0;
        this.warpgateDirection = 1; // 1 = forward, -1 = reverse
        this.warpgateAnimationSpeed = 0.15;
        this.warpgateWidth = 192;
        this.warpgateHeight = 150;

        // LightTower animation properties
        this.lightTowerIndex = 0;
        this.lastLightTowerUpdate = 0;
        this.lightTowerDirection = 1;
        this.lightTowerAnimationSpeed = 0.15;
        this.lightTowerWidth = 98;
        this.lightTowerHeight = 75;
    }

    // Reset all animations
    reset() {
        // Reset spejder
        //this.spejder.reset();

        // Reset warpgate animation
        this.warpgateIndex = 0;
        this.warpgateDirection = 1;
        this.lastWarpgateUpdate = 0;

        // Reset lightTower animation
        this.lightTowerIndex = 0;
        this.lightTowerDirection = 1;
        this.lastLightTowerUpdate = 0;
    }

    // Update warpgate animation frames using ping-pong effect
    updateWarpgateAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastWarpgateUpdate > 1000 * this.warpgateAnimationSpeed) {
            // Update the frame index based on current direction
            this.warpgateIndex += this.warpgateDirection;

            // Make sure we stay within the image array bounds
            if (this.warpgateIndex >= warpgateImages11.length - 1) {
                this.warpgateIndex = warpgateImages11.length - 1;
                this.warpgateDirection = -1; // Start going backward
            } else if (this.warpgateIndex <= 0) {
                this.warpgateIndex = 0;
                this.warpgateDirection = 1; // Start going forward
            }

            this.lastWarpgateUpdate = currentTime;
        }
    } 

    // Update lightTower animation frames using ping-pong effect
    updateLightTowerAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastLightTowerUpdate > 1000 * this.lightTowerAnimationSpeed) {
            // Update the frame index based on current direction
            this.lightTowerIndex += this.lightTowerDirection;

            // Make sure we stay within the image array bounds
            if (this.lightTowerIndex >= lightTowerImages.length - 1) {
                this.lightTowerIndex = lightTowerImages.length - 1;
                this.lightTowerDirection = -1; // Start going backward
            } else if (this.lightTowerIndex <= 0) {
                this.lightTowerIndex = 0;
                this.lightTowerDirection = 1; // Start going forward
            }

            this.lastLightTowerUpdate = currentTime;
        }
    }

    // Draw the warpgate animation at specific position
    drawWarpgateAnimation(panelX, panelY) {
        if (warpgateImages11.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const warpgateX = panelX + 455; // Position from left edge of panel
        const warpgateY = panelY + 515; // Position from top edge of panel

        // Draw current frame
        const currentFrame = warpgateImages11[this.warpgateIndex];
        if (currentFrame) {
            image(currentFrame, warpgateX, warpgateY, this.warpgateWidth, this.warpgateHeight);
        }
    }

    // Draw the lightTower animation at specific position
    drawLightTowerAnimation(panelX, panelY) {
        if (lightTowerImages.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const lightTowerX = panelX + 163; // Position from left edge of panel
        const lightTowerY = panelY + 50; // Position from top edge of panel

        // Draw current frame
        const currentFrame = lightTowerImages[this.lightTowerIndex];
        if (currentFrame) {
            image(currentFrame, lightTowerX, lightTowerY, this.lightTowerWidth, this.lightTowerHeight);
        }
    }

    // Update and render all animations for image index 11
    updateAndDraw(panelX, panelY, enlargedSize) {
        // Update animations
        this.updateWarpgateAnimation();
        this.updateLightTowerAnimation();

        // Draw all elements
        this.drawWarpgateAnimation(panelX, panelY);
        this.drawLightTowerAnimation(panelX, panelY);
        //this.spejder.draw(panelX, panelY, enlargedSize);
    }
}

// New ImageIndex13Manager class to manage all jellyfish animations for image index 13
class ImageIndex13Manager {
    constructor() {
        // Jellyfish management
        this.jellyfishManager = new Jellyfishs();
        this.isPermanentlyDisabled = false;
    }

    // Load all jellyfish assets 
    loadImages() {
        // Initialize the jellyfish manager with the loaded images
        this.jellyfishManager.setImages(jellyfishImages);
        this.jellyfishManager.initializeDefaultJellyfishes();
    }

    // Reset all animations
    reset() {
        // Reset jellyfish manager
        this.jellyfishManager.initializeDefaultJellyfishes();
        this.isPermanentlyDisabled = false;
    }

    // Activate all jellyfishes
    activateAll() {
        if (!this.isPermanentlyDisabled) {
            this.jellyfishManager.activateAll();
        }
    }

    // Deactivate all jellyfishes
    deactivateAll() {
        this.jellyfishManager.deactivateAll();
    }

    // Update all jellyfishes
    update() {
        if (this.isPermanentlyDisabled) return true;

        // Update jellyfishes and check if they're all disabled
        this.isPermanentlyDisabled = this.jellyfishManager.update();

        return this.isPermanentlyDisabled;
    }

    // Draw all jellyfishes
    draw(panelX, panelY) {
        this.jellyfishManager.draw(panelX, panelY);
    }

    // Check if all jellyfishes are disabled
    areAllDisabled() {
        return this.isPermanentlyDisabled;
    }

    // Update and render all animations for image index 13
    updateAndDraw(panelX, panelY) {
        // Activate jellyfishes if not permanently disabled
        if (!this.isPermanentlyDisabled) {
            this.activateAll();
        }

        // Update the jellyfishes
        this.update();

        // Draw all jellyfishes
        this.draw(panelX, panelY);

        return this.isPermanentlyDisabled;
    }
}

// New ImageIndex16Manager class to manage all animations for image index 11
class ImageIndex16Manager {
    constructor() {

        // Warpgate animation properties
        this.warpgateIndex = 0;
        this.lastWarpgateUpdate = 0;
        this.warpgateAnimationSpeed = 0.15;
        this.warpgateWidth = 88;
        this.warpgateHeight = 88;

        // Water animation properties
        this.waterIndex = 0;
        this.lastWaterUpdate = 0;
        this.waterAnimationSpeed = 0.15;
        this.waterWidth = 220;
        this.waterHeight = 199;
    }

    // Reset all animations
    reset() {

        // Reset warpgate animation
        this.warpgateIndex = 0;
        this.lastWarpgateUpdate = 0;

        // Reset warpgate animation
        this.waterIndex = 0;
        this.lastWaterUpdate = 0;
    }

    updateWarpgateAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastWarpgateUpdate > 1000 * this.warpgateAnimationSpeed) {
            // Correctly increment the warpgate index with proper bounds checking
            this.warpgateIndex = (this.warpgateIndex + 1) % warpgateImages16.length;

            this.lastWarpgateUpdate = currentTime;
        }
    }

    updateWaterAnimation() {
        const currentTime = millis();

        if (currentTime - this.lastWaterUpdate > 1000 * this.waterAnimationSpeed) {
            // Correctly increment the warpgate index with proper bounds checking
            this.waterIndex = (this.waterIndex + 1) % waterImages.length;

            this.lastWaterUpdate = currentTime;
        }
    }

    // Draw the warpgate animation at specific position
    drawWarpgateAnimation(panelX, panelY) {
        if (warpgateImages16.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const warpgateX = panelX + 571; // Position from left edge of panel
        const warpgateY = panelY + 558; // Position from top edge of panel

        // Draw current frame
        const currentFrame = warpgateImages16[this.warpgateIndex];
        if (currentFrame) {
            image(currentFrame, warpgateX, warpgateY, this.warpgateWidth, this.warpgateHeight);
        }
    }

    // Draw the water animation at specific position
    drawWaterAnimation(panelX, panelY) {
        if (waterImages.length === 0) return; // Skip if no images loaded

        // Calculate fixed position relative to the panel
        const waterX = panelX + 79; // Position from left edge of panel
        const waterY = panelY + 461; // Position from top edge of panel  

        // Draw current frame
        const currentFrame = waterImages[this.waterIndex];
        if (currentFrame) {
            image(currentFrame, waterX, waterY, this.waterWidth, this.waterHeight);
        }
    }

    // Update and render all animations for image index 11
    updateAndDraw(panelX, panelY, enlargedSize) {

        // Update animations
        this.updateWarpgateAnimation();
        this.updateWaterAnimation();

        // Draw all elements
        this.drawWarpgateAnimation(panelX, panelY);
        this.drawWaterAnimation(panelX, panelY);
    }
}

// New BlackCircle class to manage individual black circles
class BlackCircle {
    constructor(image, x, y, width, height, removalDelay) {
        this.image = image;           // The image to display
        this.x = x;                   // X position relative to panel
        this.y = y;                   // Y position relative to panel
        this.width = width;           // Width to display
        this.height = height;         // Height to display
        this.visible = true;          // Whether this circle is visible
        this.removalDelay = removalDelay; // Delay before removal (ms after full brightness)
        this.scheduledRemovalTime = 0;    // When this circle should be removed
    }

    // Schedule removal based on a reference time (full brightness time)
    scheduleRemoval(referenceTime) {
        this.scheduledRemovalTime = referenceTime + this.removalDelay;
        return this.scheduledRemovalTime;
    }

    // Check if it's time to hide this circle
    checkVisibility(currentTime) {
        if (this.scheduledRemovalTime > 0 && currentTime >= this.scheduledRemovalTime) {
            this.visible = false;
        }
        return this.visible;
    }

    // Draw the circle if visible
    draw(panelX, panelY) {
        if (!this.visible) return;

        image(this.image, panelX + this.x, panelY + this.y, this.width, this.height);
    }

    // Reset the circle
    reset() {
        this.visible = true;
        this.scheduledRemovalTime = 0;
    }
}



// New ImageIndex10Manager class to manage hangar team blue animations
class ImageIndex10Manager {
    constructor() {
        // Black circle management

        // Darkness animation
        this.darknessFactor = 0;
        this.darknessSpeed = 0.02;
        this.darknessDuration = 0; // Start brightening immediately
        this.brighteningDuration = 2500; // 2 seconds to fully brighten
        this.hoverStartTime = 0;
        this.fullBrightTime = 0;

        // Background image

        // Spacecraft
        this.spacecraft = [];

        // Animation timing
        this.animationState = 0; // 0: initial, 1: circles hidden, 2: upper moving, 3: lower moving, 4: moving to center, 5: complete
        this.stateChangeTime = 0;
        this.CIRCLES_HIDE_DELAY = 1000; // 1 second
        this.UPPER_MOVE_DELAY = 2000; // 2 seconds (1+1)
        this.LOWER_MOVE_DELAY = 3000; // 3 seconds (1+1+1)
        this.CENTER_MOVE_DELAY = 4000; // 4 seconds (1+1+1+1)
        this.VERTICAL_MOVE_DISTANCE = 30; // 30 pixels upward

        // Center movement parameters
        this.CENTER_X = 410; // Center X position within the panel 
        this.CENTER_Y = 193; // Center Y position within the panel
        this.FINAL_SIZE = 5;  // Final size before disappearing
        this.CENTER_INITIAL_SPEED = 0.01; // Even slower initial speed for more dramatic effect (was 0.02)

        // Track if all spacecraft have vanished
        this.allVanished = false;
    }

    // Reset all animations
    reset() {
        // Reset darkness animation
        this.darknessFactor = 0;
        this.hoverStartTime = 0;
        this.fullBrightTime = 0;
        // Reset spacecraft
        this.spacecraft.forEach(craft => craft.reset());
        this.stateChangeTime = 0;
    }

    // Load all animation assets
    loadImagesAndAddSpacecrafts() {

        // Create spacecraft objects
        this.spacecraft = [
            new HangarSpacecraft(upperLeftImg, 151, 377, 208, 111, blackCircleImg, 131, 636, 28, 26, 200, 638, 23, 24),
            new HangarSpacecraft(upperRightImg, 457, 378, 209, 113, blackCircleImg, 594, 635, 22, 21, 657, 635, 22, 23),
            new HangarSpacecraft(lowerLeftImg, 124, 523, 153, 142, blackCircleImg, 195, 459, 25, 25, 260, 459, 24, 23),
            new HangarSpacecraft(lowerRightImg, 540, 522, 147, 141, blackCircleImg, 528, 461, 25, 25, 591, 461, 24, 23)
        ];
    }

    // Draw all elements
    draw(panelX, panelY, panelSize, fadeAlpha) {
        if (!backgroundImage) return;

        // Apply darkness effect with tint
        const brightness = 255 * (1 - this.darknessFactor);
        tint(brightness, brightness, brightness, fadeAlpha);

        // Draw background image
        image(backgroundImage, panelX, panelY, panelSize, panelSize);

        // Update and then draw each spacecraft
        this.spacecraft.forEach(craft => {
            craft.update(); // Call update before drawing
            craft.draw(panelX, panelY);
        });
    }

    // Update all animations and render
    updateAndDraw(panelX, panelY, panelSize, fadeAlpha) {

        const currentTime = millis();

        // Always treat the first update as a new hover
        if (this.hoverStartTime === 0 && this.animationState < 5) {
            this.darknessFactor = 1.0; // Start fully dark
            this.animationState = 0;
        }

        // Update darkness animation
        this.updateDarkness(currentTime);

        // Only start the spacecraft animation sequence after we've finished brightening
        if (this.darknessFactor === 0) {
            // Update animation state based on timing
            this.updateAnimationState(currentTime);
        }

        // Draw everything
        this.draw(panelX, panelY, panelSize, fadeAlpha);

        return false; // Don't need to signal start of hover anymore
    }

    // Update darkness animation - modified to ensure brightness when animation completes
    updateDarkness(currentTime) {
        // Always keep brightness at maximum when animation has completed
        if (this.animationState === 5) {
            this.darknessFactor = 0;
            return;
        }

        // If this is the very first update after hover starts, set darkness to maximum
        if (this.hoverStartTime === 0) {
            this.hoverStartTime = currentTime;
            this.darknessFactor = 1.0; // Start fully dark (was 0.5)
        }

        // Calculate hover duration
        const hoverDuration = currentTime - this.hoverStartTime;

        if (hoverDuration <= this.darknessDuration) {
            // Keep initial darkness for the first period (now 0 seconds)
            this.darknessFactor = 1.0; // Fully dark
        } else if (hoverDuration <= this.darknessDuration + this.brighteningDuration) {
            // Gradually brighten over 2 seconds
            const brighteningProgress = (hoverDuration - this.darknessDuration) / this.brighteningDuration;
            this.darknessFactor = 1.0 - brighteningProgress; // Linear brightening from 1.0 to 0.0
        } else {
            // After total time, return to normal brightness
            this.darknessFactor = 0;
            // Store the time when we reached full brightness
            if (this.fullBrightTime === 0) {
                this.fullBrightTime = currentTime;
            }
        }
    }

    // Update animation states based on timing
    updateAnimationState(currentTime) {
        // Don't progress animation unless we've started hovering
        if (this.hoverStartTime === 0 || this.animationState === 5) return;

        // Calculate how long we've been hovering
        const hoverDuration = currentTime - this.hoverStartTime;

        // Handle state transitions based on hover duration
        if (this.animationState === 0 && hoverDuration >= this.CIRCLES_HIDE_DELAY) {
            // 1 second: Hide all black circles
            this.spacecraft.forEach(craft => craft.hideBlackCircles());
            this.animationState = 1;
            this.stateChangeTime = currentTime;

        } else if (this.animationState === 1 && hoverDuration >= this.UPPER_MOVE_DELAY) {
            // 2 seconds: Move the upper two spacecraft up by 30 pixels
            this.spacecraft[0].moveUp(this.spacecraft[0].y - this.VERTICAL_MOVE_DISTANCE);
            this.spacecraft[1].moveUp(this.spacecraft[1].y - this.VERTICAL_MOVE_DISTANCE);
            this.animationState = 2;
            this.stateChangeTime = currentTime;

        } else if (this.animationState === 2 && hoverDuration >= this.LOWER_MOVE_DELAY) {
            // 3 seconds: Move the lower two spacecraft up by 30 pixels
            this.spacecraft[2].moveUp(this.spacecraft[2].y - this.VERTICAL_MOVE_DISTANCE);
            this.spacecraft[3].moveUp(this.spacecraft[3].y - this.VERTICAL_MOVE_DISTANCE);
            this.animationState = 3;
            this.stateChangeTime = currentTime;

        } else if (this.animationState === 3 && hoverDuration >= this.CENTER_MOVE_DELAY) {
            // 4 seconds: All spacecraft move to center and shrink
            for (let craft of this.spacecraft) {
                craft.moveToCenter(this.CENTER_X, this.CENTER_Y, this.FINAL_SIZE, this.CENTER_INITIAL_SPEED);
            }
            this.animationState = 4;
            this.stateChangeTime = currentTime;
        }

        // Check if all spacecraft have vanished (only in state 4)
        if (this.animationState === 4 && !this.allVanished) {
            this.allVanished = this.spacecraft.every(craft => craft.vanished);
            if (this.allVanished) {
                this.animationState = 5; // Final state - all vanished
            }
        }
    }
}

// New Spacecraft class for hangar animation
class HangarSpacecraft {
    constructor(image, x, y, width, height, blackCircleImage, blackCircleLeftX, blackCircleLeftY, blackCircleLeftWidth, blackCircleLeftHeight, blackCircleRightX, blackCircleRightY, blackCircleRightWidth, blackCircleRightHeight) {
        this.image = image;
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.originalWidth = width;
        this.originalHeight = height;
        this.isUpper = (y < 500); // Whether this is an upper spacecraft
        this.blackCircleImage = blackCircleImage;
        this.blackCircleLeftX = blackCircleLeftX;
        this.blackCircleLeftY = blackCircleLeftY;
        this.blackCircleLeftWidth = blackCircleLeftWidth;
        this.blackCircleLeftHeight = blackCircleLeftHeight;
        this.blackCircleRightX = blackCircleRightX;
        this.blackCircleRightY = blackCircleRightY;
        this.blackCircleRightWidth = blackCircleRightWidth;
        this.blackCircleRightHeight = blackCircleRightHeight;

        // Animation states
        this.showBlackCircles = true;
        this.targetY = y; // Target position for vertical movement
        this.movingUp = false;

        // Add center movement properties
        this.movingToCenter = false;
        this.targetCenterX = 0;
        this.targetCenterY = 0;
        this.finalSize = 45;
        this.centerSpeed = 0.0001;
        this.vanished = false;

        // Add acceleration parameters
        this.upwardAcceleration = 0.0001; // Start slow and accelerate
        this.upwardSpeed = 0.0005;       // Initial upward movement speed
        this.maxUpwardSpeed = 0.2;      // Maximum upward movement speed

        this.centerAcceleration = 0.0007; // Increase center movement acceleration for more dramatic effect
        this.centerInitialSpeed = 0.00001;  // Start MUCH slower for center movement (was 0.02)
        this.centerMaxSpeed = 0.15;      // Higher maximum center movement speed (was 0.08)
    }

    // Reset spacecraft to original position
    reset() {
        this.x = this.originalX;
        this.y = this.originalY;
        this.width = this.originalWidth;
        this.height = this.originalHeight;
        this.showBlackCircles = true;
        this.targetY = this.originalY;
        this.movingUp = false;
        this.movingToCenter = false;
        this.targetCenterX = 0;
        this.targetCenterY = 0;
        // this.vanished = false;
        this.upwardSpeed = 0.05;  // Reset speed values
        this.centerSpeed = 0.02;  // Reset center movement speed
    }

    // Move spacecraft upward by specified amount
    moveUp(targetY, speed) {
        this.targetY = targetY;
        this.movingUp = true;
        this.upwardSpeed = 0.05; // Start with initial speed
    }

    // Move spacecraft toward center and shrink
    moveToCenter(centerX, centerY, finalSize, initialSpeed) {
        this.targetCenterX = centerX;
        this.targetCenterY = centerY;
        this.finalSize = finalSize;
        this.centerSpeed = this.centerInitialSpeed; // Use very slow initial speed
        this.movingToCenter = true;
        this.movingUp = false; // Stop vertical movement
    }

    // Update spacecraft position animation with acceleration
    update() {
        // If moving up, animate toward target Y position with acceleration
        if (this.movingUp && Math.abs(this.y - this.targetY) > 0.5) {
            // Apply acceleration but limit to maximum speed
            this.upwardSpeed = min(this.upwardSpeed + this.upwardAcceleration, this.maxUpwardSpeed);

            // Move with current speed
            this.y = lerp(this.y, this.targetY, this.upwardSpeed);
            return false; // Still moving
        } else if (this.movingUp) {
            this.y = this.targetY;
            this.movingUp = false;
            // Reset speed for next time
            this.upwardSpeed = 0.05;
            return true; // Movement complete
        }

        // Handle center movement if active
        if (this.movingToCenter && !this.vanished) {
            // Calculate center points for interpolation
            const currentCenterX = this.x + this.width / 2;
            const currentCenterY = this.y + this.height / 2;

            // Apply acceleration to center movement speed
            const currentDistance = dist(currentCenterX, currentCenterY, this.targetCenterX, this.targetCenterY);
            const distanceProgress = map(
                currentDistance,
                0,
                dist(this.originalX + this.originalWidth / 2, this.originalY + this.originalHeight / 2, this.targetCenterX, this.targetCenterY),
                1, 0
            );

            // More acceleration as they get closer to the center
            const dynamicAcceleration = this.centerAcceleration * (1 + distanceProgress * 2);
            this.centerSpeed = min(this.centerSpeed + dynamicAcceleration, this.centerMaxSpeed);

            // Move toward target center with accelerating speed
            const newCenterX = lerp(currentCenterX, this.targetCenterX, this.centerSpeed);
            const newCenterY = lerp(currentCenterY, this.targetCenterY, this.centerSpeed);

            // Shrink based on distance to target
            const sizeFactor = 1 - pow(distanceProgress, 1.5);
            this.width = max(this.finalSize, this.originalWidth * sizeFactor);
            this.height = max(this.finalSize, this.originalHeight * sizeFactor);

            // Recalculate top-left corner from center position
            this.x = newCenterX - this.width / 2;
            this.y = newCenterY - this.height / 2;

            // Check if spacecraft has reached minimum size
            if (this.width <= this.finalSize + 10) {
                this.vanished = true;
                return true; // Movement and shrinking complete
            }

            return false; // Still moving/shrinking
        }

        return false; // No movement happening
    }

    // Hide black circles
    hideBlackCircles() {
        this.showBlackCircles = false;
    }

    // Draw spacecraft at current position/size
    draw(panelX, panelY) {
        // Don't draw if vanished
        if (this.vanished) return;

        // Draw spacecraft
        image(this.image, panelX + this.x, panelY + this.y, this.width, this.height);

        // Draw black circles if they should be visible
        if (this.showBlackCircles) {
            image(this.blackCircleImage, panelX + this.blackCircleLeftX, panelY + this.blackCircleLeftY,
                this.blackCircleLeftWidth, this.blackCircleLeftHeight);
            image(this.blackCircleImage, panelX + this.blackCircleRightX, panelY + this.blackCircleRightY,
                this.blackCircleRightWidth, this.blackCircleRightHeight);
        }
    }
}

// Game Spacecraft class for button animation spacecraft
class GameSpacecraft {
    constructor(x, y, size, imageIndex, image) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = size;
        this.originalSize = size;
        this.imageIndex = imageIndex;
        this.image = image;
        this.progress = 0;
        this.delay = 0;
    }

    // Update the spacecraft position and size based on animation progress
    update(targetX, targetY, globalProgress) {
        // Calculate individual progress with delay
        const adjustedProgress = constrain((globalProgress - this.delay) * (1 / (1 - this.delay)), 0, 1);
        this.progress = adjustedProgress;

        if (adjustedProgress <= 0) return false; // Not visible yet

        return true; // Visible and updated
    }

    // Draw the spacecraft at its current position and size
    draw(targetStar) {
        if (this.progress <= 0) return; // Not visible yet

        // Calculate current position and size based on progress
        const currentX = lerp(this.originalX, targetStar.x, this.progress);
        const currentY = lerp(this.originalY, targetStar.y, this.progress);
        const currentSize = lerp(this.originalSize, 1, this.progress); // Shrink to 1px

        // Apply colored glow effect
        const hue = (this.imageIndex * 15) % 360;
        drawingContext.shadowBlur = map(currentSize, 1, this.originalSize, 3, 10);
        drawingContext.shadowColor = `hsla(${hue}, 100%, 60%, 0.7)`;

        // Draw the spacecraft
        image(this.image, currentX - currentSize / 2, currentY - currentSize / 2,
            currentSize, currentSize);

        drawingContext.shadowBlur = 0;
    }
}
// New class to manage game images (both small circle and enlarged view)
class GameImageManager {
    constructor() {
        this.hoveredImageIndex = -1;
        this.enlargedImageFade = 0; // Value from 0 to 1 for fade opacity
        this.previousHoveredIndex = -1;
        this.image10HoverStartTime = 0; // Initialize image10HoverStartTime
        this.animationPosX = 0; // Initialize animationPosX
        this.animationPosY = 0; // Initialize animationPosY
        this.animationIsPaused = false;
        this.animationInCycleMode = false; 
        this.pauseStartTime = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.spiderScaleFactor = 0.2;
        this.showBlackCirclesForImage10 = false;
        this.blackCirclesVisible = Array(8).fill(true);
        this.blackCirclesRemovalTimes = Array(4).fill(0);
        // Add missing variables that were previously global
        this.darknessFactor = 0;
        this.image10FullBrightTime = 0;
        this.jellyfishPermanentlyDisabled = false;
    }

    // Add global game states for backward compatibility
    updateGlobalVars() {
        // Update global hoveredImageIndex for backward compatibility
        hoveredImageIndex = this.hoveredImageIndex;
        enlargedImageFade = this.enlargedImageFade;
    }

    drawGameImages() { 
        const centerX = IMAGE_RING_X + 100 + CIRCLE_RADIUS;
        const centerY = IMAGE_RING_Y + 100 + CIRCLE_RADIUS;

        this.hoveredImageIndex = -1; // Reset hover state
        backgroundManager.resetStarHoverStates(); 

        for (let i = 0; i < gameImages.length; i++) {
            const angle = i * (TWO_PI / Math.max(4, gameImages.length));
            const x = centerX + CIRCLE_RADIUS * cos(angle) - IMAGE_SIZE / 2;
            const y = centerY + CIRCLE_RADIUS * sin(angle) - IMAGE_SIZE / 2; 

            // Check if mouse is hovering over this image and all images are loaded
            if (allImagesLoadedSuccessfully && mouseX > x && mouseX < x + IMAGE_SIZE &&
                mouseY > y && mouseY < y + IMAGE_SIZE) {

                this.hoveredImageIndex = i;

                // Activate corresponding star hover state
                if (i < backgroundManager.getDecorativeStars().length) {
                    backgroundManager.getDecorativeStars()[i].setButtonHovered(true);
                }

                // Enhanced glow for hovered image
                drawingContext.shadowBlur = 30;
                drawingContext.shadowColor = 'rgba(100, 200, 255, 0.8)';
            } else {
                // Regular glow
                drawingContext.shadowBlur = 20;
                drawingContext.shadowColor = 'rgba(50, 100, 255, 0.5)';
            }

            image(gameImagesSmall[i], x, y, IMAGE_SIZE, IMAGE_SIZE);
            drawingContext.shadowBlur = 0;
        }

        // If the hovered image has changed, reset animations
        if (this.previousHoveredIndex !== this.hoveredImageIndex) {
            this.previousHoveredIndex = this.hoveredImageIndex;
            if (this.hoveredImageIndex >= 0) {
                this.resetAnimationPosition();
            }
        }

        // Update global variables
        // this.updateGlobalVars();
    }

    resetAnimationPosition() {
        // Reset image-specific animations - use the instances, not the class names
        imageIndex10Manager.reset();
        imageIndex11Manager.reset();
        imageIndex13Manager.reset();
        imageIndex16Manager.reset();

        // Reset for backward compatibility
        this.animationPosX = 0; // Reset animationPosX
        this.animationPosY = 0; // Reset animationPosY
        this.animationIsPaused = false;
        this.animationInCycleMode = false;
        this.pauseStartTime = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.spiderScaleFactor = 0.2;

        // Reset darkness variables
        this.darknessFactor = 0; // Use instance variable
        this.image10HoverStartTime = 0; // Reset hover timing
        this.image10FullBrightTime = 0; // Use instance variable
        this.showBlackCirclesForImage10 = false;
        this.blackCirclesVisible = Array(8).fill(true);
        this.blackCirclesRemovalTimes = Array(4).fill(0);

        this.jellyfishPermanentlyDisabled = false;
    }

    drawEnlargedImage() {
        if (imagesStillLoading) return

        // Handle fade animation
        if (this.hoveredImageIndex < 0 || this.hoveredImageIndex >= gameImages.length) {
            this.enlargedImageFade = max(0, this.enlargedImageFade - 0.08); // Fade out
            this.darknessFactor = 0; // Reset darkness when not hovering any image - use this.
            this.image10HoverStartTime = 0; // Reset hover timing
            if (this.enlargedImageFade <= 0) return; // Nothing to draw
        } else {
            // If we're hovering over a new image, reset animation position
            if (this.hoveredImageIndex !== 10) {
                this.darknessFactor = 0; // Use this.
            }
            this.enlargedImageFade = min(1, this.enlargedImageFade + 0.1); // Fade in
        }

        if (this.enlargedImageFade > 0) {
            const circleRightEdge = IMAGE_RING_X + 100 + CIRCLE_RADIUS * 2 + 150;
            const enlargedSize = 800;
            const x = circleRightEdge;
            const y = height / 2 - enlargedSize / 2 - 100;

            const fadeAlpha = 255 * this.enlargedImageFade;

            // Apply glow effect
            drawingContext.shadowBlur = 40 * this.enlargedImageFade;
            drawingContext.shadowColor = `rgba(100, 200, 255, ${0.7 * this.enlargedImageFade})`;

            // Determine which image to display
            const imageIndex = this.hoveredImageIndex >= 0 ?
                this.hoveredImageIndex : constrain(this.previousHoveredIndex, 0, gameImages.length - 1);

            // Draw background panel - use black for image 10, standard color for others
            if (imageIndex === 10) {
                // Black background for image 10
                fill(0, 0, 0, 230 * this.enlargedImageFade); // Pure black with opacity
            } else {
                // Standard background color for other images
                fill(20, 40, 80, 200 * this.enlargedImageFade);
            }

            rectMode(CORNER);
            rect(x - 20, y - 20, enlargedSize + 40, enlargedSize + 40, 15);

            // Handle special case animations based on imageIndex
            if (imageIndex === 10) {
                drawingContext.shadowBlur = 0;
                // Use imageIndex10Manager instance, not the class
                imageIndex10Manager.updateAndDraw(x, y, enlargedSize, fadeAlpha);
            } else {
                // For all other indexes, just draw the regular image with applied tint
                tint(255, 255, 255, fadeAlpha);
                image(gameImages[imageIndex], x, y, enlargedSize, enlargedSize);
            }

            drawingContext.shadowBlur = 0;

            // Special case for index 11: add animation overlay on top of the enlarged image
            if (imageIndex === 8) {
                // Use imageIndex13Manager instance, not the class
                imageIndex8Manager.updateAndDraw(x, y, enlargedSize);
            }
            if (imageIndex === 11) {
                // Use imageIndex11Manager instance, not the class
                imageIndex11Manager.updateAndDraw(x, y, enlargedSize);
            }
            // Special case for index 13: add the jellyfish animation
            else if (imageIndex === 13) {
                // Use imageIndex13Manager instance, not the class
                this.jellyfishPermanentlyDisabled = imageIndex13Manager.updateAndDraw(x, y);
            }
            else if (imageIndex === 16) {
                // Use imageIndex11Manager instance, not the class
                imageIndex16Manager.updateAndDraw(x, y, enlargedSize);
            }
            else {
                // Deactivate jellyfishes when hovering other images - use instance
                imageIndex13Manager.deactivateAll();
            }

            noTint();

            // Draw image name caption
            fill(255, fadeAlpha);
            textSize(24);
            const imageName = this.extractImageName(imageIndex);
            text(imageName, x + enlargedSize / 2, y + enlargedSize + 30);

            drawingContext.shadowBlur = 0;
        }
    }

    extractImageName(index) {
        const path = gameImages[index].src || "";
        const filename = path.split('/').pop();
        const name = filename.split('.')[0];

        // Format name (add spaces between camelCase and before numbers)
        return name.replace(/([A-Z])/g, ' $1')
            .replace(/([0-9])/g, ' $1')
            .trim()
            .charAt(0).toUpperCase() + name.slice(1);
    }

    checkImageClicks() {
        const centerX = IMAGE_RING_X + 100 + CIRCLE_RADIUS;
        const centerY = IMAGE_RING_Y + 100 + CIRCLE_RADIUS;

        for (let i = 0; i < gameImages.length; i++) {
            const angle = i * (TWO_PI / Math.max(4, gameImages.length));
            const x = centerX + CIRCLE_RADIUS * cos(angle) - IMAGE_SIZE / 2;
            const y = centerY + CIRCLE_RADIUS * sin(angle) - IMAGE_SIZE / 2;

            // Check if mouse is over this image and all images are loaded
            if (mouseX > x && mouseX < x + IMAGE_SIZE &&
                mouseY > y && mouseY < y + IMAGE_SIZE) {

                // Trigger supernova for corresponding star
                if (i < backgroundManager.getDecorativeStars().length) {
                    backgroundManager.triggerSupernova(i);
                }
                break;
            }
        }
    }
}  