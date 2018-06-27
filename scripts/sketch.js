let entities;
let newEntities;

let presets = [
    {
        food: 30,
        prey: 20,
        predator: 10
    }
];
let selectedPreset = 0;


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
    spawnFood(0.2);

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
    entities = entities.concat(newEntities);
    newEntities = [];
}

function keyPressed() {
    // Change preset
    let n = parseInt(key);
    if (n) {
        n--;
        if (n < presets.length) selectedPreset = n;
        reset();
    }

    // Reset simulation
    if (key === 'R') reset();
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
            let e = new Entity(random(width), random(height));
            applyTemplate(e, ENTITY[template]);
            e.init();
            entities.push(e);
        }
    }
}

// Spawn food on screen
function spawnFood(chance) {
    if (random() < chance) {
        let e = new Entity(random(width), random(height));
        applyTemplate(e, ENTITY.food);
        e.init();
        newEntities.push(e);
    }
}
