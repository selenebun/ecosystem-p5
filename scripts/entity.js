class Entity {
    constructor(x, y) {
        // Display
        this.color = '#ECF0F1';
        this.model = MODEL.circle;

        // Misc
        this.dead = false;
        this.type = 'entity';

        // Physics
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.r = 10;

        // Stats
        this.maxSpeed = 4;
    }

    // All operations to do every tick
    act(entities) {
        this.steer(entities);
        this.update();
        this.borders();
        this.display();
    }

    // Behavior around map edges
    borders() {}

    // Display entity
    display() {
        this.model();

        // Display hitbox
        if (keyIsPressed) {
            fill(255, 63);
            stroke(255);
            ellipse(this.pos.x, this.pos.y, this.r, this.r);
        }
    }

    // Apply steering behaviors
    steer(entities) {}

    // Update physics
    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
}
