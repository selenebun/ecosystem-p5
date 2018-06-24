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

    // Update and display all entities
    for (let i = entities.length - 1; i >= 0; i--) {
        let e = entities[i];
        e.act();

        // Remove if dead
        if (e.dead) {
            entities.splice(i, 1);
            e.onDeath();
        }
    }
}


// Reset entities
function reset() {
    entities = [];
    newEntities = [];

    // Spawn example entities
    for (let i = 0; i < 100; i++) {
        let e = new Entity(random(width), random(height));
        applyTemplate(e, random() < 0.5 ? ENTITY.prey : ENTITY.food);
        entities.push(e);
    }
}
