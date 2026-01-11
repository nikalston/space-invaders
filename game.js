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

// Create player explosion
function createPlayerExplosion(x, y) {
    const colors = ['#ff0000', '#ff6600', '#ffff00', '#ffffff', '#ff3333', '#ffaa00'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 6;
        explosionParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 60 + Math.random() * 30,
            maxLife: 90,
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // Add some debris chunks
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        explosionParticles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 80 + Math.random() * 40,
            maxLife: 120,
            size: 5 + Math.random() * 8,
            color: '#33ff33',
            isDebris: true
        });
    }
}

// Update explosion particles
function updateExplosionParticles() {
    explosionParticles = explosionParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
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

        if (p.isDebris) {
            // Draw debris as rectangles
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 0.6);
        } else {
            // Draw particles as circles
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;
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

// Draw player ship
function drawPlayer() {
    if (playerDead) return; // Don't draw if dead

    ctx.fillStyle = '#33ff33';

    // Main body
    ctx.fillRect(player.x, player.y + 10, player.width, player.height - 10);

    // Cannon
    ctx.fillRect(player.x + player.width / 2 - 3, player.y, 6, 15);

    // Wings
    ctx.fillRect(player.x - 5, player.y + player.height - 8, 10, 8);
    ctx.fillRect(player.x + player.width - 5, player.y + player.height - 8, 10, 8);
}

// Draw aliens
function drawAliens() {
    aliens.forEach(alien => {
        if (!alien.alive) return;

        // Different colors based on row
        if (alien.row === 0) {
            ctx.fillStyle = '#ff3333'; // Top row - red
        } else if (alien.row < 3) {
            ctx.fillStyle = '#ffff33'; // Middle rows - yellow
        } else {
            ctx.fillStyle = '#33ffff'; // Bottom rows - cyan
        }

        // Draw alien body
        const x = alien.x;
        const y = alien.y;
        const w = alien.width;
        const h = alien.height;

        // Body
        ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.5);

        // Head
        ctx.fillRect(x + w * 0.3, y, w * 0.4, h * 0.3);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.35, y + h * 0.1, w * 0.1, h * 0.1);
        ctx.fillRect(x + w * 0.55, y + h * 0.1, w * 0.1, h * 0.1);

        // Tentacles
        if (alien.row === 0) {
            ctx.fillStyle = '#ff3333';
        } else if (alien.row < 3) {
            ctx.fillStyle = '#ffff33';
        } else {
            ctx.fillStyle = '#33ffff';
        }
        ctx.fillRect(x, y + h * 0.5, w * 0.2, h * 0.3);
        ctx.fillRect(x + w * 0.8, y + h * 0.5, w * 0.2, h * 0.3);
        ctx.fillRect(x + w * 0.1, y + h * 0.7, w * 0.15, h * 0.3);
        ctx.fillRect(x + w * 0.75, y + h * 0.7, w * 0.15, h * 0.3);
    });
}

// Draw shields
function drawShields() {
    ctx.fillStyle = '#33ff33';
    shields.forEach(shield => {
        shield.pixels.forEach(pixel => {
            if (pixel.alive) {
                ctx.fillRect(shield.x + pixel.x, shield.y + pixel.y, 4, 4);
            }
        });
    });
}

// Draw bullets
function drawBullets() {
    // Player bullets
    ctx.fillStyle = '#ffffff';
    playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Alien bullets
    ctx.fillStyle = '#ff6666';
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
}

// Draw UI
function drawUI() {
    ctx.fillStyle = '#33ff33';
    ctx.font = '20px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`HIGH: ${highScore}`, 20, 55);

    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${lives}`, CANVAS_WIDTH - 20, 30);
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH - 20, 55);

    // Draw lives as ships
    for (let i = 0; i < lives - 1; i++) {
        const lx = CANVAS_WIDTH - 100 - i * 35;
        ctx.fillRect(lx, 40, 25, 10);
        ctx.fillRect(lx + 10, 35, 5, 8);
    }
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = '#33ff33';
    ctx.font = '48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE INVADERS', CANVAS_WIDTH / 2, 200);

    ctx.font = '24px Courier New';
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 300);

    ctx.font = '18px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Controls:', CANVAS_WIDTH / 2, 380);
    ctx.fillText('← → Arrow Keys to Move', CANVAS_WIDTH / 2, 410);
    ctx.fillText('SPACE to Shoot', CANVAS_WIDTH / 2, 440);

    ctx.fillStyle = '#ffff33';
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2, 500);
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ff3333';
    ctx.font = '48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 250);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Courier New';
    ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, 320);

    if (score >= highScore) {
        ctx.fillStyle = '#ffff33';
        ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, 360);
    }

    ctx.fillStyle = '#33ff33';
    ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, 420);
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

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
        drawUI();
    } else if (gameState === 'gameover') {
        updateExplosionParticles();

        drawShields();
        drawAliens();
        drawPlayer();
        drawBullets();
        drawExplosionParticles();
        drawUI();
        drawGameOver();
    }

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
