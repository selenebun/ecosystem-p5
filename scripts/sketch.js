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

let dispGraph = true;
let paused = false;
let selected = 'prey';

let hist;
let maxHist;
let maxPopulation = 0;


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

    // Set maximum history based on canvas size
    maxHist = ceil(width / 4);
}

function draw() {
    background(0);

    // Update history with current population values
    updateHistory();

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

    // Display population history
    if (dispGraph) lineGraph();
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

    // Toggle graph
    if (key === 'G') dispGraph = !dispGraph;

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


// Count each type of entity
function countTypes(arr) {
    let types = {};

    // Add all types
    let keys = Object.keys(ENTITY);
    for (let i = 0; i < keys.length; i++) {
        types[keys[i]] = 0;
    }

    // Count each entity
    for (let i = 0; i < arr.length; i++) {
        types[arr[i].type]++;
    }

    // Update maximum entity count
    if (entities.length > maxPopulation) maxPopulation = entities.length;

    return types;
}

// Draw a line graph of each entity type population
function lineGraph() {
    // Transparent rect behind graph
    fill(0, 127);
    noStroke();
    rect(0, 25, hist.length, 150);

    // Plot the history of each type
    let types = Object.keys(hist[0]);
    noFill();
    strokeWeight(2);
    for (let i = 0; i < types.length; i++) {
        let type = types[i];

        stroke(ENTITY[type].color);
        beginShape();
        for (let x = 0; x < hist.length; x++) {
            let y = map(hist[x][type], 0, maxPopulation, 175, 25);
            vertex(x, y);
        }
        endShape();
    }
    strokeWeight(1);

    // Draw line at current draw location
    stroke(204);
    line(hist.length, 25, hist.length, 175);
}

// Return whether entity count is high enough to begin slowdown
function toLimitEntities() {
    return entities.length + newEntities.length >= 600;
}

// Update history based on entities
function updateHistory() {
    hist.push(countTypes(entities));
    if (hist.length > maxHist) hist.shift();
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

    // Reset the history
    hist = [];
}

// Spawn entity at position
function spawnEntity(x, y, type) {
    let e = new Entity(x, y);
    applyTemplate(e, ENTITY[type]);
    e.init();
    newEntities.push(e);
}
