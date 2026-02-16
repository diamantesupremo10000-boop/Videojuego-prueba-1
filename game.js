const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

// Ajustar tamaño del canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Jugador (Diamante Azul)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 5,
    dx: 0,
    dy: 0
};

// Fruto del espíritu (Gálatas 5:22, 23)
const qualities = ["Amor", "Gozo", "Paz", "Paciencia", "Benignidad", "Bondad", "Fe", "Apacibilidad", "Autodominio"];
let gems = [];
let score = 0;

// Generar gemas aleatorias
function initGems() {
    qualities.forEach(quality => {
        gems.push({
            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,
            size: 10,
            quality: quality,
            collected: false,
            glow: 0
        });
    });
}
initGems();

// Controles
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function update() {
    // Movimiento
    if ((keys['w'] || keys['arrowup']) && player.y - player.size > 0) player.y -= player.speed;
    if ((keys['s'] || keys['arrowdown']) && player.y + player.size < canvas.height) player.y += player.speed;
    if ((keys['a'] || keys['arrowleft']) && player.x - player.size > 0) player.x -= player.speed;
    if ((keys['d'] || keys['arrowright']) && player.x + player.size < canvas.width) player.x += player.speed;

    // Colisiones con gemas
    gems.forEach(gem => {
        if (!gem.collected) {
            const dist = Math.hypot(player.x - gem.x, player.y - gem.y);
            if (dist < player.size + gem.size) {
                gem.collected = true;
                score++;
                scoreEl.innerText = `Cualidades encontradas: ${score} / 9`;
                messageEl.innerText = `¡Has resonado con la cualidad: ${gem.quality}!`;
                messageEl.style.color = "#0077c2";
                messageEl.style.fontWeight = "bold";
                
                if (score === 9) {
                    messageEl.innerText = "¡Has completado el fruto del espíritu! Sigue cultivando estas hermosas cualidades.";
                }
            }
        }
    });
}

// Función auxiliar para dibujar diamantes (rombos)
function drawDiamond(x, y, size, fillStyle, shadowColor) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar cuadrícula tenue (estilo mapa holográfico)
    ctx.strokeStyle = "rgba(0, 191, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 50) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }

    // Dibujar Gemas (Ecos/Resonancias)
    const time = Date.now() * 0.005;
    gems.forEach(gem => {
        if (!gem.collected) {
            // Animación de flotación y brillo
            const floatY = gem.y + Math.sin(time + gem.x) * 5;
            drawDiamond(gem.x, floatY, gem.size + Math.sin(time*2)*2, '#ffffff', '#00bfff');
            drawDiamond(gem.x, floatY, gem.size - 4, '#00bfff', 'transparent');
        }
    });

    // Dibujar Jugador (Diamante principal)
    drawDiamond(player.x, player.y, player.size, '#0077c2', '#00d2ff');
    drawDiamond(player.x, player.y, player.size - 8, '#ffffff', 'transparent');
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
