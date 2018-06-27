let entities;
let newEntities;

let presets = [
    {
        food: 30,
        prey: 20,
        predator: 10
    },
    {}
];
let selectedPreset = 0;

let paused = false;
let selected = 'prey';


function setup() {
    // Set up canvas
    let sketch = document.getElementById('sketch');
    let canvas = createCanvas(sketch.offsetWidth, sketch.offsetHeight);
    canvas.parent(sketch);
    resizeCanvas(sketch.offsetWidth, sketch.offsetHeight, true);

    // Initialize drawing modes
    ellipseMode(RADIUS);

    // Spawn entities
    reset();
}

function draw() {
    background(0);

    // Spawn food
    if (!paused && !toLimitEntities() && random() < 0.5) {
        spawnEntity(random(width), random(height), 'food');
    }

    // Update and display all entities
    for (let i = entities.length - 1; i >= 0; i--) {
        let e = entities[i];
        if (!e.dead) e.act(entities);

        // Remove if dead
        if (e.dead) {
            entities.splice(i, 1);
            e.onDeath();
        }
    }

    // Add new entities
    if (!paused) {
        entities = entities.concat(newEntities);
        newEntities = [];
    }
}

function keyPressed() {
    // Change preset
    let n = parseInt(key);
    if (n) {
        n--;
        if (n < presets.length) selectedPreset = n;
        reset();
    }

    // Toggle pause state
    if (key === ' ') paused = !paused;

    // Reset simulation
    if (key === 'R') reset();

    // Entity selection
    if (key === 'F') selected = 'food';
    if (key === 'B') selected = 'prey';
    if (key === 'P') selected = 'predator';
}

function mouseDragged() {
    spawnEntity(mouseX, mouseY, selected);
}

function mousePressed() {
    spawnEntity(mouseX, mouseY, selected);
}


// Return whether entity count is high enough to begin slowdown
function toLimitEntities() {
    return entities.length + newEntities.length >= 600;
}

// Reset entities
function reset() {
    entities = [];
    newEntities = [];

    // Spawn entities from preset
    let preset = presets[selectedPreset];
    let keys = Object.keys(preset);
    for (let i = 0; i < keys.length; i++) {
        let template = keys[i];
        let count = preset[template];
        for (let j = 0; j < count; j++) {
            spawnEntity(random(width), random(height), template);
        }
    }
}

// Spawn entity at position
function spawnEntity(x, y, type) {
    let e = new Entity(x, y);
    applyTemplate(e, ENTITY[type]);
    e.init();
    newEntities.push(e);
}
