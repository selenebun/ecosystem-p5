let entities;
let newEntities;


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


// Reset entities
function reset() {
    entities = [];
    newEntities = [];

    // Spawn example entities
    for (let i = 0; i < 100; i++) {
        let e = new Entity(random(width), random(height));
        applyTemplate(e, random() < 0.5 ? ENTITY.prey : ENTITY.food);
        e.init();
        entities.push(e);
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
