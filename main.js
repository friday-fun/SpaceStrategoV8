/** 
 * Space Stratego Game
 * A multiplayer strategy game built with p5.js and p5.party
 * By AI specialist Jens Valdez ;O)
 */

//===================================================
// CONSTANTS AND GLOBAL VARIABLES
//===================================================
const room = new URLSearchParams(location.search).get("room");

// Party System Global Variables jens3    
let shared;
let me;
let guests;

let spacecrafts = [];
let activeCharacters = [];
let gameObjects = [];

let initialGameState = "GAME-SETUP";
//let initialGameState = "TEST-GAME-AREA"; 
let showGameArea = true;

/* For the start screen */
let backgroundManager;
let gameImageManager;
let imageIndex8Manager;
let imageIndex10Manager;
let imageIndex11Manager;
let imageIndex13Manager;
let imageIndex16Manager;

// Start screen constants
const IMAGE_RING_X = 300;
const IMAGE_RING_Y = 0;
const CIRCLE_RADIUS = 400;
const IMAGE_SIZE = 120;
const ANIMATION_FRAMES = 180; // 3 seconds at 60fps.
const SUPERNOVA_MAX_SIZE = 10001;
const SUPERNOVA_THRESHOLD = 0.7;

// Game layout constants
const SCREEN_WIDTH = 2400;
const SCREEN_HEIGHT = 1200;
const GAME_AREA_X = 300;
const GAME_AREA_Y = 50;
const GAME_AREA_WIDTH = 1200;
const GAME_AREA_HEIGHT = 700;
const GAME_AREA_WIDTH_NEW = 2000;
const GAME_AREA_HEIGHT_NEW = 1100;
const GAME_AREA_RIGHT = GAME_AREA_X + GAME_AREA_WIDTH;
const GAME_AREA_BOTTOM = GAME_AREA_Y + GAME_AREA_HEIGHT;
const GAME_AREA_RIGHT_NEW = GAME_AREA_X + GAME_AREA_WIDTH_NEW;
const GAME_AREA_BOTTOM_NEW = GAME_AREA_Y + GAME_AREA_HEIGHT_NEW;

// Gameplay Constants  
const TOTAL_NUMBER_OF_PLAYERS = 30
const SPACECRAFT_SIZE = 110;
const SPACECRAFT_SPEED = 5;
const MAX_PLAYERS_PER_TEAM = 15;
const GAME_TRANSITION_TIME = 6000;
const WARP_COOLDOWN_TIME = 4000;
const BULLET_SPEED = 7;
const BULLET_DIAMETER = 10;
const NUMBER_OF_BULLETS = 1;
const TOWER_SHOOTING_INTERVAL = 2000;
const MAX_LIVES = 6;

// Startscreen images
let warpgateAImages = [];
let warpgateBImages = [];
let backgroundImage = null;
let blackCircleImg = null;
let upperLeftImg = null;
let upperRightImg = null;
let lowerLeftImg = null;
let lowerRightImg = null;
let warpgateImages11 = [];
let lightTowerImages = [];
let jellyfishImages = [];
let warpgateImages16 = [];
let warpgateBImages16 = [];
let waterImages = [];

// Game images
let spacecraftBlueImages = [];
let spacecraftGreenImages = [];
let spacecraftPurpleImages = [];
let canonImages = [];
let minimapImg = [];
let fixedMinimapImage = [];
let planetBackgroundImages = [];
let warpGateUpImages = [];
let warpGateDownImages = [];
let gameImagesSmall = [];
let gameImages = [];

// How to Play Images
let WASDkeyImage = null;
let navigationImage = null;
let hoverToSeeDetailsImage = null;
let planetOverview = null;

// We do not use the spider for now, but we keep the code for future use
// Spider
//let framesLeft = []; // Array to hold left-facing animation frames
//let framesRight = []; // Array to hold right-facing animation frames

// UI Variables
let nameInput;
let chooseTeamBlueButton;
let chooseTeamGreenButton;
let message = "";

// Game Controle Variables
let fixedMinimap
let selectedPlanet
let solarSystem
let planetIndexBlue = 1
let planetIndexGreen = 3
let canonTowersGenerated = false;
let isWarpingUp = false;
let hasWarped = false;
let supernovaStarIndex = -1;
let firstRun = true;
let firstRunAfterImagesLoaded = true;
let howToPlayButtonRect;
let winText = "";
let backgroundColor = [10, 20, 30];

// Image loading state variables
let imagesStillLoading = true;
let imagesLoadedCount = 0;
let totalImagesToLoadForPrepareImages = 0;
let allImagesLoadedSuccessfully = true;

// to test performance
let showGraphics = true
let showHowToNavigate = true
let showStarSystem = false
let showBlurAndTintEffects = true
let showColorBlindText = false

// Add a centralized planet color palette
const planetColors = {
    0: { // Blue planet
        center: [20, 50, 160],
        name: "Rocky",
        planetSizeFactor: 1.0
    },
    1: { // Green planet
        center: [20, 120, 40],
        name: "Organic",
        planetSizeFactor: 1.0
    },
    2: { // Red planet
        center: [120, 20, 20],
        name: "Budda",
        planetSizeFactor: 0.5
    },
    3: { // Yellow planet
        center: [120, 120, 20],
        name: "Ice cube",
        planetSizeFactor: 1.0
    },
    4: { // Purple planet
        center: [80, 20, 120],
        name: "Insect swarm",
        planetSizeFactor: 1.0
    }
};


// Character Definitions 
const CHARACTER_DEFINITIONS = [
    { rank: -1, name: "Core Commander", id: "C", imageId: 0, count: 1, color: 'purple', isCoreCommand: true, canShoot: true },
    { rank: 10, name: "Star Commander", id: "10", imageId: 1, count: 1, color: 'cyan', isStarCommand: true, canShoot: true },
    { rank: 9, name: "Fleet Admiral", id: "9", imageId: 2, count: 1, color: 'magenta', canShoot: true, canRapidFire: true },
    { rank: 8, name: "Ship Captain", id: "8", imageId: 3, count: 2, color: 'lime' },
    { rank: 7, name: "Squadron Leader", id: "7", imageId: 4, count: 3, color: 'teal', canShoot: true },
    { rank: 6, name: "Lt. Commander", id: "6", imageId: 5, count: 4, color: 'lavender' },
    { rank: 5, name: "Chief P. Officer", id: "5", imageId: 6, count: 4, color: 'maroon' },
    { rank: 4, name: "Night Sniper", id: "4", imageId: 7, count: 4, color: 'olive', canShoot: true, canSnipe: true, canCloake: true },
    { rank: 3, name: "Engineer", id: "3", imageId: 8, count: 5, color: 'yellow', isEngineer: true },
    { rank: 2, name: "Power Glider", id: "2", imageId: 9, count: 8, color: 'purple', canMoveFast: true },
    { rank: 1, name: "Stealth Squad", id: "S", imageId: 10, count: 1, color: 'orange', isStealthSquad: true, canCloake: true },
    { rank: 0, name: "Recon Drone", id: "D", imageId: 11, count: 6, color: 'brown', isReconDrone: true },
];

/**
 * Looks up the imageId for a given character ID in the CHARACTER_DEFINITIONS array
 * @param {string} characterId - The ID of the character to lookup 
 * @returns {number|null} - The imageId if found, null otherwise
 */
function getImageId(characterId) {
    const definition = CHARACTER_DEFINITIONS.find(def => def.id === characterId);
    if (definition) {
        return definition.imageId;
    }
    // Return default value if character ID not found
    console.warn(`No image ID found for character ID: ${characterId}`);
    return 0; // Default to first image as fallback
}

// Callback for successful image load
function imageLoadedCallback() {
    imagesLoadedCount++;
    if (imagesLoadedCount >= totalImagesToLoadForPrepareImages) {
        imagesStillLoading = false;
        if (allImagesLoadedSuccessfully) {
            console.log("All images from prepareImages loaded successfully.");
        } else {
            console.log("Finished loading images from prepareImages, but some failed.");
        }
    }
}

// Callback for failed image load
function imageLoadErrorCallback(errorData) {
    imagesLoadedCount++;
    allImagesLoadedSuccessfully = false;
    console.error(`Error loading image: ${errorData.path}`, errorData.event);
    if (imagesLoadedCount >= totalImagesToLoadForPrepareImages) {
        imagesStillLoading = false;
        console.log("Finished loading images from prepareImages, but some failed.");
    }
}

//=================================================== 
// SETUP AND INITIALIZATION
//===================================================
function prepareImages() {
    imagesStillLoading = true;
    imagesLoadedCount = 0;
    totalImagesToLoadForPrepareImages = 0;
    allImagesLoadedSuccessfully = true;

    const wrappedErrorCb = (path, event) => imageLoadErrorCallback({ path, event });

    // For the start screen

    // Load warpgate images
    for (let i = 1; i <= 10; i++) {
        const frameName = `p0warpgateA${i}`;
        const path = `images/startpage/p0warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateImages16.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load water images
    for (let i = 1; i <= 6; i++) {
        const frameName = `p0water${i}`;
        const path = `images/startpage/p0water/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        waterImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex8Manager
    for (let i = 1; i <= 6; i++) {
        const frameName = `p3warpgateA${i}`;
        const path = `images/startpage/p3warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateAImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load warpgate B images
    for (let i = 1; i <= 13; i++) {
        const frameName = `p3warpgateB${i}`;
        const path = `images/startpage/p3warpgateB/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateBImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex10Manager
    let path = "images/startpage/hangerTeamBlueEffect/hangerTeamBlueEmpty1.png";
    totalImagesToLoadForPrepareImages++;
    backgroundImage = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    // Load spacecraft images
    path = "images/startpage/hangerTeamBlueEffect/blackCircleDownLeft1.png";
    totalImagesToLoadForPrepareImages++;
    blackCircleImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftUpperLeft.png";
    totalImagesToLoadForPrepareImages++;
    upperLeftImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftUpperRight.png";
    totalImagesToLoadForPrepareImages++;
    upperRightImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftLowerLeft.png";
    totalImagesToLoadForPrepareImages++;
    lowerLeftImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftLowerRight.png";
    totalImagesToLoadForPrepareImages++;
    lowerRightImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    /* Keep for now, but not used
    // ImageIndex11Manager 
    // Load left-facing frames
    for (let i = 1; i <= 24; i++) {
        const frameName = `p4spejderL${i}`;
        const path = `images/startpage/p4spider/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        framesLeft.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load right-facing frames
    for (let i = 1; i <= 24; i++) {
        const frameName = `p4spejderR${i}`;
        const path = `images/startpage/p4spider/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        framesRight.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }
*/
    // Planet 4
    // Load warpgate images
    for (let i = 1; i <= 13; i++) {
        const frameName = `p4warpgateA${i}`;
        const path = `images/startpage/p4warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateImages11.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load lightTower images
    for (let i = 1; i <= 11; i++) {
        const frameName = `p4lightTower${i}`;
        const path = `images/startpage/p4lightTower/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        lightTowerImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex13Manager
    // Load jellyfish images
    const jellyfishPaths = [
        "images/startpage/p4p3jellyfish/p4p3jellyfishLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerMiddle.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerRight.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishUpperLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishUpperRight.png"
    ];
    jellyfishPaths.forEach(p => {
        totalImagesToLoadForPrepareImages++;
        jellyfishImages.push(loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e)));
    });

    // GameImageManager
    const imagePaths = [
        "images/startpage/background/hangerTeamGreen.png", "images/startpage/background/planet1p1.png", "images/startpage/background/planet1p2.png",
        "images/startpage/background/planet1p3.png", "images/startpage/background/planet2p1.png", "images/startpage/background/planet2p2.png",
        "images/startpage/background/planet3p1.png", "images/startpage/background/planet3p2.png", "images/startpage/background/planet3p3.png",
        "images/startpage/background/planet3p4.png", "images/startpage/background/hangerTeamBlue.png", "images/startpage/background/planet4p1.png",
        "images/startpage/background/planet4p2.png", "images/startpage/background/planet4p3cleaned.png", "images/startpage/background/planet4p4.png",
        "images/startpage/background/logo.png", "images/startpage/background/planet0p1.png", "images/startpage/background/planet0p2.png",
        "images/startpage/background/planet0p3.png", "images/startpage/background/planet0p4.png"
    ];
    imagePaths.forEach(p => {
        totalImagesToLoadForPrepareImages++;
        gameImages.push(loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e)));
    });

    // Game images

    // Load warp gate up images
    for (let indexPlanet = 0; indexPlanet <= 4; indexPlanet++) {

        let numberOfWarpGateUpImagesForTheDifferentPlanets = [8, 14, 14, 14, 14];

        warpGateUpImages[indexPlanet] = []; // Initialize the sub-array for the current planet

        for (let indexWarpGate = 0; indexWarpGate < numberOfWarpGateUpImagesForTheDifferentPlanets[indexPlanet]; indexWarpGate++) {
            const path = `images/planet${indexPlanet}/p${indexPlanet}warpGateUp/p${indexPlanet}wUp${indexWarpGate}.png`;
            totalImagesToLoadForPrepareImages++;
            warpGateUpImages[indexPlanet].push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
        }
    }

    // Load warp gate down images
    for (let indexPlanet = 0; indexPlanet <= 4; indexPlanet++) {

        let numberOfWarpGateDownImagesForTheDifferentPlanets = [11, 14, 13, 7, 14];

        warpGateDownImages[indexPlanet] = []; // Initialize the sub-array for the current planet

        for (let indexWarpGate = 0; indexWarpGate < numberOfWarpGateDownImagesForTheDifferentPlanets[indexPlanet]; indexWarpGate++) {
            const path = `images/planet${indexPlanet}/p${indexPlanet}warpGateDown/p${indexPlanet}wDown${indexWarpGate}.png`; // Note: Path seems to be same as Up, might be a typo in original code.
            totalImagesToLoadForPrepareImages++;
            warpGateDownImages[indexPlanet].push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
        }
    }

    // spacecrafts
    path = `images/spacecraft/spacecraftPurple7Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedPurpleSpacecraft7Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftPurple10Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedPurpleSpacecraft10Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftGreen7Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedGreenSpacecraft7Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftGreen10Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedGreenSpacecraft10Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    for (let i = 0; i < 12; i++) {
        const path = `images/spacecraft/spacecraftGreen${i}.png`;
        totalImagesToLoadForPrepareImages++;
        spacecraftGreenImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }
    for (let i = 0; i < 12; i++) {
        const path = `images/spacecraft/spacecraftPurple${i}.png`;
        totalImagesToLoadForPrepareImages++;
        spacecraftPurpleImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }

    // Canon towers
    for (let i = 0; i < 3; i++) {
        const path = `images/spacecraft/canon${i}.png`;
        totalImagesToLoadForPrepareImages++;
        canonImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }

    // Single basic minimap  
    const fixedMinimapPaths = [
        "images/planet0/p0minimap.png",
        "images/planet1/p1minimap.png",
        "images/planet2/p2minimap.png",
        "images/planet3/p3minimap.png",
        "images/planet4/p4minimap.png"
    ];
    fixedMinimapPaths.forEach((p, i) => {
        totalImagesToLoadForPrepareImages++;
        fixedMinimapImage[i] = loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e));
    });

    // Game background images   
    const planetBackgroundPaths = [
        "images/planet0/p0.png",
        "images/planet1/p1.png", 
        "images/planet2/p2.png",
        "images/planet3/p3.png",
        "images/planet4/p4.png"
    ];
    planetBackgroundPaths.forEach((p, i) => {
        totalImagesToLoadForPrepareImages++;
        planetBackgroundImages[i] = loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e));
    });

    if (totalImagesToLoadForPrepareImages === 0) {
        imagesStillLoading = false; // No images to load, so stop loading state
        console.log("No images were queued for loading in prepareImages.");
    }
}

function preload() {
    partyConnect(
        "wss://p5js-spaceman-server-29f6636dfb6c.herokuapp.com",
        "jkv-spaceStrategoV8",   
        room
    );

    shared = partyLoadShared("shared", {
        gameState: initialGameState,
        winningTeam: null,
        resetFlag: false,
        coreCommandDisconnected: false,
        characterList: [],
        blueWins: 0,
        greenWins: 0,
        draws: 0,
        resetTimerStartTime: null,
        resetTimerSeconds: null,
        gameStartTimerStartTime: null,
        gameStartTimerSeconds: null,
        currentTime: null,
        gameObjects: [],
        canonTowerHits: Array(15).fill(0),
    });

    me = partyLoadMyShared({
        playerName: "observer",
        lastWarpTime: 0 // Track when player last used a warp gate
    });

    guests = partyLoadGuestShareds();

    // GameImageManager - Only load small preview images during preload
    const imagePathsSmallImages = [
        "images/startpage/smallImages/hangerTeamGreenSmall.png", "images/startpage/smallImages/planet1p1Small.png", "images/startpage/smallImages/planet1p2Small.png",
        "images/startpage/smallImages/planet1p3Small.png", "images/startpage/smallImages/planet2p1Small.png", "images/startpage/smallImages/planet2p2Small.png",
        "images/startpage/smallImages/planet3p1Small.png", "images/startpage/smallImages/planet3p2Small.png", "images/startpage/smallImages/planet3p3Small.png",
        "images/startpage/smallImages/planet3p4Small.png", "images/startpage/smallImages/hangerTeamBlueSmall.png", "images/startpage/smallImages/planet4p1Small.png",
        "images/startpage/smallImages/planet4p2Small.png", "images/startpage/smallImages/planet4p3SmallCleaned.png", "images/startpage/smallImages/planet4p4Small.png",
        "images/startpage/smallImages/logoSmall.png", "images/startpage/smallImages/planet0p1Small.png", "images/startpage/smallImages/planet0p2Small.png",
        "images/startpage/smallImages/planet0p3Small.png", "images/startpage/smallImages/planet0p4Small.png"
    ];

    imagePathsSmallImages.forEach(path => gameImagesSmall.push(loadImage(path)));

    for (let i = 0; i < 12; i++) {
        spacecraftBlueImages[i] = loadImage(`images/spacecraft/spacecraftBlue${i}.png`);
    }

    WASDkeyImage = loadImage(`images/howtoPlay/WASDkeys.png`);
    navigationImage = loadImage(`images/howtoPlay/navigation.png`);
    hoverToSeeDetailsImage = loadImage(`images/howtoPlay/hoverToSeeDetails.png`);
    planetOverview = loadImage(`images/howtoPlay/planetOverview.png`);

    backgroundManager = new BackgroundManager();
    imageIndex8Manager = new ImageIndex8Manager();
    imageIndex10Manager = new ImageIndex10Manager();
    imageIndex11Manager = new ImageIndex11Manager();
    imageIndex13Manager = new ImageIndex13Manager();
    imageIndex16Manager = new ImageIndex16Manager();
    gameImageManager = new GameImageManager();
}

function setup() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    frameRate(60);
    noStroke();

    prepareImages(); // Call prepareImages here to start loading images asynchronously

    if (initialGameState === "TEST-GAME-AREA") {
        createSpacecrafts2();
    } else {
        createSpacecrafts2()
    }
    if (me.playerName === "observer") {
        joinGame();
        return;
    }

    console.log("My ID (will populate):", me.playerNumber);
}

//=================================================== 
// MAIN DRAW FUNCTION
//===================================================

function draw() {
    background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);

    if (shared.gameState === "TEST-GAME-AREA") {

        if (firstRun) {

            me.characterId = "C";
            me.characterInstanceId = "blue_C_0";
            me.characterName = "Core Commander";
            me.characterRank = -1
            me.diameter = 60
            me.hasCharacter = true;
            me.isReady = true;
            me.lastProcessedResetFlag = false;
            me.playerColor = 'purple';
            me.playerDisplayName = "Player123"
            me.playerName = "player0";
            me.size = 60
            me.status = "available";
            me.team = "blue";
            me.xGlobal = 0
            me.xLocal = 200
            me.yGlobal = 0
            me.yLocal = 500
            me.planetIndex = 0;

            backgroundManager.initialize();
            initializeCharacterList();
            fixedMinimap = new BasicMinimap(x = 180, y = 800, diameter = 350, color = 'grey', diameterPlanet = 2000);
            solarSystem = new SolarSystem(xSolarSystemCenter = 1250, ySolarSystemCenter = 900);
            howToPlayButtonRect = {
                x: GAME_AREA_X + GAME_AREA_WIDTH / 2 - 100,
                y: GAME_AREA_Y,
                w: 200,
                h: 40
            };

            firstRun = false;
            return;
        }
    } else {
        if (firstRun) {
            backgroundManager.initialize();
            createNameInput();
            initializeCharacterList();
            fixedMinimap = new BasicMinimap(x = GAME_AREA_X + GAME_AREA_WIDTH / 2, y = GAME_AREA_Y + GAME_AREA_BOTTOM / 2, diameter = 700, color = 'grey', diameterPlanet = 2000);
            solarSystem = new SolarSystem(xSolarSystemCenter = 1250, ySolarSystemCenter = 900);
            // Initialize the "How to Play" button's rectangle properties
            howToPlayButtonRect = {
                x: GAME_AREA_X + GAME_AREA_WIDTH / 2 - 100,
                y: GAME_AREA_Y,
                w: 200,
                h: 40
            };
            firstRun = false;
            return;
        }
    }

    if (firstRunAfterImagesLoaded) {
        imageIndex10Manager.loadImagesAndAddSpacecrafts();
        imageIndex13Manager.loadImages();
        firstRunAfterImagesLoaded = false;
    }

    // Only generate new Towers one time when a new host is assigned
    if (!canonTowersGenerated && partyIsHost()) {
        console.log("Generating canon towers for the first time");
        canonTowersGenerated = true;
        updateTowerCount();
    }

    resolvePlayerNumberConflicts()

    stepLocal()

    if (partyIsHost()) {
        me.iAmHost = true;
        handleHostDuties();
    } else {
        me.iAmHost = false;
        receiveNewDataFromHost();
    }

    updateLocalStateFromSharedList();

    if (shared.resetFlag && !me.lastProcessedResetFlag) {
        resetClientState();
        me.lastProcessedResetFlag = true;
    } else if (!shared.resetFlag && me.lastProcessedResetFlag) {
        me.lastProcessedResetFlag = false;
    }

    if (!me.isReady) {
        try {
            backgroundManager.drawBackground();
        } catch (error) {
            console.error("Error in backgroundManager.drawBackground():", error);
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text("Background rendering error - game will continue", width / 2, 50);
        }
        drawRulesSection();
        gameImageManager.drawGameImages();
        gameImageManager.drawEnlargedImage();
        drawGameSetup();
    } else {
        if (me.planetIndex === -1) return

        switch (shared.gameState) {
            case "TEST-GAME-AREA":
                selectedPlanet = solarSystem.planets[me.planetIndex];
                if (!selectedPlanet) return

                drawGameAreaBackground2();
                push();
                drawCharacterListAndInfo();
                pop()
                drawCanonTowers();
                drawSpacecrafts2();
                handlePlayerMovement2();
                handleBulletMovement();
                break;

            case "GAME-SETUP":
                if (showBlurAndTintEffects) {
                    backgroundManager.drawStars()
                }
                drawGameStats()
                drawGameFinished()
                drawHowToPlay()
                push();
                drawCharacterListAndInfo();
                pop()
                drawCharacterLegend(); 
                drawGameSetup();
                drawInteractiveHowToPlay();
                break;
            case "IN-GAME":
                displayTwoPlayersWithTheSamePlayerNumber()

                if (!me.hasCharacter) {
                    spawnNextToCoreCommand()
                }
                
                if (!selectedPlanet) return

                activeCharacters = spacecrafts.filter(c => c.hasCharacter);

                push();
                drawCharacterListAndInfo();
                pop()

                if (showGameArea) {
                    if (showBlurAndTintEffects) {
                        backgroundManager.drawStarsOutsideGameArea()
                    }
                    drawGameAreaBackground2();
                    drawCanonTowers();
                    drawSpacecrafts2();
                } else {
                    if (showBlurAndTintEffects) {
                        backgroundManager.drawStars()
                    }
                    drawCharacterLegend();
                    drawMinimap()
                    drawFixedPlanet()
                }

                handlePlayerMovement2();
                handleBulletMovement();
                checkCollisionsWithWarpGate();
                checkBulletCollisions()
                drawNavigationInstruction()

                break;
            case "GAME-FINISHED":
                selectedPlanet = solarSystem.planets[me.planetIndex];
                if (!selectedPlanet) return

                if (showBlurAndTintEffects) {
                    backgroundManager.drawStars()
                }
                drawGameStats()
                drawMinimap()
                drawCharacterListAndInfo()
                drawGameFinished();
                drawCharacterLegend();
                break;
        }
    }

    drawGameTimer();
    drawStatusMessages();
    displayHostName();
}

function drawNavigationInstruction() {

    // Draw timer with larger text
    push();
    textSize(12);
    // Change color to red if less than 1 minute remains
    fill(200);
    textAlign(LEFT, TOP);
    text(`Navigate using the keys WASD `, GAME_AREA_RIGHT - 180, 10);
    text(`Push SPACE to toggle minimap on/off `, GAME_AREA_RIGHT - 180, 30);
    pop();
}
function drawHowToPlay() {

    push();
    textAlign(LEFT, TOP); 
    textSize(16);
    fill(200);

    const textOffsetX = 5;
    const textOffsetY = 20;
    const imageX = GAME_AREA_X;
    const imageY = GAME_AREA_BOTTOM + 100;
    const imageHeight = 300;

    const spacecraftsImageDrawWidth = 1043;
    const wasdImageDrawWidth = 539;
    const tfghImageDrawWidth = 368;

    if (planetOverview) {
        image(planetOverview, 10, imageY, planetOverview.width * 0.6, planetOverview.height * 0.6);
    }
    if (hoverToSeeDetailsImage) {
        image(hoverToSeeDetailsImage, imageX + 1220, imageY - 130, hoverToSeeDetailsImage.width * 0.7, hoverToSeeDetailsImage.height * 0.7);
    }
//    if (navigationImage) {
//        image(navigationImage, imageX + planetOverview.width * 0.6 + 30, imageY + 30, tfghImageDrawWidth * 0.7, imageHeight * 0.7);
//    }
    pop();
}

function drawInteractiveHowToPlay() {
    if (!howToPlayButtonRect) return;

    push();
    // Check Hover state first to apply styles accordingly
    let isHoveringButton = mouseX > howToPlayButtonRect.x && mouseX < howToPlayButtonRect.x + howToPlayButtonRect.w &&
        mouseY > howToPlayButtonRect.y && mouseY < howToPlayButtonRect.y + howToPlayButtonRect.h;

    // Draw Button with improved styling
    if (isHoveringButton) {
        fill(130, 130, 230);
        stroke(255);
        strokeWeight(2);
    } else {
        fill(100, 100, 200);
        stroke(200);
        strokeWeight(1);
    }
    rect(howToPlayButtonRect.x, howToPlayButtonRect.y, howToPlayButtonRect.w, howToPlayButtonRect.h, 10);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text("How to Play", howToPlayButtonRect.x + howToPlayButtonRect.w / 2, howToPlayButtonRect.y + howToPlayButtonRect.h / 2);

    if (isHoveringButton) {
        drawHowToPlayInstructions()
    }
    pop();
}

function drawHowToPlayInstructions() {
    push();
    fill(230, 230, 250);
    stroke(50);
    strokeWeight(1);
    const textBoxX = GAME_AREA_X - 30;
    const textBoxY = GAME_AREA_Y + 60;
    const textBoxWidth = GAME_AREA_WIDTH - 20;
    const textBoxHeight = SCREEN_HEIGHT - 125;
    rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10);

    fill(0); 
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    const textPadding = 20;
    const textContentX = textBoxX + textPadding;
    const textContentY = textBoxY + textPadding;
    const textContentWidth = textBoxWidth - 2 * textPadding;

    const instructions = `How to play:
Two teams PURPLE and GREEN team are playing against each other. The aim of the game is to have fun and work together to eliminate the opponent teams Core Commander. This will finish a round and the winning team will get one win. The two teams must agree how long time to play for and when time’s up the squad with the most wins takes the dub.

Pro tip: Hop on a voice call with your crew before the match. Go over the rules, plan your moves, and get hyped.

⸻

🚀 Game Start:

Game kicks off when both teams lock in their Core Commander. After that, the rest of the players pick their roles. Each character’s got a name, rank, size, team color, and maybe a special power. You’ll see the details in the right of your screen.

⸻

⚔️ How Battles Work:
	•	When two characters from different teams touch = battle time.
	•	Higher rank usually wins… BUT there are some twists:
	•	Star Commander (10) loses to Stealth Squad (1)
	•	Recon Drone (D) draws with everybody except the Core Commander (C) and Engineer (3)
	•	Engineer (3) beats the Recon Drone (D)
	•	Core Commander (C) loses to everyone
	•	If two Core Commanders clash = draw
    •   Take 6 shots and you’re eliminated.

⸻

🕹 Controls: 
	•	WASD = Move around the planet
    •	The space key = Toggle minimap on/off
	•	Warp Gate = Beam you to another planet
	•	Mouse click = Shoot (Only some of the characters have this ability)
	•	P = Toggle graphics off if the game’s lagging (I = Toggle effects on/off, U = Toggle colorblind mode) 
    •	C = Toggle cloak on minimap for characters that can cloak

⸻

🪐 Maps:
	•	Use Warp Gates to jump to other planets (blue = next, purple = previous). After use they need a little cooldown.
	•	Watch out for canons on the Rocky planet — they ain’t friendly.
	•	Cloaked ships = invisible on minimap 👀
	•	The planets orbit locations are different for each player, so what you see isn’t what your team mates sees.
	•   Be aware of the climate as well. The spacecraft moves fast when the athmosphere is thin. 
	•   Also the Budda planet is huge. The ships are therefore smaller there than on the other planets.    

⸻

🌌 The two teams:
	•	GREEN team ships leave green exhaust, PURPLE team ships leave purple.
	•	On the minimap, you’ll see a little circle with a green border = GREEN ship. The middle color shows the ship’s type (see an overview to the right).

⸻

💡 Final Tips:
	•	You spawn next to your Core Commander. If you die, you respawn there. Use it for your advantage.
	•	Important: One of the clients (browsers) acts as a HOST. This browser must be an active player (the browser window must not be minimized or be an inactive browser tab). 
	•	Protect the Core Commander, communicate and help each other, use the minimap wisely, try out different strategies, and most importantly…

🔥 Have fun & good luck, Commander. 🔥`;

    text(instructions, textContentX, textContentY, textContentWidth);
    pop();
}

// Function to draw the game timer at the top of the screen
function drawGameTimer() {
    const elapsedTime = Math.max(0, shared.currentTime);

    // Convert to minutes and seconds
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Format time string with leading zeros
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Position in the center top of the screen
    const timerX = SCREEN_WIDTH - 100;
    const timerY = 30;

    // Draw timer with larger text
    push();
    textAlign(CENTER, CENTER);
    textSize(18);

    // Change color to red if less than 1 minute remains
    fill(200);

    const statsWidth = 300; // Approximate width for the stats box
    const infoX = GAME_AREA_RIGHT + 550; // Position from the right edge of the screen
    const infoY = 20;

    textAlign(LEFT, TOP);
    text(`Match Time: ${timeString}`, infoX, infoY);
    pop();
}

function receiveNewDataFromHost() {
    // Ensure client has same number of towers as host
    while (gameObjects.length < shared.gameObjects.length) {
        const i = gameObjects.length;
        gameObjects.push(new Canon({
            objectNumber: i,
            objectName: `canon${i}`,
            xGlobal: shared.gameObjects[i].xGlobal,
            yGlobal: shared.gameObjects[i].yGlobal,
            diamter: 60,
            color: 'grey',
            xSpawnGlobal: shared.gameObjects[i].xSpawnGlobal,
            ySpawnGlobal: shared.gameObjects[i].ySpawnGlobal,
            planetIndex: shared.gameObjects[i].planetIndex,

        }));
    }
    // Remove extra towers if host has fewer
    while (gameObjects.length > shared.gameObjects.length) {
        gameObjects.pop();
    }
    // Update existing towers
    gameObjects.forEach((canon, index) => {
        canon.diameter = shared.gameObjects[index].diameter;
        canon.color = shared.gameObjects[index].color;
        canon.type = shared.gameObjects[index].type;

        canon.xGlobal = shared.gameObjects[index].xGlobal;
        canon.yGlobal = shared.gameObjects[index].yGlobal;
        canon.bullets = shared.gameObjects[index].bullets;
        canon.angle = shared.gameObjects[index].angle;
        canon.lastShotTime = shared.gameObjects[index].lastShotTime;
        canon.hits = shared.gameObjects[index].hits || Array(15).fill(0);
        canon.planetIndex = shared.gameObjects[index].planetIndex;
    });
}

//===================================================
// Copy data from guest to local objects
//===================================================

function stepLocal() {

    spacecrafts.forEach(spacecraft => {
        const guest = guests.find((p) => p.playerName === spacecraft.playerName);
        if (guest) {

            spacecraft.syncFromShared(guest);
        } else {
            spacecraft.planetIndex = -1;
        }
    });

}

function createSpacecrafts() {
    for (let i = 0; i < TOTAL_NUMBER_OF_PLAYERS; i++) {

        let teamName;
        if (i <= TOTAL_NUMBER_OF_PLAYERS / 2) {
            teamName = 'blue';
        } else {
            teamName = 'green';
        }
        playerName = "player" + i;
        playerDisplayName = playerName;

        spacecrafts.push(new Spacecraft({
            playerNumber: i,
            playerName: "player" + i,
            playerDisplayName: playerDisplayName,
            team: teamName,
            characterId: null,
            characterRank: null,
            characterName: null,
            characterInstanceId: null,
            iAmHost: null,
            isReady: false,
            hasCharacter: false,
            status: "available",
            lastProcessedResetFlag: false,
            xLocal: GAME_AREA_WIDTH / 2 + 100,
            yLocal: GAME_AREA_HEIGHT / 2,
            xGlobal: 0,  // no longer used
            yGlobal: 0,
            diameter: SPACECRAFT_SIZE,
            size: SPACECRAFT_SIZE,
            xMouse: 0,
            yMouse: 0,
            color: "",
            bullets: [],
            hits: Array(15).fill(0),
            planetIndex: -1,
        }));
    }
}
function createSpacecrafts2() {
    for (let i = 0; i < TOTAL_NUMBER_OF_PLAYERS; i++) {

        let teamName;
        if (i <= TOTAL_NUMBER_OF_PLAYERS / 2) {
            teamName = 'blue';
        } else {
            teamName = 'green';
        }
        playerName = "player" + i;
        playerDisplayName = playerName;

        spacecrafts.push(new Spacecraft({
            playerNumber: i,
            playerName: "player" + i,
            playerDisplayName: playerDisplayName,
            team: teamName,
            characterId: null,
            characterRank: null,
            characterName: null,
            characterInstanceId: null,
            iAmHost: null,
            isReady: false,
            hasCharacter: false,
            status: "available",
            lastProcessedResetFlag: false,
            xLocal: GAME_AREA_WIDTH_NEW / 2 + 100,
            yLocal: GAME_AREA_HEIGHT_NEW / 2 + 450,
            xGlobal: 0,
            yGlobal: 0,
            diameter: SPACECRAFT_SIZE,
            size: SPACECRAFT_SIZE,
            xMouse: 0,
            yMouse: 0,
            color: "",
            bullets: [],
            hits: Array(15).fill(0),
            planetIndex: -1,
        }));
    }
}

function joinGame() {
    // don't let current players double join
    if (me.playerName.startsWith("player")) return;

    for (let spacecraft of spacecrafts) {
        console.log("Checking spacecraft:", spacecraft.playerName);
        if (!guests.find((p) => p.playerName === spacecraft.playerName)) {
            spawn(spacecraft);
            return;
        }
    }
}

function spawn(spacecraft) {
    console.log("Spawning spacecraft:", spacecraft.playerName);
    me.playerNumber = spacecraft.playerNumber;
    me.playerName = spacecraft.playerName;
    me.playerDisplayName = spacecraft.playerDisplayName;
    me.team = spacecraft.team;
    me.characterId = spacecraft.characterId;
    me.characterRank = spacecraft.characterRank;
    me.characterName = spacecraft.characterName;
    me.characterInstanceId = spacecraft.characterInstanceId;
    me.size = spacecraft.size;
    me.isReady = spacecraft.isReady;
    me.hasCharacter = spacecraft.hasCharacter;
    me.status = spacecraft.status;
    me.lastProcessedResetFlag = spacecraft.lastProcessedResetFlag;
    me.xLocal = spacecraft.xLocal;
    me.yLocal = spacecraft.yLocal;
    me.xGlobal = 0; // No longer used
    me.yGlobal = 0; // No longer used
    me.diameter = spacecraft.diameter;
    me.color = spacecraft.color;
    me.bullets = [];
    me.hits = Array(15).fill(0);
    me.planetIndex = -1;
    me.lastWarpTime = 0; // Reset warp cooldown when spawning
}
//===================================================
// DRAWING FUNCTIONS
//===================================================

function drawFixedPlanet() {
    fixedMinimap.draw();
    fixedMinimap.drawSpacecrafts();
}

function drawMinimap() {
    push();
    angleMode(DEGREES);

    solarSystem.update();
    solarSystem.draw();
    pop()
}

// Generic function to draw warp gate animations
function drawWarpGateAnimation(warpGateGlobalX, warpGateGlobalY, localOffsetX, localOffsetY, imageFrames, frameWidth, frameHeight, speedDivisor, isPulsating, isCooldown = false) {
    if (!selectedPlanet) {
        return;
    }

    let xLocal = warpGateGlobalX + localOffsetX;
    let yLocal = warpGateGlobalY - selectedPlanet.yCropOffset + localOffsetY;

    if (imageFrames && imageFrames.length > 0) {
        let frameIndexWarpgate;
        const totalFrames = imageFrames.length;

        if (isCooldown) {
            // Show first frame (index 0) as still image when in cooldown
            if (totalFrames > 0) {
                frameIndexWarpgate = 0;
            } else {
                // No frames to show
                return;
            }
        } else {
            // Animate using frames from index 1 onwards
            if (totalFrames <= 1) {
                // No animation frames available (frame 0 is for cooldown, need at least one more)
                return;
            }

            const numAnimationFrames = totalFrames - 1; // Number of frames available for animation (frames 1 to totalFrames-1)

            if (isPulsating) {
                if (numAnimationFrames === 1) { // Only one frame for animation (e.g., imageFrames = [cooldownImg, animImg1])
                    frameIndexWarpgate = 1; // Show that single animation frame
                } else { // numAnimationFrames >= 2
                    const currentSpeedDivisor = speedDivisor > 0 ? speedDivisor : 9; // Default to 9 if invalid
                    // Period for 0-indexed animation frames (0 to numAnimationFrames-1)
                    const period = 2 * (numAnimationFrames - 1);
                    const valueInCycle = floor(frameCount / currentSpeedDivisor) % period;

                    let animationFrameIndex; // This will be 0-indexed relative to the animation frames sequence
                    if (valueInCycle < numAnimationFrames) {
                        animationFrameIndex = valueInCycle; // Moving forward
                    } else {
                        animationFrameIndex = period - valueInCycle; // Moving backward
                    }
                    frameIndexWarpgate = animationFrameIndex + 1; // Offset by 1 to map to original imageFrames index
                }
            } else {
                // numAnimationFrames will be at least 1 here because totalFrames > 1
                const currentSpeedDivisor = speedDivisor > 0 ? speedDivisor : 6; // Default to 6 if invalid
                let animationFrameIndex = floor(frameCount / currentSpeedDivisor) % numAnimationFrames; // 0-indexed for animation frames
                frameIndexWarpgate = animationFrameIndex + 1; // Offset by 1 to map to original imageFrames index
            }
        }

        let imgWarpgate = imageFrames[frameIndexWarpgate];
        if (imgWarpgate) {
            push();
            imageMode(CENTER);
            image(imgWarpgate, GAME_AREA_X + xLocal, GAME_AREA_Y + yLocal, frameWidth, frameHeight);
            pop();
        }
    }
}
function drawGameAreaBackground2() {
    if (showGraphics && allImagesLoadedSuccessfully) {

        // Use the planet background image that corresponds to the current planet index
        let currentBackgroundImage = planetBackgroundImages[me.planetIndex];

        // Scale the background image to match planet size
        image(currentBackgroundImage,
            GAME_AREA_X,
            GAME_AREA_Y,
            GAME_AREA_WIDTH_NEW,
            GAME_AREA_HEIGHT_NEW
        );

        // Check if warp gate is in cooldown
        if (showBlurAndTintEffects && !imagesStillLoading) {
            const currentTime = millis();
            const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;

            // Draw the animation for planet 0's down warp gate  
            if (me.planetIndex === 0) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 156, 124, 9, false, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 124, 112, 12, false, isCooldown);
            }
            if (me.planetIndex === 1) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 172, 133, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 189, 173, 9, true, isCooldown);
            }
            if (me.planetIndex === 2) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 226, 176, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 341, 341, 16, true, isCooldown);
            }
            if (me.planetIndex === 3) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 174, 135, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 174, 140, 8, false, isCooldown);
            }
            if (me.planetIndex === 4) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 178, 139, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 145, 106, 9, true, isCooldown);
            }
        } else {
            // Draw the warp gates on top of the background
            drawWarpGateCountDownOnGameArea();
        }
    } else {
        // Get colors consistent with the planet type
        const colorScheme = planetColors[me.planetIndex];

        let x = GAME_AREA_X + selectedPlanet.diameterPlanet / 2;
        let y = GAME_AREA_Y + selectedPlanet.diameterPlanet / 2 - selectedPlanet.yCropOffset;
        let diameter = selectedPlanet.diameterPlanet;

        fill(colorScheme.center[0], colorScheme.center[1], colorScheme.center[2]);
        circle(x, y, diameter);

        fill(0);
        rect(0, 0, SCREEN_WIDTH, GAME_AREA_Y); // Black out top side
        rect(0, GAME_AREA_BOTTOM_NEW, SCREEN_WIDTH, SCREEN_HEIGHT); // Black out bottom side

        // Also draw warp gates in non-image mode
        drawWarpGatesOnGameArea();
    }

    const colorScheme = planetColors[me.planetIndex];

    push();
    fill('white');
    textAlign(RIGHT, BOTTOM);
    textSize(16);
    text(`${colorScheme.name}`,
        GAME_AREA_X + GAME_AREA_WIDTH_NEW,
        GAME_AREA_Y + GAME_AREA_HEIGHT_NEW - 10);
    pop();
}

function drawBlackBackground() {
    fill(backgroundColor[0], backgroundColor[1], backgroundColor[2])
    rect(0, 0, GAME_AREA_X, SCREEN_HEIGHT); // Black out left side
    rect(0, 0, SCREEN_WIDTH, GAME_AREA_Y); // Black out top side
    rect(GAME_AREA_RIGHT, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // Black out right side
    rect(0, GAME_AREA_BOTTOM, SCREEN_WIDTH, SCREEN_HEIGHT); // Black out bottom side
}

// Draw warp gates count down on the game area with cooldown visualization
function drawWarpGateCountDownOnGameArea() {
    // Calculate relative position for up warp gate based on global coordinates
    let xLocalUp = selectedPlanet.xWarpGateUp;
    let yLocalUp = selectedPlanet.yWarpGateUp;

    // Calculate relative position for down warp gate based on global coordinates  
    let xLocalDown = selectedPlanet.xWarpGateDown;
    let yLocalDown = selectedPlanet.yWarpGateDown;

    // Check if warp gate is in cooldown
    const currentTime = millis();
    const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;
    const cooldownRatio = isCooldown ?
        (currentTime - me.lastWarpTime) / WARP_COOLDOWN_TIME : 1;

    push();
    if (isCooldown) {

        noFill();
        stroke('cyan');
        strokeWeight(10);

        let diameterCountdown = 30
        arc(
            GAME_AREA_X + xLocalUp,
            GAME_AREA_Y + yLocalUp,
            diameterCountdown * 0.8,
            diameterCountdown * 0.8,
            0,
            cooldownRatio * TWO_PI
        );
        pop();
    }

    // Draw the "down" warp gate if it's visible on screen
    push();
    if (isCooldown) {
        // Draw cooldown progress arc
        noFill();
        stroke('magenta');
        strokeWeight(10);

        let diameterCountdown = 30
        arc(
            GAME_AREA_X + xLocalDown,
            GAME_AREA_Y + yLocalDown,
            diameterCountdown * 0.8,
            diameterCountdown * 0.8,
            0,
            cooldownRatio * TWO_PI
        );
    }
    pop();
}

function displayHostName() {
    fill(255, 223, 0);
    textSize(16);
    textAlign(LEFT, TOP);
    const infoX = SCREEN_WIDTH - 180;
    const infoY = 20;

    if (partyIsHost()) {
        text("HOST: Me", infoX, infoY);
    } else {
        const hostPlayers = guests.filter(p => p.iAmHost === true);
        if (hostPlayers.length > 0) {
            const hostPlayer = hostPlayers[0]; // Get the first host found
            const hostDisplayName = hostPlayer.playerDisplayName || `Player ${hostPlayer.playerNumber}`;
            text(`HOST: ${hostDisplayName}`, infoX, infoY);
        } else {
            text("Host client not identified", infoX, infoY); // Fallback if no host is found in guests
        }
    }
}

function drawStatusMessages() {
    const statusMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2;
    const statusMsgY = GAME_AREA_Y - 30;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' &&
        myCharacterData &&
        myCharacterData.battleOutcomeResult) {

        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(20);

        let outcomeMsg = "";

        if (myCharacterData.battleInfo) {
            // Include opponent player name in the message
            const opponentPlayerName = myCharacterData.battleInfo.playerName || 'Unknown Player';
            const opponentCharacterName = myCharacterData.battleInfo.name || '??';
            const opponentCharacterId = myCharacterData.battleInfo.id || '??';
            const myCharacterName = myCharacterData.battleInfo.myName || '??';
            const myCharacterId = myCharacterData.battleInfo.myId || '??';
            outcomeMsg = `You were a ${myCharacterName}(${myCharacterId}) and ${myCharacterData.battleOutcomeResult} a battle vs a ${opponentCharacterName}(${opponentCharacterId}) - ${opponentPlayerName}`;
        } else {
            outcomeMsg = `${myCharacterData.battleOutcomeResult}`;
        }
        text(outcomeMsg, statusMsgX, statusMsgY);
    }    // General game message (including team full messages) 
    else if (message) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(message, statusMsgX, statusMsgY);
    }
    // Game start countdown
    else if (shared.gameState === 'GAME-SETUP' && shared.gameStartTimerStartTime) {
        fill(200);
        textSize(18);
        textAlign(CENTER, CENTER);
        text(`A new game is starting in ${shared.gameStartTimerSeconds} seconds...`, statusMsgX, statusMsgY);
    }
    // Game reset countdown
    else if (shared.gameState === 'GAME-FINISHED' && shared.resetTimerStartTime) {
        fill(200);
        textSize(18);
        textAlign(CENTER, CENTER);
        text(`A new game will be setup in ${shared.resetTimerSeconds} seconds...`, statusMsgX, statusMsgY);
    }
}

function drawTopLeftInfo() {
    if (me.isReady) {
        fill(255);
        textSize(18);
        textAlign(LEFT, TOP);
        text(`Welcome, ${me.playerDisplayName}! Team: ${me.team === 'blue' ? 'Purple' : 'Green'}.`, 10, 20);
        if (me.hasCharacter) {
            text(`You are a: ${me.characterName}`, 10, 50);
        } else {
            text("Choose your Spacecraft:", 10, 50);
        }
    }
}

function displayTwoPlayersWithTheSamePlayerNumber() {

    let samePlayerNumber = false
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    let twoPlayersWithTheSamePlayerNumber = false
    playerNumbers.forEach((count, index) => {
        if (count > 1) {
            twoPlayersWithTheSamePlayerNumber = true

        }
    });
    if (twoPlayersWithTheSamePlayerNumber) {
        samePlayerNumber = true
    }

    if (samePlayerNumber) {
        fill(255, 0, 0); // Red color
        textAlign(LEFT, TOP);
        textSize(12);
        let displayPlayerNumberIssueText = "Two players have the same playerNumber. One must refresh the browser."
        text(displayPlayerNumberIssueText, GAME_AREA_X + 40, 35);
    }
}

function drawGameStats() {
    const statsX = GAME_AREA_X + 50;
    const statsY = GAME_AREA_Y + 70;
    const sectionSpacing = 30;
    const lineHeight = 20;
    const headerSize = 18;
    const textSizeNormal = 14;

    push();
    textAlign(LEFT, TOP);
    fill(255);

    // Section 1: Title
    textSize(headerSize);
    text("Game Statistics", statsX, statsY);

    // Section 2: Team Scores
    const scoresY = statsY + sectionSpacing;
    textSize(textSizeNormal);
    fill(133, 69, 196); // Purple
    text(`Team PURPLE Wins: ${shared.blueWins || 0}`, statsX, scoresY);
    fill(0, 200, 100); // Green
    text(`Team GREEN Wins: ${shared.greenWins || 0}`, statsX, scoresY + lineHeight);
    fill(200); // Gray
    text(`Draws: ${shared.draws || 0}`, statsX, scoresY + lineHeight * 2);

    // Section 3: Players
    const playersY = scoresY + lineHeight * 3 + sectionSpacing;

    // Headers for teams
    textSize(headerSize);
    fill(133, 69, 196); // Purple
    text("Team PURPLE", statsX, playersY);
    fill(0, 200, 100); // Green
    text("Team GREEN", statsX + 300, playersY);
    fill(200); // Gray
    text("No Team", statsX + 600, playersY);

    // List players
    textSize(textSizeNormal);
    const purplePlayers = guests.filter(p => p.isReady && p.team === 'blue');
    const greenPlayers = guests.filter(p => p.isReady && p.team === 'green');
    const noTeamPlayers = guests.filter(p => !p.isReady);

    const maxRows = Math.max(purplePlayers.length, greenPlayers.length, noTeamPlayers.length);

    for (let i = 0; i < maxRows; i++) {
        if (i < purplePlayers.length) {
            fill(133, 69, 196); // Purple
            const p = purplePlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            text(`- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`, statsX + 20, playersY + lineHeight * (i + 1));
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 20, playersY + lineHeight * (i + 1));
        }
        if (i < greenPlayers.length) {
            fill(0, 200, 100); // Green
            const p = greenPlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 320, playersY + lineHeight * (i + 1));
        }
        if (i < noTeamPlayers.length) {
            fill(200); // Gray
            const p = noTeamPlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 620, playersY + lineHeight * (i + 1));
        }
    }

    pop();
}
function playerWithDuplicateNumber(playerNumber) {
    const playerNumbers = guests.map(p => p.playerNumber);
    return playerNumbers.filter(num => num === playerNumber).length > 1;
}

function drawCharacterLegend() {
    const legendX = GAME_AREA_RIGHT + 50;
    const legendTitleY = 10;

    // Title
    fill(200);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Eliminate the opponents Core Command to win a game!", legendX, legendTitleY);
    text("In general characters looses to higher rank characters", legendX, legendTitleY + 20);

    textSize(20);
    text("Characters:!", legendX, legendTitleY + 50);
    text("Battle outcomes!", legendX + 300, legendTitleY + 50);
    text("Special Ability", legendX + 500, legendTitleY + 50);

    const circleDiameter = 50; // 96px
    const itemVerticalPadding = 4;
    const itemHeight = circleDiameter + itemVerticalPadding;
    const textOffsetX = circleDiameter + 20;
    const specialRuleTextStartX = legendX + textOffsetX + 230;

    let currentItemContentStartY = legendTitleY + 80;

    let itemCount = 0;
    CHARACTER_DEFINITIONS.forEach(def => {
        // Draw colored circle
        if (showGraphics) {

            fill(def.color);
            ellipse(legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2, circleDiameter, circleDiameter);

            let imageId = getImageId(def.id);

            image(spacecraftBlueImages[imageId], legendX, currentItemContentStartY, circleDiameter, circleDiameter);

            if (dist(mouseX, mouseY, legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2) < circleDiameter / 2) {

                let imageId = getImageId(def.id);
                fill(255)
                ellipse(legendX + circleDiameter / 2 + 370, legendTitleY + circleDiameter / 2 + 250, circleDiameter * 3.5, circleDiameter * 3.5);

                image(spacecraftBlueImages[imageId], legendX + 320, legendTitleY + 200, circleDiameter * 3, circleDiameter * 3);
            }
        } else {
            fill(def.color);
            noStroke();
            ellipse(legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2, circleDiameter, circleDiameter);
        }

        itemCount++;

        // Text for name and rank
        fill(220);
        textSize(14);
        textAlign(LEFT, CENTER);

        const textBlockCenterY = currentItemContentStartY + circleDiameter / 2;

        let rankText = def.rank === -1 ? "C" : def.rank;
        text(`(${def.id}) ${def.name} (Rank: ${rankText})`, legendX + textOffsetX, textBlockCenterY);

        // Add special rules descriptions
        let specialRuleText = "";
        if (def.isEngineer && def.id === "3") {
            specialRuleText = "Wins vs Recon Drone";
        } else if (def.isReconDrone && def.id === "D") {
            specialRuleText = "Draws vs all except Engineer";
        } else if (def.isStealthSquad && def.id === "S") {
            specialRuleText = "Wins vs Star Commander";
        } else if (def.isCoreCommand && def.id === "C") {
            specialRuleText = "Loses to any attacker";
        } else if (def.isStarCommand && def.id === "10") {
            specialRuleText = "Loses to Stealth Squad";
        }

        if (specialRuleText) {
            fill(180);
            textAlign(LEFT, CENTER);
            text(specialRuleText, specialRuleTextStartX, textBlockCenterY);
        }

        // Add special rules descriptions
        specialRuleText = "";
        let specialRuleText2 = "";
        if (def.canMoveFast) {
            specialRuleText = "Moves fast";
        } else if (def.canCloake && def.canSnipe) {
            specialRuleText = "Can cloak on minimap by pressing 'c'";
            specialRuleText2 = "and snipe when not cloaked";
        } else if (def.canRapidFire) {
            specialRuleText = "Can rapid fire";
        } else if (def.canShoot) {
            specialRuleText = "Can shoot";
        } else if (def.canCloake) {
            specialRuleText = "Can cloak on minimap by pressing 'c'";
        }

        if (specialRuleText2) {
            fill(180);
            textAlign(LEFT, CENTER);
            text(specialRuleText, specialRuleTextStartX + 200, textBlockCenterY - 10);
            text(specialRuleText2, specialRuleTextStartX + 200, textBlockCenterY + 10);
        } else if (specialRuleText) {
            fill(180);
            textAlign(LEFT, CENTER);
            text(specialRuleText, specialRuleTextStartX + 200, textBlockCenterY);
        }

        currentItemContentStartY += itemHeight;
    });
    textSize(14);
}

function drawSpacecraft(playerData, characterData) {
    // Skip drawing if not valid or lost
    if (!playerData || !playerData.hasCharacter ||
        playerData.status === 'lost' ||
        playerData.x < -playerData.size ||
        playerData.y < -playerData.size) {
        return;
    }

    // Use characterData from shared list to check status
    if (!characterData || characterData.status === 'lost') {
        return;
    }

    let drawX = constrain(playerData.x, GAME_AREA_X + playerData.size / 2, GAME_AREA_RIGHT - playerData.size / 2);
    let drawY = constrain(playerData.y, GAME_AREA_Y + playerData.size / 2, GAME_AREA_BOTTOM - playerData.size / 2);

    // Define RGB values directly instead of using color()
    let r, g, b;
    if (playerData.team === 'blue') {
        r = 133; g = 69; b = 196;

    } else if (playerData.team === 'green') {
        r = 0; g = 200; b = 100;
    } else {
        r = 150; g = 150; b = 150;
    }

    // Apply appropriate stroke style
    if (playerData.playerNumber === me.playerNumber) {
        stroke(255, 255, 0);
        strokeWeight(2);
    } else {
        noStroke();
    }

    fill(r, g, b);
    ellipse(drawX, drawY, playerData.size, playerData.size);
    noStroke();

    // Reveal rank if appropriate
    const shouldRevealRank = true

    if (shouldRevealRank && playerData.characterId) {
        // Calculate brightness directly from RGB values
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        fill(brightness > 125 ? 0 : 255);
        textSize(playerData.size * 0.45);
        textAlign(CENTER, CENTER);
        text(playerData.characterId, drawX, drawY + 1);
    }

    fill(200);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(playerData.playerDisplayName || '?', drawX, drawY + playerData.size / 2 + 12);
}

//===================================================
// GAME STATE FUNCTIONS
//===================================================

function drawGameSetup() {
    if (!me.isReady) {
        const centerX = IMAGE_RING_X + CIRCLE_RADIUS + 90;
        const centerY = IMAGE_RING_Y + CIRCLE_RADIUS + 290;

        if (imagesStillLoading) {

            // Draw progress bar
            const barX = chooseTeamBlueButton.x - 7;
            const barY = chooseTeamBlueButton.x + chooseTeamBlueButton.height + 5;
            const barWidth = chooseTeamBlueButton.width * 2 + 15;
            const barHeight = 2; // Thin rectangle

            let progress = 0;
            if (totalImagesToLoadForPrepareImages > 0) {
                progress = imagesLoadedCount / totalImagesToLoadForPrepareImages;
            } else if (!imagesStillLoading) {
                progress = 1; // If no images to load and loading is marked as finished
            }
            progress = constrain(progress, 0, 1);

            fill(0, 255, 0);
            rect(barX, barY, barWidth * progress, barHeight);
        }

        // Show name input elements 
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Enter your player name and choose a team:", centerX, centerY);

        // Calculate team counts
        let blueTeamCount = guests.filter(p => p.isReady && p.team === 'blue').length;
        let greenTeamCount = guests.filter(p => p.isReady && p.team === 'green').length;

        // Conditionally show buttons or full message
        if (blueTeamCount >= MAX_PLAYERS_PER_TEAM && greenTeamCount >= MAX_PLAYERS_PER_TEAM) {
            // Both teams full
            if (nameInput) nameInput.show();
            if (chooseTeamBlueButton) chooseTeamBlueButton.hide();
            if (chooseTeamGreenButton) chooseTeamGreenButton.hide();
            fill(255, 100, 100);
            textSize(18);
            textAlign(CENTER, CENTER);
            text("New players cannot join because both teams are full.", centerX, centerY);
        } else {
            // At least one team has space
            if (nameInput) nameInput.show();
            if (chooseTeamBlueButton) {
                if (blueTeamCount < MAX_PLAYERS_PER_TEAM) chooseTeamBlueButton.show();
                else {
                    chooseTeamBlueButton.hide();
                    fill(150); textSize(14); textAlign(CENTER, CENTER);
                    text("Purple Team Full", chooseTeamBlueButton.x + chooseTeamBlueButton.width / 2,
                        chooseTeamBlueButton.y + chooseTeamBlueButton.height + 10);
                }
            }
            if (chooseTeamGreenButton) {
                if (greenTeamCount < MAX_PLAYERS_PER_TEAM) chooseTeamGreenButton.show();
                else {
                    chooseTeamGreenButton.hide();
                    fill(150); textSize(14); textAlign(CENTER, CENTER);
                    text("Green Team Full", chooseTeamGreenButton.x + chooseTeamGreenButton.width / 2,
                        chooseTeamGreenButton.y + chooseTeamGreenButton.height + 10);
                }
            }
        }
    } else {
        // Hide initial setup UI
        if (nameInput) nameInput.hide();
        if (chooseTeamBlueButton) chooseTeamBlueButton.hide();
        if (chooseTeamGreenButton) chooseTeamGreenButton.hide();

        // Draw welcome text and character list
        drawTopLeftInfo();
        drawCharacterList();

        // Display setup messages if countdown hasn't started
        if (!shared.gameStartTimerStartTime) {
            const statusMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2;
            const statusMsgY = GAME_AREA_Y - 30;

            let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
            let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

            fill(255, 100, 100);
            textAlign(CENTER, CENTER);
            textSize(20);

            let statusText = "";

            if (!blueFlagSelected || !greenFlagSelected) {
                if ((me.team === 'blue' && !blueFlagSelected) ||
                    (me.team === 'green' && !greenFlagSelected)) {
                    statusText = "A player from your team must select a Core Command...";
                } else {
                    statusText = "Waiting for the other team to choose a Core Command...";
                }
            }

            if (statusText) {
                text(statusText, statusMsgX, statusMsgY);
            }
        }
    }
}

function drawCharacterListAndInfo() {
    if (me.isReady) {
        drawTopLeftInfo();
        drawCharacterList();
    }
}

function drawCanonTowers() {
    if (!gameObjects) return;

    // Draw Canon Towers for all players - only on planet 
    if (me.planetIndex === 0) {
        gameObjects.forEach(canon => {
            canon.drawCanonTower();
            canon.drawBullets();
        });
    }
}
function drawSpacecrafts2() {
    activeCharacters.forEach((spacecraft) => {

        if (spacecraft.planetIndex === me.planetIndex) {
            const characterData = shared.characterList.find(c => c.instanceId === spacecraft.characterInstanceId);
            if (spacecraft.hasCharacter && characterData && characterData.status !== 'lost') {

                spacecraft.drawBullets2();
                spacecraft.drawSpacecraft2(characterData);
            }
        }
    });
}

function drawGameFinished() {
    const winMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2 + 70;
    const winMsgY = GAME_AREA_Y + 100;
    fill(255, 223, 0);
    textSize(36);
    textAlign(CENTER, CENTER);

    if (shared.coreCommandDisconnected) {
        if (shared.winningTeam === "blue") {
            winText = `PURPLE TEAM WINS! (because Core Command disconnected)`;
        } else {
            winText = `GREEN TEAM WINS! (because Core Command disconnected)`;
        }
    } else if (shared.winningTeam === "draw") {
        winText = `DRAW as the two Core Commanders were in battle! `;
    } else if (shared.winningTeam) {
        if (shared.winningTeam === "blue") {
            winText = `PURPLE TEAM WINS! `;
        } else {
            winText = `GREEN TEAM WINS! `;
        }
        if (shared.winningPlayerName && !shared.winningPlayerName.includes("Time's up")) {
            winText += `\n(Core Command captured by ${shared.winningPlayerName})`;
            textSize(24);
        } else {
            winText += `\n(Core Command was hit too many times)`;
        }
    }
    text(winText, winMsgX, winMsgY - 20);
}


function setPlayerInfo(team) {
    const playerDisplayName = nameInput.value().trim();
    message = "";

    if (playerDisplayName.length > 0) {
        // Check team count before joining
        let blueTeamCount = guests.filter(p => p.isReady && p.team === 'blue').length;
        let greenTeamCount = guests.filter(p => p.isReady && p.team === 'green').length;

        if (team === 'blue' && blueTeamCount >= MAX_PLAYERS_PER_TEAM) {
            message = "Cannot join Purple Team, it is full.";
            return;
        }

        if (team === 'green' && greenTeamCount >= MAX_PLAYERS_PER_TEAM) {
            message = "Cannot join Green Team, it is full.";
            return;
        }
        setSpawnLocation();

        me.playerDisplayName = playerDisplayName;
        me.team = team;
        me.isReady = true;
        nameInput.hide();
        chooseTeamBlueButton.hide();
        chooseTeamGreenButton.hide();
    } else {
        message = "Please enter a player name.";
    }
}

function keyPressed() {

    // https://www.toptal.com/developers/keycode
    if (keyCode === 13 || keyCode === 32) { // p 
        showGameArea = !showGameArea; // Toggle in-game mode
    }

    if (keyCode === 80) { // p 
        showGraphics = !showGraphics;
    }
    if (keyCode === 79) { // o
    }
    if (keyCode === 73) { // i
        showBlurAndTintEffects = !showBlurAndTintEffects;
    }
    if (keyCode === 85) { // u
        showColorBlindText = !showColorBlindText;
    }
    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!myCharacterData) return;

    if (myCharacterData.canCloake && keyCode === 67) { // key c
        me.isCloaked = !me.isCloaked;
    }
}

//===================================================
// CHARACTER MANAGEMENT
//===================================================

function initializeCharacterList() {
    if (partyIsHost()) {
        shared.characterList = [];
        const teams = ['blue', 'green'];

        teams.forEach(team => {
            CHARACTER_DEFINITIONS.forEach(def => {
                for (let i = 0; i < def.count; i++) {
                    shared.characterList.push({
                        // Core definition properties
                        ...def,
                        // Instance specific properties
                        team: team,
                        instanceId: `${team}_${def.id}_${i}`,
                        takenByPlayerName: null,
                        takenByPlayerId: null,
                        isPermanentlyLost: false,
                        // Battle/Status Fields
                        status: 'available',
                        inBattleWithInstanceId: null,
                        battleOutcomeResult: null,
                        battleInfo: null,
                        color: def.color,
                    });
                }
            });
        });
        console.log("HOST: Initialized shared.characterList with team assignments and status fields.");
    }
}

function drawCharacterList() {
    const listX = 10;
    let listY = 80;
    const itemHeight = 25;
    const itemWidth = 220;

    fill(200);
    textSize(14);
    textAlign(LEFT, TOP);

    // Filter list for player's team only
    const myTeamCharacterList = shared.characterList?.filter(item => item.team === me.team) || [];

    // Determine selection conditions
    let myTeamFlagChosen = guests.some(p => p.team === me.team && p.characterId === 'C' && p.takenByPlayerId !== null);
    let canSelectAnyAvailable = me.isReady && !me.hasCharacter;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' && me.hasCharacter &&
        myCharacterData && myCharacterData.isPermanentlyLost &&
        myCharacterData.battleOutcomeResult) {
    }
    // Filter drawable characters
    const drawableCharacters = myTeamCharacterList.filter(item => !item.isPermanentlyLost);

    drawableCharacters.forEach((item, index) => {
        let displayY = listY + index * itemHeight;
        let isAvailable = !item.takenByPlayerName;
        let canSelectItem = false;

        // Determine selectability
        if (!shared.resetFlag && canSelectAnyAvailable && isAvailable) {
            if (item.isCoreCommand) {
                // Can select flag only if team flag isn't chosen 
                canSelectItem = !myTeamFlagChosen;
            } else {
                // Can select non-flag if team flag IS chosen OR game is already in progress
                canSelectItem = myTeamFlagChosen || shared.gameState !== 'GAME-SETUP';
            }
        }

        // Highlighting logic 
        if (mouseX > listX && mouseX < listX + itemWidth &&
            mouseY > displayY && mouseY < displayY + itemHeight) { // Added !imagesStillLoading

            if (canSelectItem) {
                fill(0, 150, 200, 150); // Highlight selectable
                noStroke();
                rect(listX, displayY, itemWidth, itemHeight);
            } else if (isAvailable) {
                fill(100, 100, 100, 100); // Highlight available but not selectable
                noStroke();
                rect(listX, displayY, itemWidth, itemHeight);
            }
        }

        // Text color logic
        if (!isAvailable) fill(100); // Taken
        else if (canSelectItem) fill(255); // Selectable by me  
        else fill(150); // Available but not selectable by me

        // Display text
        let displayText = `(${item.id}) ${item.name}`;

        let hitByOthers = numberOfTimesBeingHit(item.takenByPlayerId)

        if (!isAvailable) displayText += ` - ${item.takenByPlayerName} (${hitByOthers}/${MAX_LIVES})`;

        textAlign(LEFT, CENTER);
        text(displayText, listX + 5, displayY + itemHeight / 2);
    });

    textAlign(LEFT, TOP); // Reset alignment
}

function numberOfTimesBeingHit(takenByPlayerId) {
    let hitByOthers = 0;
    activeCharacters.forEach(spacecraft => {
        hitByOthers += spacecraft.hits[takenByPlayerId];
    })
    hitByOthers += shared.canonTowerHits[takenByPlayerId];

    return hitByOthers;
}

//===================================================
// USER INPUT AND INTERACTION
//===================================================

function mousePressed() {

    if (!me.isReady) {
        if (imagesStillLoading) return; // Prevent interaction while loading

        gameImageManager.checkImageClicks();
        return;
    }

    // Character Selection Logic
    if (me.isReady && !me.hasCharacter) {
        handleCharacterSelection();
        return
    }

    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!me.hasCharacter ||
        me.status !== 'available' ||
        !myCharacterData ||
        myCharacterData.status !== 'available' ||
        shared.coreCommandLost ||
        !onLocalScreenArea(mouseX - GAME_AREA_X, mouseY - GAME_AREA_Y) ||
        (shared.gameState !== 'IN-GAME' && shared.gameState !== 'TEST-GAME-AREA')
    ) return;

    // Ensure the character has the canShoot flag
    if (!myCharacterData.canShoot || me.isCloaked) return;

    // Determine bullet limit
    let maxBullets = NUMBER_OF_BULLETS;
    if (myCharacterData.canRapidFire) {
        maxBullets = 2;
    }

    if (me.bullets.length >= maxBullets) return

    // Use current mouse position instead of stored coordinates
    // This ensures bullets shoot toward where the player is actually clicking
    let bullet = {
        xLocal: me.xLocal,
        yLocal: me.yLocal,
        xStart: me.xLocal,
        yStart: me.yLocal,
        xMouseStart: me.xMouse,
        yMouseStart: me.yMouse,
        xGlobal: 0,
        yGlobal: 0,
    };
    me.bullets.push(bullet);
}

function handleCharacterSelection() {
    const listX = 10;
    let listY = 80;
    const itemHeight = 25;
    const itemWidth = 220;

    // Filter for player's team only
    const myTeamCharacterList = shared.characterList?.filter(item => item.team === me.team) || [];

    // Get team flag status
    let myTeamFlagChosen = guests.some(p => p.team === me.team && p.characterId === 'C' && p.takenByPlayerId !== null);

    const selectableCharacters = myTeamCharacterList.filter(item => !item.isPermanentlyLost);

    for (let index = 0; index < selectableCharacters.length; index++) {
        const item = selectableCharacters[index];
        let displayY = listY + index * itemHeight;
        let isAvailable = !item.takenByPlayerName;
        let canSelectItem = false;

        if (isAvailable) {
            if (item.isCoreCommand) {
                canSelectItem = !myTeamFlagChosen;
            } else {
                canSelectItem = myTeamFlagChosen || shared.gameState !== 'GAME-SETUP';
            }
        }

        if (canSelectItem &&
            mouseX > listX && mouseX < listX + itemWidth &&
            mouseY > displayY && mouseY < displayY + itemHeight) {

            // Assign character details to 'me'
            me.characterId = item.id;
            me.characterRank = item.rank;
            me.characterName = item.name;
            me.characterInstanceId = item.instanceId;
            me.hasCharacter = true;
            me.status = "available";
            me.playerColor = item.color;

            if (item.isCoreCommand) {
                setSpawnLocation();
            } else {
                spawnNextToCoreCommand();
            }

            console.log(`Selected: ${me.characterName} (${me.characterInstanceId}) for team ${me.team}`);
            break; // Exit loop once selection is made
        }
    }
}

function spawnNextToCoreCommand() {
    // Find the Core Command character for the same team that is currently taken
    const coreCommandCharacter = shared.characterList.find(c =>
        c.team === me.team &&
        c.id === 'C' &&
        c.takenByPlayerId !== null
    );

    if (coreCommandCharacter && coreCommandCharacter.takenByPlayerId !== null) {
        // Find the player object (from guests) who is the Core Command
        const coreCommandPlayer = guests.find(p => p.playerNumber === coreCommandCharacter.takenByPlayerId);

        if (coreCommandPlayer) {
            // Spawn 'me' at the exact same location as the Core Command player
            me.planetIndex = coreCommandPlayer.planetIndex;
            me.xLocal = coreCommandPlayer.xLocal;
            me.yLocal = coreCommandPlayer.yLocal;
            me.bullets = []; // Reset bullets on spawn

            if (me.planetIndex !== -1 && solarSystem && solarSystem.planets[me.planetIndex]) {
                selectedPlanet = solarSystem.planets[me.planetIndex]; 
            } else {
                console.warn(`SpawnNextToCoreCommand: Core Command player ${coreCommandPlayer.playerName} has invalid planetIndex ${me.planetIndex}. Falling back to default spawn.`);
                setSpawnLocation(); // Fallback if planetIndex is invalid
            }
            console.log(`Player ${me.playerName} spawning at Core Command ${coreCommandPlayer.playerName}'s location on planet ${me.planetIndex}.`);
        } else {
            console.warn(`SpawnNextToCoreCommand: Core Command player (ID: ${coreCommandCharacter.takenByPlayerId}) not found in guests. Falling back to default spawn.`);
            setSpawnLocation(); // Fallback if Core Command player not found
        }
    } else {
        console.warn(`SpawnNextToCoreCommand: Core Command for team ${me.team} not found or not taken. Falling back to default spawn.`);
        setSpawnLocation(); // Fallback if Core Command character not found/taken 
    }
}

function setSpawnLocation() {
    if (me.team === 'blue') {
        me.planetIndex = planetIndexBlue;
    } else {
        me.planetIndex = planetIndexGreen;
    }
    selectedPlanet = solarSystem.planets[me.planetIndex];

    if (!selectedPlanet) {
        console.error("Selected planet is undefined in setSpawnLocation. Defaulting to center.");
        // Default spawn if planet data is missing
        me.xGlobal = 0;
        me.yGlobal = 0; // not used at all
        me.xLocal = GAME_AREA_WIDTH / 2;
        me.yLocal = GAME_AREA_HEIGHT / 2;
        return;
    }

    if (me.team === 'blue') {
        // Blue team spawns 100 pixels to the right of the 'up' warp gate
        me.xGlobal = 0; // not used at all
        me.yGlobal = 0; // not used at all
        me.xLocal = selectedPlanet.xWarpGateUp + 100;
        me.yLocal = selectedPlanet.yWarpGateUp - 100;

    } else { // Green team        
        // Preserve existing local coordinate setup for green team
        me.xGlobal = 0; // not used at all
        me.yGlobal = 0; // not used at all
        me.xLocal = GAME_AREA_WIDTH / 2 + 100;
        me.yLocal = GAME_AREA_HEIGHT / 2 - 100;
        me.xLocal = selectedPlanet.xWarpGateDown - 100;
        me.yLocal = selectedPlanet.yWarpGateDown - 100;
    }
}
function handlePlayerMovement2() {
    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!me.hasCharacter ||
        me.status !== 'available' ||
        !myCharacterData ||
        myCharacterData.status !== 'available' ||
        shared.coreCommandLost) return;

    let localOffX = 0;
    let localOffY = 0;

    let localSpeed = SPACECRAFT_SPEED; // 6 or 3 

    // Reduce speed if cloaked and character can cloak
    if (myCharacterData.canSnipe) {
        localSpeed = Math.max(1, localSpeed / 1.5);
    }

    if (myCharacterData.canMoveFast) {
        localSpeed = localSpeed + 2;
    }
    if (me.planetIndex === 3) {
        localSpeed--
    }
    if (me.planetIndex === 4) {
        localSpeed++
    }

    if (keyIsDown(65)) { localOffX = -localSpeed } // A
    if (keyIsDown(68)) { localOffX = localSpeed }  // D
    if (keyIsDown(87)) { localOffY = -localSpeed } // W
    if (keyIsDown(83)) { localOffY = localSpeed }  // S

    let xTemp = me.xLocal + localOffX;
    let yTemp = me.yLocal + localOffY; 

    let yPlanetCropOffset = selectedPlanet.yCropOffset
    // Keep local position within screen bounds
    xTemp = constrain(xTemp, 0, GAME_AREA_WIDTH_NEW);
    yTemp = constrain(yTemp, yPlanetCropOffset, GAME_AREA_HEIGHT_NEW + yPlanetCropOffset);

    if (selectedPlanet && selectedPlanet.onPlanet2(xTemp, yTemp)) {
        me.xLocal = xTemp;
        me.yLocal = yTemp;
    }

    me.xMouse = mouseX - GAME_AREA_X;
    me.yMouse = mouseY - GAME_AREA_Y + selectedPlanet.yCropOffset;
}

function handleBulletMovement() {
    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    for (let i = me.bullets.length - 1; i >= 0; i--) {
        let bullet = me.bullets[i];
        let bulletVector = createVector(
            int(bullet.xMouseStart) - bullet.xStart,
            int(bullet.yMouseStart) - bullet.yStart,
        ).normalize();

        let currentBulletSpeed = parseInt(BULLET_SPEED);
        if (myCharacterData && myCharacterData.canSnipe) {
            currentBulletSpeed *= 2; // Sniper bullets are twice as fast
        }

        bullet.xLocal += bulletVector.x * currentBulletSpeed;
        bullet.yLocal += bulletVector.y * currentBulletSpeed;

        let xLocalTemp = bullet.xLocal
        let yLocalTemp = bullet.yLocal

        // Remove bullet if it's not on the screen seen from the spacecraft shooting it
        if (!selectedPlanet.onPlanet(bullet.xLocal + bullet.xGlobal, bullet.yLocal + bullet.yGlobal)            
            || !onLocalScreenArea(xLocalTemp, yLocalTemp)) {
            me.bullets.splice(i, 1);
        }
    }
}

//===================================================
// STATE SYNCHRONIZATION
//===================================================

function updateLocalStateFromSharedList() {
    if (!shared.characterList || shared.characterList.length === 0) return;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' && me.hasCharacter &&
        myCharacterData && myCharacterData.isPermanentlyLost &&
        myCharacterData.battleOutcomeResult) {
        handlePlayerLoss();
    }
    // --- Reset Hit Counts for Lost Opponents ---
    if (me.hits && me.hits.length > 0) {
        for (let playerId = 0; playerId < me.hits.length; playerId++) {
            // Skip self and skip if already zero
            if (playerId === me.playerNumber || me.hits[playerId] === 0) {
                continue;
            }

            // Only reset hit counts for players that are PERMANENTLY lost
            // This ensures that players in battle or temporarily without characters still maintain their hit count
            const playerIsPermanentlyLost = !shared.characterList.some(character =>
                character.takenByPlayerId === playerId &&
                !character.isPermanentlyLost
            );

            if (playerIsPermanentlyLost) {
                console.log(`Client ${me.playerName}: Resetting hits for player ${playerId} as they are permanently lost.`);
                me.hits[playerId] = 0;
            }
        }
    }
}

function handlePlayerLoss() {
    if (!me.hasCharacter) return;

    console.log(`Player ${me.playerName} processing loss of ${me.characterName} (${me.characterInstanceId}) locally.`);

    // Reset player state
    me.hasCharacter = false;
    me.characterId = null;
    me.characterRank = null;
    me.characterName = null;
    //me.planetIndex = -1;
    me.status = 'lost'; // Intermediate status
    /*
       if (me.team === 'blue') {
           me.planetIndex = planetIndexBlue;
       } else {
           me.planetIndex = planetIndexGreen;
       }
           */
}

function resetClientState() {
    console.log(`Client Resetting State for ${me.playerName || 'New Player'}...`);

    // Save important state to preserve
    let savedPlayerNumber = me.playerNumber;
    let savedPlayerName = me.playerName;
    let savedPlayerDisplayName = me.playerDisplayName;
    let savedTeam = me.team;
    let savedIsReady = me.isReady;
    let savedPlanetIndex;

    if (me.team === 'blue') {
        savedPlanetIndex = planetIndexBlue;
    } else {
        savedPlanetIndex = planetIndexGreen;
    }

    // Reset player state
    Object.assign(me, {
        playerNumber: savedPlayerNumber,
        playerName: savedPlayerName,
        playerDisplayName: savedPlayerDisplayName,
        team: savedTeam,
        isReady: savedIsReady,
        characterId: null,
        characterRank: null,
        characterName: null,
        characterInstanceId: null,
        planetIndex: savedPlanetIndex,
        hasCharacter: false,
        status: "available",
        hits: Array(15).fill(0),
    });

    message = "";

    // Reset UI elements
    if (!nameInput || !nameInput.elt) createNameInput();
    if (!chooseTeamBlueButton || !chooseTeamBlueButton.elt) createNameInput();
    if (!chooseTeamGreenButton || !chooseTeamGreenButton.elt) createNameInput();

    // Show/Hide UI based on player setup state
    if (me.isReady) {
        nameInput.hide();
        chooseTeamBlueButton.hide();
        chooseTeamGreenButton.hide();
    } else {
        nameInput.show();
        chooseTeamBlueButton.show();
        chooseTeamGreenButton.show();
    }

    console.log("Client state reset complete.");
}

//===================================================
// HOST FUNCTIONS
//===================================================

function handleHostDuties() {
    if (!partyIsHost()) return;

    shared.currentTime = millis();

    // Mark characters as permanently lost if their player disconnected
    handleDisconnectedPlayers();

    // Update shared.characterList 'takenBy' info
    updateCharacterAssignments();

    switch (shared.gameState) {
        case "TEST-GAME-AREA":
            //console.log("HOST: Game is in progress.");

            // Move canon towers, bullets, check collisions and sync to shared object 
            updateCanonTowers()

            break;
        case "GAME-SETUP":
            handleGameSetupHost();
            break;
        case "IN-GAME":
            if (!shared.coreCommandLost) {
                handleGameInProgressHost();
            }
            break;
        case "GAME-FINISHED":
            handleGameFinishedHost();
            break;
    }
}

// Add this function if not present:
function handleDisconnectedPlayers() {
    if (!shared.characterList) return;

    const connectedPlayerIds = new Set(guests.map(p => p.playerNumber));

    shared.characterList.forEach(character => {
        // Only process characters that are assigned and not already lost
        if (character.takenByPlayerId && !character.isPermanentlyLost) {
            if (!connectedPlayerIds.has(character.takenByPlayerId)) {
                character.isPermanentlyLost = true;
                character.takenByPlayerId = null;
                character.takenByPlayerName = null;
                character.status = 'lost';
                character.inBattleWithInstanceId = null;
                character.battleOutcomeResult = null;
                character.battleInfo = null;
            }
        }
    });
}

function updateCharacterAssignments() {
    if (!shared.characterList) return;

    // Build map of current assignments
    let currentAssignments = new Map();
    guests.forEach(p => {
        if (p.hasCharacter && p.characterInstanceId) {
            currentAssignments.set(p.characterInstanceId, {
                name: p.playerDisplayName,
                playerNumber: p.playerNumber
            });
        }
    });

    // Update assignments in shared list
    shared.characterList.forEach(item => {
        if (!item.isPermanentlyLost) {
            const assignment = currentAssignments.get(item.instanceId);
            if (assignment) {
                if (item.takenByPlayerId !== assignment.playerNumber) {
                    item.takenByPlayerName = assignment.name;
                    item.takenByPlayerId = assignment.playerNumber;
                }
            } else if (item.takenByPlayerId !== null) {
                // Clear assignment if no longer owned
                item.takenByPlayerName = null;
                item.takenByPlayerId = null;
            }
        } else {
            // Ensure lost pieces have no owner
            if (item.takenByPlayerId !== null) {
                item.takenByPlayerName = null;
                item.takenByPlayerId = null;
            }
        }
    });
}

function handleGameSetupHost() {
    // Check if flags are selected
    let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
    let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

    const conditionsMet = blueFlagSelected && greenFlagSelected;

    // Start countdown if conditions met
    if (conditionsMet && shared.gameStartTimerStartTime === null) {
        console.log("HOST: Both flags selected. Starting game start countdown timer.");
        shared.gameStartTimerStartTime = shared.currentTime;
        shared.gameStartTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000); // Initialize with full seconds
    }

    // Cancel countdown if conditions no longer met
    if (!conditionsMet && shared.gameStartTimerStartTime !== null) {
        console.log("HOST: Flag selection condition no longer met. Cancelling game start countdown timer.");
        shared.gameStartTimerStartTime = null;
        shared.gameStartTimerSeconds = null; // Clear the seconds as well
    }

    // Update timer only if it's active
    if (shared.gameStartTimerStartTime !== null) {
        const elapsedSeconds = Math.floor((shared.currentTime - shared.gameStartTimerStartTime) / 1000);
        const remainingSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - elapsedSeconds;

        // Only update if it's a valid positive number and has changed
        if (remainingSeconds >= 0 && shared.gameStartTimerSeconds !== remainingSeconds) {
            shared.gameStartTimerSeconds = remainingSeconds;
        }

        // Start game when countdown finishes
        if (shared.currentTime - shared.gameStartTimerStartTime >= GAME_TRANSITION_TIME) {
            console.log("HOST: Game start timer finished. Starting game.");
            shared.gameState = "IN-GAME";
            shared.gameStartTimerStartTime = null; // Reset timer
            shared.gameStartTimerSeconds = null; // Clear the seconds too
        }
    }
}

function handleGameInProgressHost() {
    // Reset canon tower hits
    resetCanonTowerHitsForPlayersWithoutCharacters();

    // Move canon towers, bullets, check collisions and sync to shared object 
    updateCanonTowers()

    // Detect collisions and initiate battles
    detectCollisionsAndInitiateBattles();
    checkWinConditions();

    if (shared.gameState !== "GAME-FINISHED") {
        checkIfCoreCommandDisconnected()
    }
}

function updateCanonTowers() {
    if (!gameObjects || gameObjects.length === 0) return;

    gameObjects.forEach((canon, index) => {
        //console.log(canon)
        canon.move();
        const currentTime = millis();
        if (currentTime - canon.lastShotTime > TOWER_SHOOTING_INTERVAL) {
            if (activeCharacters.length > 0) {
                const spacecraftsOnPlanet3 = activeCharacters.filter(f => f.planetIndex === canon.planetIndex);
                if (spacecraftsOnPlanet3.length > 0) {
                    const nearestSpacecraft = canon.findNearestSpacecraft(spacecraftsOnPlanet3);

                    if (nearestSpacecraft) {
                        canon.shoot(nearestSpacecraft);
                        canon.lastShotTime = currentTime;
                    }
                }
            }
        }

        canon.moveBullets();
        canon.checkCollisionsWithSpacecrafts();

        // Sync to shared state
        shared.gameObjects[index] = {
            ...shared.gameObjects[index],
            xGlobal: canon.xGlobal,
            yGlobal: canon.yGlobal,
            bullets: canon.bullets,
            angle: canon.angle,
            lastShotTime: canon.lastShotTime,
            hits: canon.hits,
        };
    });
}

function resetCanonTowerHitsForPlayersWithoutCharacters() {
    spacecrafts.forEach((spacecraft, index) => {

        if (!spacecraft.hasCharacter) {
            // Reset hits for players who have characters
            shared.canonTowerHits[spacecraft.playerNumber] = 0;
        }
    })
}

function checkIfCoreCommandDisconnected() {
    let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
    let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

    if (!blueFlagSelected) {
        console.log(`HOST: GAME OVER! Green team wins as blue teams Core Command disconnected`);
        shared.winningTeam = 'green';
        shared.greenWins = (shared.greenWins || 0) + 1;
        shared.coreCommandDisconnected = true;
        shared.gameState = "GAME-FINISHED";
        return;
    }
    if (!greenFlagSelected) {
        console.log(`HOST: GAME OVER! Purple team wins as blue teams Core Command disconnected`);
        shared.winningTeam = 'blue';
        shared.blueWins = (shared.blueWins || 0) + 1;
        shared.coreCommandDisconnected = true;
        shared.gameState = "GAME-FINISHED";
        return;
    }
}

function detectCollisionsAndInitiateBattles() {
    // Only process available characters
    let activeCharacters = shared.characterList.filter(c =>
        c.takenByPlayerId !== null && c.status === 'available' && !c.isPermanentlyLost);

    // Check each pair of characters
    for (let i = 0; i < activeCharacters.length; i++) {
        let char1 = activeCharacters[i];
        let player1 = guests.find(p => p.playerNumber === char1.takenByPlayerId);

        if (!player1) {
            console.warn(`HOST: Player not found for active character ${char1.instanceId}`);
            continue;
        }

        // Check for loss due to hits ONLY if the character is currently 'available'
        // This prevents resetting the battle timer if already 'inBattle' waiting for resolution.
        if (char1.status === 'available') {
            let numberOfHits = numberOfTimesBeingHit(player1.playerNumber);

            if (numberOfHits >= MAX_LIVES) {
                const char1Def = CHARACTER_DEFINITIONS.find(c => c.id === char1.id);

                if (char1Def.isCoreCommand) {
                    console.log('flag hit too many times');
                    char1.battleOutcomeResult = 'You lost because you got hit by too many bullets!'
                    char1.status = 'noMoreLives';
                    char1.isPermanentlyLost = true;
                    char1.takenByPlayerId = null;
                    char1.takenByPlayerName = null;

                    // Clear battle fields
                    char1.inBattleWithInstanceId = null;
                    char1.battleOutcomeResult = null;
                    char1.battleInfo = null;
                    return;
                }
                let char1Index = shared.characterList.findIndex(c => c.instanceId === char1.instanceId);

                if (char1Index === -1) {
                    console.error("HOST: Could not find character in shared list for hit limit loss!");
                    continue; // Skip this character
                }

                console.log(`HOST: Initiating 'lost by hits' battle state for ${char1.instanceId}`);
                shared.characterList[char1Index].status = 'lost'; // Set status to start resolution timer
                shared.characterList[char1Index].inBattleWithInstanceId = null; // No opponent
                shared.characterList[char1Index].battleOutcomeResult = 'You lost by being hit too many times'; // Set outcome message
                shared.characterList[char1Index].battleInfo = null; // No opponent info
                shared.characterList[char1Index].isPermanentlyLost = true; // Mark as permanently lost

                // Skip regular collision checks for this character this frame as it's now 'inBattle'
                continue; // Move to the next character in the outer loop
            }
        }

        // If the character wasn't lost by hits, proceed with collision checks
        for (let j = i + 1; j < activeCharacters.length; j++) {
            let char2 = activeCharacters[j];
            let player2 = guests.find(p => p.playerNumber === char2.takenByPlayerId);

            if (!player2) {
                //console.warn(`HOST: Player not found for active character ${char2.instanceId}`);
                continue;
            }

            // Must be different teams and on the same planet
            if (player1.team === player2.team || player1.planetIndex != player2.planetIndex) continue;

            // Check collision distance using player positions
            let d = dist(player1.xLocal, player1.yLocal, player2.xLocal, player2.yLocal);

            let sizePlayer1 = player1.size * planetColors[player1.planetIndex].planetSizeFactor
            let sizePlayer2 = player2.size * planetColors[player2.planetIndex].planetSizeFactor

            if (d < (sizePlayer1 / 2 + sizePlayer2 / 2)) {
                //     console.log(`HOST: Collision detected between ${char1.instanceId} (${player1.playerName}) and ${char2.instanceId} (${char2.playerName}) at distance ${d.toFixed(2)}`);

                // Calculate battle outcome
                const outcome = calculateBattleOutcome(char1, char2);
                //    console.log(`HOST: Battle Outcome: ${char1.instanceId} (${outcome.char1Result}), ${char2.instanceId} (${outcome.char2Result})`);

                // Handle immediate game win (flag capture)
                if (outcome.gameWonByTeam && !outcome.coreCommandBattleDraw) {
                    //        console.log(`HOST: GAME OVER! Flag captured. Winner: ${outcome.gameWonByTeam} team by ${outcome.winningPlayerName}.`);
                    shared.gameState = "GAME-FINISHED";
                    shared.winningTeam = outcome.gameWonByTeam;
                    shared.winningPlayerName = outcome.winningPlayerName;
                    console.log("HOST: GAME OVER! Flag captured.");
                    // Update statistics
                    if (shared.winningTeam === 'blue') {
                        shared.blueWins = (shared.blueWins || 0) + 1;
                    } else if (shared.winningTeam === 'green') {
                        shared.greenWins = (shared.greenWins || 0) + 1;
                    } else if (shared.winningTeam === 'draw') {
                        shared.draws = (shared.draws || 0) + 1;
                    }
                    return;
                }

                // Find characters in shared list
                let char1Index = shared.characterList.findIndex(c => c.instanceId === char1.instanceId);
                let char2Index = shared.characterList.findIndex(c => c.instanceId === char2.instanceId);

                if (char1Index === -1 || char2Index === -1) {
                    console.error("HOST: Could not find battling characters in shared list!");
                    continue;
                }

                // Check for Core Command loss
                const char1IsFlag = CHARACTER_DEFINITIONS.find(c => c.id === char1.id)?.isCoreCommand;
                const char2IsFlag = CHARACTER_DEFINITIONS.find(c => c.id === char2.id)?.isCoreCommand;

                if (outcome.coreCommandBattleDraw ||
                    (char1IsFlag && outcome.char1Result !== 'won') ||
                    (char2IsFlag && outcome.char2Result !== 'won')) {

                    if (outcome.coreCommandBattleDraw) {
                        console.log("HOST: Core Command vs Core Command battle! Both lost.");
                    } else {
                        console.log("HOST: Core Command lost or drawn in battle!");
                    }
                    shared.coreCommandLost = true;
                }

                // Set up battle in shared list for char1
                if (outcome.char1Result === 'lost' || outcome.char1Result === 'had draw in') {
                    shared.characterList[char1Index].inBattleWithInstanceId = char2.instanceId;
                    shared.characterList[char1Index].battleOutcomeResult = outcome.char1Result;
                    shared.characterList[char1Index].isPermanentlyLost = true;
                    // Include opponent player name
                    shared.characterList[char1Index].battleInfo = { name: char2.name, id: char2.id, playerName: player2.playerDisplayName, myName: char1.name, myId: char1.id };
                }

                // Set up battle in shared list for char2
                if (outcome.char2Result === 'lost' || outcome.char2Result === 'had draw in') {
                    shared.characterList[char2Index].inBattleWithInstanceId = char1.instanceId;
                    shared.characterList[char2Index].battleOutcomeResult = outcome.char2Result;
                    shared.characterList[char2Index].isPermanentlyLost = true;
                    // Include opponent player name
                    shared.characterList[char2Index].battleInfo = { name: char1.name, id: char1.id, playerName: player1.playerDisplayName, myName: char2.name, myId: char2.id };
                }

                // Set up battle in shared list for char1
                if (outcome.char1Result === 'won') {
                    shared.characterList[char1Index].inBattleWithInstanceId = char2.instanceId;
                    shared.characterList[char1Index].battleOutcomeResult = outcome.char1Result;
                    // Include opponent player name
                    shared.characterList[char1Index].battleInfo = { name: char2.name, id: char2.id, playerName: player2.playerDisplayName, myName: char1.name, myId: char1.id };
                }

                // Set up battle in shared list for char2
                if (outcome.char2Result === 'won') {
                    shared.characterList[char2Index].inBattleWithInstanceId = char1.instanceId;
                    shared.characterList[char2Index].battleOutcomeResult = outcome.char2Result;
                    // Include opponent player name
                    shared.characterList[char2Index].battleInfo = { name: char1.name, id: char1.id, playerName: player1.playerDisplayName, myName: char2.name, myId: char2.id };
                }

                // Skip to next character
                break;
            }
        }
    }
}

function calculateBattleOutcome(char1, char2) {
    // Get character definitions
    const char1Def = CHARACTER_DEFINITIONS.find(c => c.id === char1.id);
    const char2Def = CHARACTER_DEFINITIONS.find(c => c.id === char2.id);

    // Initialize variables
    let gameWonByTeam = null;
    let winningPlayerName = null;
    let coreCommandBattleDraw = false;

    if (!char1Def || !char2Def) {
        console.error("HOST: Missing character definition during battle calculation!", char1.id, char2.id);
        return {
            char1Result: 'had draw in',
            char2Result: 'had draw in',
            gameWonByTeam,
            winningPlayerName,
            coreCommandBattleDraw
        };
    }

    let char1Result = 'pending';
    let char2Result = 'pending';

    // Handle Flag vs Flag specially
    if (char1Def.isCoreCommand && char2Def.isCoreCommand) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
        coreCommandBattleDraw = true;
    }
    // Handle Flag vs non-Flag
    else if (char1Def.isCoreCommand) {
        char1Result = 'lost';
        char2Result = 'won';
        gameWonByTeam = char2.team;
        winningPlayerName = char2.takenByPlayerName;
    }
    else if (char2Def.isCoreCommand) {
        char1Result = 'won';
        char2Result = 'lost';
        gameWonByTeam = char1.team;
        winningPlayerName = char1.takenByPlayerName;
    }
    // Handle special cases
    else if (char1Def.isEngineer && char2Def.isReconDrone) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else if (char1Def.isReconDrone && char2Def.isEngineer) {
        char1Result = 'lost';
        char2Result = 'won';
    }
    else if (char1Def.isReconDrone || char2Def.isReconDrone) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
    }
    else if (char1Def.isStealthSquad && char2Def.isStarCommand) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else if (char1Def.isStarCommand && char2Def.isStealthSquad) {
        char1Result = 'lost';
        char2Result = 'won';
    }
    // Standard rank comparison
    else if (char1.rank === char2.rank) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
    }
    else if (char1.rank > char2.rank) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else {
        char1Result = 'lost';
        char2Result = 'won';
    }

    return {
        char1Result,
        char2Result,
        gameWonByTeam,
        winningPlayerName,
        coreCommandBattleDraw
    };
}


function resetCanonTowerHits(playerNumber) {
    // Reset hit counters for each individual tower
    if (gameObjects && gameObjects.length > 0) {
        gameObjects.forEach(tower => {
            tower.hits[playerNumber] = 0;
        });
    }

    // Also reset hit counters in shared gameObjects for clients
    if (shared.gameObjects && shared.gameObjects.length > 0) {
        shared.gameObjects.forEach(tower => {
            tower.hits[playerNumber] = 0;
        });
    }
}

function checkWinConditions() {
    if (shared.gameState !== "GAME-FINISHED") {
        let blueFlagExists = false;
        let greenFlagExists = false;

        // Check flags based on shared list status
        shared.characterList.forEach(c => {
            if (c.id === 'C' && !c.isPermanentlyLost && c.status !== 'lost') {
                if (c.team === 'blue') blueFlagExists = true;
                if (c.team === 'green') greenFlagExists = true;
            }
        });

        let newGameState = null;
        let newWinningTeam = null;
        shared.winningPlayerName = null;

        // Check win conditions
        if (!shared.coreCommandLost) { // Only check elimination if Core Command wasn't lost in battle
            if (!blueFlagExists && !greenFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "draw";
                console.log("HOST: Both flags eliminated. Draw.");
            } else if (!blueFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "green";
                console.log("HOST: Purple flag eliminated. Green wins.");
            } else if (!greenFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "blue";
                console.log("HOST: Green flag eliminated. Purple wins.");
            }
        } else if (shared.coreCommandLost) {
            newGameState = "GAME-FINISHED";
            newWinningTeam = "draw";
            shared.winningPlayerName = "Both Core Commands Lost";
            console.log("HOST: Game ended due to Core Command loss/draw.");
        }

        // Update game state if changed
        if (newGameState && shared.gameState !== newGameState) {
            console.log(`HOST: Setting game state to ${newGameState}, Winning Team: ${newWinningTeam}, Winning Player: ${shared.winningPlayerName || 'N/A'}`);
            shared.gameState = newGameState;
            shared.winningTeam = newWinningTeam;

            // Update statistics
            if (newWinningTeam === 'blue') {
                shared.blueWins = (shared.blueWins || 0) + 1;
            } else if (newWinningTeam === 'green') {
                shared.greenWins = (shared.greenWins || 0) + 1;
            } else if (newWinningTeam === 'draw') {
                shared.draws = (shared.draws || 0) + 1;
            }
        }
    }
}

function handleGameFinishedHost() {
    // Start reset countdown if not started and reset isn't flagged
    if (shared.resetTimerStartTime === null && !shared.resetFlag) {
        console.log("HOST: Starting reset countdown timer.");
        shared.resetTimerStartTime = shared.currentTime;
        shared.resetTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000); // Initialize with full seconds
    }

    // Update timer only if it's active
    if (shared.resetTimerStartTime !== null && !shared.resetFlag) {
        const elapsedSeconds = Math.floor((shared.currentTime - shared.resetTimerStartTime) / 1000);
        const remainingSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - elapsedSeconds;

        // Only update if it's a valid positive number and has changed
        if (remainingSeconds >= 0 && shared.resetTimerSeconds !== remainingSeconds) {
            shared.resetTimerSeconds = remainingSeconds;
        }

        // Trigger reset when countdown finishes
        if (shared.currentTime - shared.resetTimerStartTime >= GAME_TRANSITION_TIME && !shared.resetFlag) {
            console.log("HOST: Reset timer finished. Setting reset flag.");
            shared.resetFlag = true;
            shared.resetTimerStartTime = null;
            shared.resetTimerSeconds = null; // Clear the seconds too
        }
    }

    shared.resetTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - Math.floor((shared.currentTime - shared.resetTimerStartTime) / 1000)

    // Process reset
    if (shared.resetFlag) {
        console.log("HOST: Processing reset flag...");
        shared.gameState = initialGameState;
        shared.winningTeam = null;
        shared.winningPlayerName = null;
        shared.coreCommandLost = false;
        shared.resetTimerStartTime = null;
        shared.canonTowerHits = Array(15).fill(0);

        // Reset hit counters for each individual tower
        if (gameObjects && gameObjects.length > 0) {
            gameObjects.forEach(tower => {
                tower.hits = Array(15).fill(0);
            });
        }

        // Also reset hit counters in shared gameObjects for clients
        if (shared.gameObjects && shared.gameObjects.length > 0) {
            shared.gameObjects.forEach(tower => {
                tower.hits = Array(15).fill(0);
            });
        }

        initializeCharacterList();

        // Clear reset flag after delay
        setTimeout(() => {
            if (partyIsHost()) {
                shared.resetFlag = false;
                console.log("HOST: Reset flag set back to false.");
            }
        }, 3000);
    }
}

function checkBulletCollisions() {
    const opponents = activeCharacters.filter(spacecraft =>
        spacecraft.planetIndex === me.planetIndex &&
        spacecraft.hasCharacter &&
        spacecraft.team !== me.team);

    for (const opponent of opponents) {
        checkBulletCollision(opponent);
    }
}

function checkBulletCollision(spacecraft) {
    for (let i = me.bullets.length - 1; i >= 0; i--) {
        let bullet = me.bullets[i];

        // Calculate bullet's position relative to the spacecraft
        let bulletPosX = bullet.xLocal
        let bulletPosY = bullet.yLocal

        // Calculate spacecraft's position relative to the bullet
        let spacecraftPosX = spacecraft.xLocal
        let spacecraftPosY = spacecraft.yLocal

        let d = dist(spacecraftPosX, spacecraftPosY, bulletPosX, bulletPosY);

        let spacecraftDiameter = spacecraft.diameter * planetColors[spacecraft.planetIndex].planetSizeFactor;

        if (d < (spacecraftDiameter / 2 + BULLET_DIAMETER / 2)) {
            me.hits[spacecraft.playerNumber]++;
            me.bullets.splice(i, 1);
        }
    }
}
function updateTowerCount() {
    console.log("Updating tower count...");
    gameObjects = generateTowers();

    shared.gameObjects = gameObjects.map(tower => ({
        xGlobal: tower.xGlobal,
        yGlobal: tower.yGlobal,
        diameter: tower.diameter,
        color: tower.color,
        type: tower.type,
        bullets: [],
        angle: 0,
        hits: Array(15).fill(0),
        planetIndex: 0,
        lastShotTime: 0,
        xSpawnGlobal: tower.xSpawnGlobal,
        ySpawnGlobal: tower.ySpawnGlobal,
    }));
}

function generateTowers() {
    const towers = [];

    // Table of predefined tower locations
    const towerTable = [
        { x: 400, y: 400 + 750, color: 'red', type: 0 },
        { x: 500, y: 500 + 750, color: 'blue', type: 1 },
        { x: 600, y: 600 + 750, color: 'green', type: 2 },
    ];

    for (let i = 0; i < towerTable.length; i++) {
        const tower = towerTable[i];

        towers.push(new Canon({
            objectNumber: i,
            objectName: `canon${i}`,
            xGlobal: tower.x,
            yGlobal: tower.y,
            diameter: 60,
            xSpawnGlobal: tower.x,
            ySpawnGlobal: tower.y,
            color: tower.color,
            type: tower.type,
            planetIndex: 0,
        }));
    }

    return towers;
}

function resolvePlayerNumberConflicts() {
    const conflictMessage = "Another player has the same playerNumber. Please refresh the browser window";

    if (playerWithTheSamePlayerNumberAsMeExist()) {
        // Only set the message if it's not already set to avoid flickering
        if (message !== conflictMessage) {
            message = conflictMessage;
        }
    } else {
        // Clear the message ONLY if it's the specific conflict message
        if (message === conflictMessage) {
            message = ""; // Clear the message
        }
    }
}
function playerWithTheSamePlayerNumberAsMeExist() {
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    if (playerNumbers[me.playerNumber] > 1) {
        return true
    }
    return false
}
function twoPlayersWithTheSamePlayerNumberExist() {
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    let twoPlayersWithTheSamePlayerNumber = false
    playerNumbers.forEach((count, index) => {
        if (count > 1) {
            twoPlayersWithTheSamePlayerNumber = true

        }
    });
    if (twoPlayersWithTheSamePlayerNumber) {
        return true
    }
    return false
}
