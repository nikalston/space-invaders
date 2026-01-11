// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio setup
let audioCtx = null;
let musicPlaying = false;
let musicGain = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = audioCtx.createGain();
        musicGain.gain.value = 0.3;
        musicGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sound effect: Player shoot
function playShootSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
}

// Sound effect: Alien explosion
function playExplosionSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
}

// Sound effect: Player explosion (LOUD!)
function playPlayerExplosionSound() {
    if (!audioCtx) return;

    // Layer 1: Low rumble
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.8);
    gain1.gain.setValueAtTime(0.7, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.8);

    // Layer 2: Mid crunch
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
    gain2.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc2.start(audioCtx.currentTime);
    osc2.stop(audioCtx.currentTime + 0.5);

    // Layer 3: High sizzle
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    gain3.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc3.start(audioCtx.currentTime);
    osc3.stop(audioCtx.currentTime + 0.3);

    // Layer 4: Noise burst using rapid frequency changes
    for (let i = 0; i < 5; i++) {
        const noiseOsc = audioCtx.createOscillator();
        const noiseGain = audioCtx.createGain();
        noiseOsc.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseOsc.type = 'square';
        noiseOsc.frequency.setValueAtTime(Math.random() * 500 + 100, audioCtx.currentTime + i * 0.05);
        noiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.05 + 0.15);
        noiseOsc.start(audioCtx.currentTime + i * 0.05);
        noiseOsc.stop(audioCtx.currentTime + i * 0.05 + 0.15);
    }
}

// Sound effect: Level up
function playLevelUpSound() {
    if (!audioCtx) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.15);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.15);
    });
}

// Sound effect: Game over
function playGameOverSound() {
    if (!audioCtx) return;
    const notes = [392, 330, 262, 196];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.2 + 0.25);
        osc.start(audioCtx.currentTime + i * 0.2);
        osc.stop(audioCtx.currentTime + i * 0.2 + 0.25);
    });
}

// Background music - ominous dark bass line
let musicInterval = null;
let droneOsc = null;
let droneGain = null;
function startMusic() {
    if (!audioCtx || musicPlaying) return;
    musicPlaying = true;

    // Deep ominous bass line in E minor with tritone (Bb) for tension
    const bassLine = [41.2, 41.2, 46.25, 41.2, 55, 51.91, 41.2, 38.89];
    let noteIndex = 0;

    // Create a constant low drone for atmosphere
    droneOsc = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();
    droneOsc.connect(droneGain);
    droneGain.connect(musicGain);
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.value = 27.5; // Very low A0
    droneGain.gain.value = 0.15;
    droneOsc.start();

    function playNote() {
        if (!musicPlaying) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(musicGain);

        osc.type = 'sawtooth';
        osc.frequency.value = bassLine[noteIndex];

        // Slower attack and decay for more menacing feel
        gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);

        noteIndex = (noteIndex + 1) % bassLine.length;
    }

    playNote();
    musicInterval = setInterval(playNote, 400);
}

function stopMusic() {
    musicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    if (droneOsc) {
        droneOsc.stop();
        droneOsc = null;
    }
}

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 5;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 7;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const ALIEN_PADDING = 10;
const ALIEN_START_Y = 80;
const SHIELD_COUNT = 4;

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
let lives = 3;
let level = 1;

// Simple starfield background
const stars = [];
const STAR_COUNT = 60;

function createStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            speed: Math.random() * 0.5 + 0.2,
            size: Math.random() < 0.3 ? 2 : 1
        });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
        }
    });
}

function drawBackground() {
    // Simple dark gradient
    ctx.fillStyle = '#000008';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Stars as pixels
    stars.forEach(star => {
        ctx.fillStyle = star.size > 1 ? '#666688' : '#444466';
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    });
}

// Initialize background
createStars();

// Input tracking
const keys = {
    left: false,
    right: false,
    space: false
};

// Player
const player = {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - 60,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    canShoot: true,
    shootCooldown: 0
};

// Arrays for game objects
let aliens = [];
let playerBullets = [];
let alienBullets = [];
let shields = [];
let explosionParticles = [];

// Player respawn state
let playerDead = false;
let respawnTimer = 0;
const RESPAWN_DELAY = 60; // 1 second at 60fps

// Alien movement
let alienDirection = 1;
let alienSpeed = 1;
let alienMoveDown = false;
let alienShootTimer = 0;

// Screen shake
let screenShake = 0;
let flashAlpha = 0;

// Create player explosion - SPECTACULAR!
function createPlayerExplosion(x, y) {
    // Screen shake and flash
    screenShake = 25;
    flashAlpha = 1;

    // Primary explosion - hot core
    const coreColors = ['#ffffff', '#ffffaa', '#ffff00', '#ffaa00'];
    for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.3;
        const speed = 4 + Math.random() * 8;
        explosionParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40 + Math.random() * 20,
            maxLife: 60,
            size: 4 + Math.random() * 6,
            color: coreColors[Math.floor(Math.random() * coreColors.length)],
            type: 'spark'
        });
    }

    // Secondary ring - fire
    const fireColors = ['#ff6600', '#ff4400', '#ff2200', '#ff0000'];
    for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        explosionParticles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 50 + Math.random() * 40,
            maxLife: 90,
            size: 3 + Math.random() * 5,
            color: fireColors[Math.floor(Math.random() * fireColors.length)],
            type: 'fire'
        });
    }

    // Pixel debris - ship chunks (chrome colored)
    const debrisColors = ['#88aa88', '#669966', '#aaccaa', '#557755'];
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        explosionParticles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            life: 90 + Math.random() * 60,
            maxLife: 150,
            size: 4 + Math.random() * 8,
            color: debrisColors[Math.floor(Math.random() * debrisColors.length)],
            type: 'debris',
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3
        });
    }

    // Smoke trail
    for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        explosionParticles.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 30,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            life: 80 + Math.random() * 50,
            maxLife: 130,
            size: 8 + Math.random() * 15,
            color: '#444444',
            type: 'smoke'
        });
    }

    // Delayed secondary explosions
    setTimeout(() => {
        createSecondaryExplosion(x - 20 + Math.random() * 40, y - 10 + Math.random() * 20);
    }, 100);
    setTimeout(() => {
        createSecondaryExplosion(x - 20 + Math.random() * 40, y - 10 + Math.random() * 20);
    }, 200);
    setTimeout(() => {
        createSecondaryExplosion(x - 20 + Math.random() * 40, y - 10 + Math.random() * 20);
    }, 350);
}

// Secondary smaller explosions
function createSecondaryExplosion(x, y) {
    screenShake = Math.max(screenShake, 10);
    const colors = ['#ffff00', '#ff8800', '#ff4400'];
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        explosionParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: 3 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: 'spark'
        });
    }
}

// Update explosion particles
function updateExplosionParticles() {
    // Update screen shake
    if (screenShake > 0) screenShake *= 0.9;
    if (flashAlpha > 0) flashAlpha *= 0.85;

    explosionParticles = explosionParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'smoke') {
            p.vy -= 0.02; // smoke rises
            p.vx *= 0.99;
            p.size *= 1.01; // smoke expands
        } else if (p.type === 'debris') {
            p.vy += 0.15; // heavier gravity
            p.rotation += p.rotSpeed;
        } else {
            p.vy += 0.08; // normal gravity
        }

        p.vx *= 0.98; // drag
        p.life--;
        return p.life > 0;
    });
}

// Draw explosion particles
function drawExplosionParticles() {
    explosionParticles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;

        if (p.type === 'debris') {
            // Rotating pixel debris
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            // Chrome highlight
            ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size - 1, 1);
            ctx.restore();
        } else if (p.type === 'smoke') {
            // Fuzzy smoke
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * 0.4;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else if (p.type === 'spark') {
            // Bright sparks - pixel style
            ctx.fillStyle = p.color;
            const s = p.size * alpha;
            ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        } else {
            // Fire particles
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size * alpha, p.size * alpha);
        }
    });
    ctx.globalAlpha = 1;
}

// Draw flash effect
function drawFlash() {
    if (flashAlpha > 0.01) {
        ctx.fillStyle = `rgba(255, 255, 200, ${flashAlpha * 0.7})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

// Initialize aliens
function createAliens() {
    aliens = [];
    const startX = (CANVAS_WIDTH - (ALIEN_COLS * (ALIEN_WIDTH + ALIEN_PADDING))) / 2;

    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIEN_COLS; col++) {
            aliens.push({
                x: startX + col * (ALIEN_WIDTH + ALIEN_PADDING),
                y: ALIEN_START_Y + row * (ALIEN_HEIGHT + ALIEN_PADDING) + (level - 1) * 30,
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
                row: row,
                alive: true
            });
        }
    }
}

// Initialize shields
function createShields() {
    shields = [];
    const shieldWidth = 80;
    const shieldHeight = 60;
    const shieldY = CANVAS_HEIGHT - 150;
    const spacing = CANVAS_WIDTH / (SHIELD_COUNT + 1);

    for (let i = 0; i < SHIELD_COUNT; i++) {
        const shieldX = spacing * (i + 1) - shieldWidth / 2;
        const pixels = [];

        // Create pixel grid for destructible shield
        for (let py = 0; py < shieldHeight; py += 4) {
            for (let px = 0; px < shieldWidth; px += 4) {
                // Create arch shape
                const centerX = shieldWidth / 2;
                const distFromCenter = Math.abs(px - centerX);
                const archCutout = py > shieldHeight * 0.6 && distFromCenter < shieldWidth * 0.25;

                if (!archCutout) {
                    pixels.push({
                        x: px,
                        y: py,
                        alive: true
                    });
                }
            }
        }

        shields.push({
            x: shieldX,
            y: shieldY,
            width: shieldWidth,
            height: shieldHeight,
            pixels: pixels
        });
    }
}

// Pixel size for retro look
const PX = 4;

// Draw a chrome pixel block with shading
function drawChromePixel(px, py, baseColor, highlight) {
    // Base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(px, py, PX, PX);
    // Top-left highlight
    if (highlight) {
        ctx.fillStyle = highlight;
        ctx.fillRect(px, py, PX - 1, 1);
        ctx.fillRect(px, py, 1, PX - 1);
    }
}

// Classic Space Invaders cannon shape - chrome styled
const playerSprite = [
    '      ##      ',
    '      ##      ',
    '    ######    ',
    '    ######    ',
    '  ##########  ',
    '  ##########  ',
    '##############',
    '##############',
];

// Draw player ship - Pixel art with chrome shading
function drawPlayer() {
    if (playerDead) return;

    const spriteWidth = playerSprite[0].length;
    const spriteHeight = playerSprite.length;
    const startX = player.x + (player.width - spriteWidth * PX) / 2;
    const startY = player.y + (player.height - spriteHeight * PX) / 2;

    for (let row = 0; row < spriteHeight; row++) {
        for (let col = 0; col < spriteWidth; col++) {
            if (playerSprite[row][col] === '#') {
                const px = startX + col * PX;
                const py = startY + row * PX;

                // Chrome gradient effect based on position
                const shade = (col / spriteWidth);
                const r = Math.floor(100 + shade * 100 + (1 - shade) * 50);
                const g = Math.floor(120 + shade * 100 + (1 - shade) * 50);
                const b = Math.floor(100 + shade * 100 + (1 - shade) * 50);

                const highlight = row < 2 ? '#eeffee' : (row < 4 ? '#ccddcc' : null);
                drawChromePixel(px, py, `rgb(${r},${g},${b})`, highlight);
            }
        }
    }

    // Cannon glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#88ff88';
    ctx.fillStyle = '#aaffaa';
    ctx.fillRect(startX + 6 * PX, startY - 2, PX * 2, 3);
    ctx.shadowBlur = 0;
}

// Animation frame counter for aliens
let alienAnimFrame = 0;
setInterval(() => { alienAnimFrame = (alienAnimFrame + 1) % 2; }, 500);

// Classic Space Invaders sprites - two frames each
const squidSprite = [
    ['    ##    ', '    ##    '],
    ['   ####   ', '   ####   '],
    ['  ######  ', '  ######  '],
    [' ## ## ## ', ' ## ## ## '],
    [' ######## ', ' ######## '],
    ['  # ## #  ', '# # ## # #'],
    [' #      # ', '  #    #  '],
    ['  #    #  ', ' #      # '],
];

const crabSprite = [
    ['  #     #  ', ' #       # '],
    ['   #   #   ', '  #     #  '],
    ['  #######  ', '  #######  '],
    [' ## ### ## ', ' ## ### ## '],
    ['###########', '###########'],
    ['# ####### #', '# ####### #'],
    ['# #     # #', '  #     #  '],
    ['   ## ##   ', '##       ##'],
];

const octopusSprite = [
    ['   ####   ', '   ####   '],
    [' ######## ', ' ######## '],
    ['##########', '##########'],
    ['### ## ###', '### ## ###'],
    ['##########', '##########'],
    ['  ##  ##  ', '  # ## #  '],
    [' ##    ## ', ' # #  # # '],
    ['##      ##', '  #    #  '],
];

// Draw a pixel sprite with chrome effect
function drawChromeSprite(sprite, x, y, baseR, baseG, baseB, frame) {
    const spriteData = sprite.map(row => row[frame]);
    const spriteWidth = spriteData[0].length;
    const spriteHeight = spriteData.length;

    for (let row = 0; row < spriteHeight; row++) {
        for (let col = 0; col < spriteWidth; col++) {
            if (spriteData[row][col] === '#') {
                const px = x + col * PX;
                const py = y + row * PX;

                // Chrome shading - lighter in center, darker at edges
                const centerDist = Math.abs(col - spriteWidth / 2) / (spriteWidth / 2);
                const rowShade = 1 - (row / spriteHeight) * 0.3;
                const shade = (1 - centerDist * 0.5) * rowShade;

                const r = Math.floor(baseR * 0.4 + baseR * shade * 0.8);
                const g = Math.floor(baseG * 0.4 + baseG * shade * 0.8);
                const b = Math.floor(baseB * 0.4 + baseB * shade * 0.8);

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(px, py, PX, PX);

                // Chrome highlight on top rows
                if (row < 3) {
                    ctx.fillStyle = `rgba(255,255,255,${0.3 * shade})`;
                    ctx.fillRect(px, py, PX - 1, 1);
                }
            }
        }
    }
}

// Draw aliens - Classic pixel art with chrome shading
function drawAliens() {
    aliens.forEach(alien => {
        if (!alien.alive) return;

        const x = alien.x;
        const y = alien.y;

        if (alien.row === 0) {
            // Top row - Squid (red chrome)
            drawChromeSprite(squidSprite, x, y, 255, 100, 100, alienAnimFrame);
        } else if (alien.row < 3) {
            // Middle rows - Crab (gold/yellow chrome)
            drawChromeSprite(crabSprite, x, y, 255, 220, 100, alienAnimFrame);
        } else {
            // Bottom rows - Octopus (cyan chrome)
            drawChromeSprite(octopusSprite, x, y, 100, 220, 255, alienAnimFrame);
        }
    });
}

// Draw shields - chunky pixel style with chrome
function drawShields() {
    shields.forEach(shield => {
        shield.pixels.forEach(pixel => {
            if (pixel.alive) {
                const px = shield.x + pixel.x;
                const py = shield.y + pixel.y;
                // Chrome gradient based on position
                const shade = (pixel.x / 80);
                const r = Math.floor(60 + shade * 80);
                const g = Math.floor(90 + shade * 100);
                const b = Math.floor(60 + shade * 80);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(px, py, 4, 4);
            }
        });
    });
}

// Draw bullets - simple pixel style
function drawBullets() {
    // Player bullets - white/green
    ctx.fillStyle = '#aaffaa';
    playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Alien bullets - red/orange zigzag
    alienBullets.forEach(bullet => {
        const flash = Math.floor(Date.now() / 100) % 2;
        ctx.fillStyle = flash ? '#ff6644' : '#ffaa44';
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
}

// Draw UI - retro pixel style
function drawUI() {
    ctx.font = '16px Courier New';
    ctx.textAlign = 'left';

    // Score with chrome gradient text
    ctx.fillStyle = '#88aa88';
    ctx.fillText('SCORE', 30, 25);
    ctx.fillStyle = '#aaffaa';
    ctx.fillText(String(score).padStart(6, '0'), 100, 25);

    ctx.fillStyle = '#88aa88';
    ctx.fillText('HI', 30, 50);
    ctx.fillStyle = '#ffcc66';
    ctx.fillText(String(highScore).padStart(6, '0'), 60, 50);

    // Right side
    ctx.textAlign = 'right';
    ctx.fillStyle = '#88aa88';
    ctx.fillText('LEVEL', CANVAS_WIDTH - 60, 25);
    ctx.fillStyle = '#aaffaa';
    ctx.fillText(String(level), CANVAS_WIDTH - 30, 25);

    // Lives as pixel ships
    ctx.fillStyle = '#88aa88';
    ctx.fillText('LIVES', CANVAS_WIDTH - 60, 50);

    for (let i = 0; i < lives - 1; i++) {
        const lx = CANVAS_WIDTH - 120 - i * 20;
        // Mini pixel cannon
        ctx.fillStyle = '#99bb99';
        ctx.fillRect(lx + 4, 42, 4, 4);
        ctx.fillRect(lx + 2, 46, 8, 4);
        ctx.fillRect(lx, 50, 12, 4);
    }
}

// Draw start screen - retro pixel style
function drawStartScreen() {
    ctx.textAlign = 'center';

    // Title with chrome effect
    ctx.font = 'bold 48px Courier New';
    ctx.fillStyle = '#446644';
    ctx.fillText('SPACE INVADERS', CANVAS_WIDTH / 2 + 2, 182);
    ctx.fillStyle = '#88cc88';
    ctx.fillText('SPACE INVADERS', CANVAS_WIDTH / 2, 180);

    // Subtitle
    ctx.font = '24px Courier New';
    ctx.fillStyle = '#666688';
    ctx.fillText('CHROME EDITION', CANVAS_WIDTH / 2, 220);

    // Pulsing start text
    const pulse = Math.floor(Date.now() / 500) % 2;
    ctx.fillStyle = pulse ? '#aaffaa' : '#668866';
    ctx.fillText('PRESS ENTER TO START', CANVAS_WIDTH / 2, 300);

    // Controls
    ctx.font = '16px Courier New';
    ctx.fillStyle = '#666666';
    ctx.fillText('CONTROLS', CANVAS_WIDTH / 2, 380);
    ctx.fillStyle = '#888888';
    ctx.fillText('< > MOVE    SPACE FIRE', CANVAS_WIDTH / 2, 410);

    // High score
    ctx.fillStyle = '#888844';
    ctx.fillText('HIGH SCORE', CANVAS_WIDTH / 2, 480);
    ctx.fillStyle = '#ffcc66';
    ctx.font = '20px Courier New';
    ctx.fillText(String(highScore).padStart(6, '0'), CANVAS_WIDTH / 2, 510);
}

// Draw game over screen - retro pixel style
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.textAlign = 'center';

    // Game over text
    ctx.font = 'bold 48px Courier New';
    ctx.fillStyle = '#442222';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2 + 2, 222);
    ctx.fillStyle = '#cc4444';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 220);

    // Score
    ctx.font = '20px Courier New';
    ctx.fillStyle = '#666666';
    ctx.fillText('SCORE', CANVAS_WIDTH / 2, 290);
    ctx.fillStyle = '#aaaaaa';
    ctx.font = 'bold 32px Courier New';
    ctx.fillText(String(score).padStart(6, '0'), CANVAS_WIDTH / 2, 330);

    if (score >= highScore) {
        ctx.fillStyle = '#ffcc44';
        ctx.font = '20px Courier New';
        ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, 380);
    }

    // Pulsing restart
    const pulse = Math.floor(Date.now() / 500) % 2;
    ctx.fillStyle = pulse ? '#aaffaa' : '#446644';
    ctx.font = '20px Courier New';
    ctx.fillText('PRESS ENTER TO CONTINUE', CANVAS_WIDTH / 2, 450);
}

// Update player
function updatePlayer() {
    // Handle respawn timer
    if (playerDead) {
        respawnTimer--;
        if (respawnTimer <= 0) {
            playerDead = false;
            player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
        }
        return; // Don't process input while dead
    }

    if (keys.left && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if (keys.right && player.x < CANVAS_WIDTH - player.width) {
        player.x += PLAYER_SPEED;
    }

    // Shooting cooldown
    if (player.shootCooldown > 0) {
        player.shootCooldown--;
    } else {
        player.canShoot = true;
    }

    // Shoot
    if (keys.space && player.canShoot) {
        playerBullets.push({
            x: player.x + player.width / 2 - BULLET_WIDTH / 2,
            y: player.y
        });
        player.canShoot = false;
        player.shootCooldown = 15;
        playShootSound();
    }
}

// Update aliens
function updateAliens() {
    if (aliens.filter(a => a.alive).length === 0) {
        // Level complete
        level++;
        alienSpeed = 1 + level * 0.5;
        createAliens();
        createShields();
        playLevelUpSound();
        return;
    }

    // Find boundaries
    let leftMost = CANVAS_WIDTH;
    let rightMost = 0;
    let bottomMost = 0;

    aliens.forEach(alien => {
        if (alien.alive) {
            if (alien.x < leftMost) leftMost = alien.x;
            if (alien.x + alien.width > rightMost) rightMost = alien.x + alien.width;
            if (alien.y + alien.height > bottomMost) bottomMost = alien.y + alien.height;
        }
    });

    // Check if aliens reached player level
    if (bottomMost >= player.y) {
        createPlayerExplosion(player.x + player.width / 2, player.y + player.height / 2);
        playPlayerExplosionSound();
        gameOver();
        return;
    }

    // Move aliens
    if (alienMoveDown) {
        aliens.forEach(alien => {
            if (alien.alive) {
                alien.y += 20;
            }
        });
        alienMoveDown = false;
        alienDirection *= -1;
    } else {
        let hitEdge = false;

        aliens.forEach(alien => {
            if (alien.alive) {
                alien.x += alienSpeed * alienDirection;

                if (alien.x <= 0 || alien.x + alien.width >= CANVAS_WIDTH) {
                    hitEdge = true;
                }
            }
        });

        if (hitEdge) {
            alienMoveDown = true;
        }
    }

    // Alien shooting
    alienShootTimer++;
    if (alienShootTimer > 60 - level * 5) {
        alienShootTimer = 0;

        // Get bottom-most aliens in each column
        const bottomAliens = [];
        for (let col = 0; col < ALIEN_COLS; col++) {
            for (let row = ALIEN_ROWS - 1; row >= 0; row--) {
                const alien = aliens[row * ALIEN_COLS + col];
                if (alien && alien.alive) {
                    bottomAliens.push(alien);
                    break;
                }
            }
        }

        // Random alien shoots
        if (bottomAliens.length > 0) {
            const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
            alienBullets.push({
                x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
                y: shooter.y + shooter.height
            });
        }
    }
}

// Update bullets
function updateBullets() {
    // Player bullets
    playerBullets = playerBullets.filter(bullet => {
        bullet.y -= BULLET_SPEED;
        return bullet.y > -BULLET_HEIGHT;
    });

    // Alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += BULLET_SPEED - 2;
        return bullet.y < CANVAS_HEIGHT;
    });
}

// Check collisions
function checkCollisions() {
    // Player bullets vs aliens
    playerBullets.forEach((bullet, bulletIndex) => {
        aliens.forEach(alien => {
            if (alien.alive && rectCollision(bullet, BULLET_WIDTH, BULLET_HEIGHT, alien, alien.width, alien.height)) {
                alien.alive = false;
                playerBullets.splice(bulletIndex, 1);
                playExplosionSound();

                // Score based on row
                if (alien.row === 0) {
                    score += 30;
                } else if (alien.row < 3) {
                    score += 20;
                } else {
                    score += 10;
                }
            }
        });
    });

    // Alien bullets vs player (only if not already dead)
    if (!playerDead) {
        alienBullets.forEach((bullet, bulletIndex) => {
            if (rectCollision(bullet, BULLET_WIDTH, BULLET_HEIGHT, player, player.width, player.height)) {
                alienBullets.splice(bulletIndex, 1);
                lives--;

                // Create explosion at player position
                createPlayerExplosion(player.x + player.width / 2, player.y + player.height / 2);
                playPlayerExplosionSound();

                if (lives <= 0) {
                    gameOver();
                } else {
                    // Start respawn timer
                    playerDead = true;
                    respawnTimer = RESPAWN_DELAY;
                }
            }
        });
    }

    // Bullets vs shields
    shields.forEach(shield => {
        // Player bullets
        playerBullets.forEach((bullet, bulletIndex) => {
            shield.pixels.forEach(pixel => {
                if (pixel.alive) {
                    const pixelX = shield.x + pixel.x;
                    const pixelY = shield.y + pixel.y;

                    if (bullet.x < pixelX + 4 && bullet.x + BULLET_WIDTH > pixelX &&
                        bullet.y < pixelY + 4 && bullet.y + BULLET_HEIGHT > pixelY) {
                        pixel.alive = false;
                        playerBullets.splice(bulletIndex, 1);
                    }
                }
            });
        });

        // Alien bullets
        alienBullets.forEach((bullet, bulletIndex) => {
            shield.pixels.forEach(pixel => {
                if (pixel.alive) {
                    const pixelX = shield.x + pixel.x;
                    const pixelY = shield.y + pixel.y;

                    if (bullet.x < pixelX + 4 && bullet.x + BULLET_WIDTH > pixelX &&
                        bullet.y < pixelY + 4 && bullet.y + BULLET_HEIGHT > pixelY) {
                        pixel.alive = false;
                        alienBullets.splice(bulletIndex, 1);
                    }
                }
            });
        });

        // Aliens vs shields
        aliens.forEach(alien => {
            if (alien.alive) {
                shield.pixels.forEach(pixel => {
                    if (pixel.alive) {
                        const pixelX = shield.x + pixel.x;
                        const pixelY = shield.y + pixel.y;

                        if (alien.x < pixelX + 4 && alien.x + alien.width > pixelX &&
                            alien.y < pixelY + 4 && alien.y + alien.height > pixelY) {
                            pixel.alive = false;
                        }
                    }
                });
            }
        });
    });
}

// Rectangle collision helper
function rectCollision(obj1, w1, h1, obj2, w2, h2) {
    return obj1.x < obj2.x + w2 &&
           obj1.x + w1 > obj2.x &&
           obj1.y < obj2.y + h2 &&
           obj1.y + h1 > obj2.y;
}

// Game over
function gameOver() {
    gameState = 'gameover';
    stopMusic();
    playGameOverSound();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceInvadersHighScore', highScore);
    }
}

// Reset game
function resetGame() {
    initAudio();

    score = 0;
    lives = 3;
    level = 1;
    alienSpeed = 1;
    alienDirection = 1;
    alienMoveDown = false;
    alienShootTimer = 0;

    player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    player.canShoot = true;
    player.shootCooldown = 0;

    playerBullets = [];
    alienBullets = [];
    explosionParticles = [];
    playerDead = false;
    respawnTimer = 0;

    createAliens();
    createShields();

    gameState = 'playing';
    startMusic();
}

// CRT scanline and grain effect
function drawScanlines() {
    // Horizontal scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < CANVAS_HEIGHT; y += 3) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 1);
    }

    // Film grain effect
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for performance
        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // Subtle vignette
    const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.5,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.9
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Main game loop
function gameLoop() {
    // Apply screen shake
    ctx.save();
    if (screenShake > 0.5) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
    }

    // Draw simple background with stars
    updateStars();
    drawBackground();

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        updatePlayer();
        updateAliens();
        updateBullets();
        checkCollisions();
        updateExplosionParticles();

        drawShields();
        drawAliens();
        drawPlayer();
        drawBullets();
        drawExplosionParticles();
        drawFlash();
        drawUI();
    } else if (gameState === 'gameover') {
        updateExplosionParticles();

        drawShields();
        drawAliens();
        drawPlayer();
        drawBullets();
        drawExplosionParticles();
        drawFlash();
        drawUI();
        drawGameOver();
    }

    ctx.restore();

    // Draw CRT scanline effect
    drawScanlines();

    requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    }
    if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
    }
    if (e.key === 'Enter') {
        if (gameState === 'start' || gameState === 'gameover') {
            resetGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
    if (e.key === ' ') {
        keys.space = false;
    }
});

// Start the game
gameLoop();
