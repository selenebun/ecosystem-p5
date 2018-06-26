class Entity {
    constructor(x, y) {
        // AI
        this.perception = 100;
        this.priorityFlee = 1;
        this.prioritySeek = 1;
        //this.toArrive = [];
        this.toEat = [];
        this.toFlee = [];
        this.toSeek = [];

        // Display
        this.color = '#ECF0F1';
        this.model = MODEL.circle;

        // Misc
        this.canStarve = true;
        this.childrenBase = 1;
        this.childrenExtra = 1;
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
        // Get all visible entities
        let relevant = this.getVisible(entities, this.rTypes);
        this.steer(relevant);
        this.update();
        if (!this.dead) {
            this.borders();
            this.attemptEat(relevant);
            this.display();
        }
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

    // Attempt to eat
    attemptEat(entities) {
        for (let i = 0; i < entities.length; i++) {
            let e = entities[i];

            // Check if can eat
            if (this.toEat.indexOf(e.type) === -1) continue;

            // Eat if inside entity
            if (!e.dead && pointCircle(e.pos, this.pos, this.r)) {
                e.dead = true;

                // Add hunger levels
                this.hunger += e.hunger;
                if (this.hunger > this.maxHunger) this.hunger = this.maxHunger;

                // Trigger onEat event
                this.onEat();
            }
        }
    }

    // Behavior around map edges
    borders() {}

    // Display entity
    display() {
        let alpha = this.hunger / this.maxHunger * 215 + 40;
        this.color.setAlpha(alpha);
        this.model(alpha);

        // Display perception range
        if (keyIsDown(80)) {
            noFill();
            stroke('#39D5FF');
            ellipse(this.pos.x, this.pos.y, this.perception, this.perception);
        }

        // Display hitbox
        if (keyIsDown(72)) {
            fill(255, 63);
            stroke(255);
            ellipse(this.pos.x, this.pos.y, this.r, this.r);
        }
    }

    // Flee from a target vector
    flee(v) {
        let desired = p5.Vector.sub(this.pos, v);
        return this.adjust(desired);
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
            if (!circleCircle(this.pos, this.perception, e.pos, e.r)) continue;

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

        // All types that the entity reacts to
        this.rTypes = uniq(this.toEat.concat(this.toFlee, this.toSeek));
    }

    // Events
    onDeath() {}
    onEat() {}

    // Spawn new child entities
    reproduce() {
        // Determine number of children to spawn
        let count = this.childrenBase;
        for (let i = 0; i < this.childrenExtra; i++) {
            if (random() < 0.5) count++;
        }

        // Spawn and mutate children
        for (let i = 0; i < count; i++) {
            this.spawnChild();
        }
    }

    // Seek towards a target vector
    seek(v) {
        let desired = p5.Vector.sub(v, this.pos);
        return this.adjust(desired);
    }

    // Spawn a new child entity, apply mutations
    spawnChild() {
        let e = new Entity(this.pos.x, this.pos.y);
        applyTemplate(e, ENTITY[this.type]);

        // Apply mutations
        e.perception = mutate(this.perception, 10);
        e.priorityFlee = mutate(this.priorityFlee, 0.1);
        e.prioritySeek = mutate(this.prioritySeek, 0.1);

        e.hunger = mutate(this.hunger, 10);

        e.r = mutate(this.r, 1);
        e.maxForce = mutate(this.maxForce, 0.01);
        e.maxSpeed = mutate(this.maxSpeed, 0.1);

        e.init();
        newEntities.push(e);
    }

    // Apply steering behaviors
    steer(arr) {
        // Wander if no relevant entities in perception range
        if (arr.length === 0) {
            this.applyForce(this.wander());
            return;
        }

        // Fleeing
        let toFlee = this.getNearest(arr, this.toFlee);
        if (toFlee) {
            let flee = this.flee(toFlee.pos);
            flee.mult(this.priorityFlee);
            this.applyForce(flee);
        }

        // Seeking
        let toSeek = this.getNearest(arr, this.toSeek);
        if (toSeek) {
            let seek = this.seek(toSeek.pos);
            seek.mult(this.prioritySeek);
            this.applyForce(seek);
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
