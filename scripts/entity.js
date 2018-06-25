class Entity {
    constructor(x, y) {
        // AI
        this.perception = 100;
        this.prioritySeek = 1;
        //this.toArrive = [];
        //this.toEat = [];
        this.toSeek = [];

        // Display
        this.color = '#ECF0F1';
        this.model = MODEL.circle;

        // Misc
        this.canStarve = true;
        this.dead = false;
        this.hunger = 200;
        this.type = 'entity';

        // Physics
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.r = 10;
        this.maxForce = 0.1;
        this.maxSpeed = 4;
    }

    // All operations to do every tick
    act(entities) {
        this.steer(entities);
        this.update();
        this.borders();
        this.display();
    }

    // Adjust steering
    adjust(steer) {
        steer.setMag(this.maxSpeed);
        steer.sub(this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    // Apply a force
    applyForce(f) {
        this.acc.add(f);
    }

    // Behavior around map edges
    borders() {}

    // Display entity
    display() {
        this.model();

        // Display hitbox
        if (keyIsDown(72)) {
            fill(255, 63);
            stroke(255);
            ellipse(this.pos.x, this.pos.y, this.r, this.r);
        }
    }

    // Return the nearest entity
    getNearest(arr, types) {
        if (typeof types === 'undefined') types = [];
        let bestDist = 1000000;

        // Find smallest distance
        let result = null;
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];

            // Skip self
            if (e === this) continue;

            // Check if valid type
            if (types.indexOf(e.type) === -1) continue;

            // Do not consider entities beyond perception range
            if (circleCircle(this.pos, this.perception, e.pos, e.r)) continue;

            // Compare distance to best distance
            let dist = e.pos.dist(this.pos);
            if (dist < bestDist) {
                bestDist = dist;
                result = e;
            }
        }

        return result;
    }

    // Return all visible entities
    getVisible(arr, types) {
        if (typeof types === 'undefined') types = [];

        // Find all entities within perception range
        let results = [];
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];

            // Skip self
            if (e === this) continue;

            // Check if valid type
            if (types.indexOf(e.type) === -1) continue;

            // Check if inside perception range
            if (circleCircle(this.pos, this.perception, e.pos, e.r)) {
                results.push(e);
            }
        }

        return results;
    }


    // Any dynamic initializations to do
    init() {
        this.color = color(this.color);
        this.maxHunger = this.hunger;
    }

    // Events
    onDeath() {}

    // Seek towards a target vector
    seek(v) {
        let desired = p5.Vector.sub(v, this.pos);
        return this.adjust(desired);
    }

    // Apply steering behaviors
    steer(entities) {
        // Seeking
        let target = this.getNearest(entities, this.toSeek);
        if (target) {
            let seek = this.seek(target.pos);
            seek.mult(this.prioritySeek);
            this.applyForce(seek);
        } else {
            let wander = this.wander();
            this.applyForce(wander);
        }
    }

    // Update physics and hunger
    update() {
        // Decrement hunger and kill entity if it reaches 0
        if (this.canStarve) {
            this.hunger--;
            if (this.hunger <= 0) {
                this.dead = true;
                return;
            }
        }

        // Update physics
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    // Accelerate in a random direction
    wander() {
        return p5.Vector.fromAngle(random(TWO_PI), this.maxForce);
    }
}
