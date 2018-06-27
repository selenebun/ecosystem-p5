class Entity {
    constructor(x, y) {
        // AI
        this.multipleAvoid = true;
        this.multiplePursue = false;
        this.perception = 75;
        this.priorityAvoid = 1;
        this.priorityPursue = 1;
        this.toAvoid = [];
        this.toEat = [];
        this.toPursue = [];

        // Display
        this.color = '#ECF0F1';
        this.model = MODEL.circle;

        // Misc
        this.canStarve = true;
        this.childrenBase = 1;
        this.childrenExtra = 0;
        this.dead = false;
        this.foodDropChance = 0.5;
        this.hunger = 50;
        this.reproduceChance = 1;
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
    act(arr) {
        if (!paused) {
            // Get all visible entities
            let relevant = this.getVisible(arr, this.rTypes);
            this.steer(relevant);
            this.borders();
            this.update();
            this.attemptEat(relevant);
        }
        this.display();
    }

    // Adjust steering
    adjust(steer, speed) {
        steer.setMag(typeof speed === 'undefined' ? this.maxSpeed : speed);
        steer.sub(this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    // Apply a force
    applyForce(f) {
        this.acc.add(f);
    }

    // Attempt to eat
    attemptEat(arr) {
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];

            // Check if can eat
            if (this.toEat.indexOf(e.type) === -1) continue;

            // Eat if inside entity
            if (!e.dead && pointCircle(e.pos, this.pos, this.r)) {
                e.dead = true;

                // Refill hunger
                this.hunger = this.maxHunger;

                // Trigger onEat event
                this.onEat();
            }
        }
    }

    // Behavior around map edges
    borders() {
        let sep = 50;
        let desired = this.vel.copy();

        if (this.pos.x < sep) desired.x = this.maxSpeed;
        if (this.pos.x > width - sep) desired.x = -this.maxSpeed;
        if (this.pos.y < sep) desired.y = this.maxSpeed;
        if (this.pos.y > height - sep) desired.y = -this.maxSpeed;

        this.applyForce(this.adjust(desired));
    }

    // Display entity
    display() {
        let alpha = this.hunger / this.maxHunger * 215 + 40;
        this.color.setAlpha(alpha);
        this.model(alpha);

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

            // Check if invalid type
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
        this.rTypes = uniq(this.toAvoid.concat(this.toEat, this.toPursue));

        // Wander angle
        this.wanderTheta = this.vel.heading();

        this.vel = p5.Vector.random2D().mult(this.maxSpeed);
    }

    // Events
    onDeath() {
        if (random() < this.foodDropChance) {
            spawnEntity(this.pos.x, this.pos.y, 'food');
        }
    }
    onEat() {
        if (random() < this.reproduceChance) this.reproduce();
    }

    // Spawn new child entities
    reproduce() {
        // Determine number of children to spawn
        let count = round(this.childrenBase);
        if (!toLimitEntities()) {
            for (let i = 0; i < round(this.childrenExtra); i++) {
                if (random() < 0.5) count++;
            }
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
        let c = color(this.color.toString());
        let levels = c.levels;
        c.setRed(mutate(levels[0], 10));
        c.setGreen(mutate(levels[1], 10));
        c.setBlue(mutate(levels[2], 10));
        e.color = c;

        if (random() < 0.05) e.multipleAvoid = !this.multipleAvoid;
        if (random() < 0.05) e.multiplePursue = !this.multiplePursue;
        e.perception = mutate(this.perception, 10);
        e.priorityAvoid = mutate(this.priorityAvoid, 0.1);
        e.priorityPursue = mutate(this.priorityPursue, 0.1);

        e.childrenBase = mutate(this.childrenBase, 0.1);
        e.childrenExtra = mutate(this.childrenExtra, 0.1);
        e.hunger = mutate(this.hunger, 10);
        e.reproduceChance = mutate(this.reproduceChance, 0.01, 1);

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

        // Avoidance
        if (this.priorityAvoid > 0 || this.toAvoid.length > 0) {
            let toAvoid = getByType(arr, this.toAvoid);
            if (toAvoid.length > 0) {
                let avoidVector;
                if (this.multipleAvoid) {
                    avoidVector = createVector();
                    for (let i = 0; i < toAvoid.length; i++) {
                        let e = toAvoid[i];
                        let d = e.pos.dist(this.pos);
                        let diff = p5.Vector.sub(this.pos, e.pos);
                        diff.setMag(1 / max(d, 0.01));
                        avoidVector.add(diff);
                    }
                    avoidVector.div(toAvoid.length);
                } else {
                    let e = this.getNearest(toAvoid, this.toAvoid);
                    avoidVector = p5.Vector.sub(this.pos, e.pos);
                }

                // Apply avoidance steering
                avoidVector = this.adjust(avoidVector);
                avoidVector.mult(this.priorityAvoid);
                this.applyForce(avoidVector);
            }
        }

        // Pursuit
        if (this.priorityPursue > 0 || this.toPursue.length > 0) {
            let toPursue = getByType(arr, this.toPursue);
            if (toPursue.length > 0) {
                let pursuitVector;
                if (this.multiplePursue) {
                    pursuitVector = createVector();
                    for (let i = 0; i < toPursue.length; i++) {
                        let e = toPursue[i];
                        let d = e.pos.dist(this.pos);
                        let diff = p5.Vector.sub(e.pos, this.pos);
                        diff.setMag(1 / d);
                        pursuitVector.add(diff);
                    }
                    pursuitVector.div(toPursue.length);
                } else {
                    let e = this.getNearest(toPursue, this.toPursue);
                    pursuitVector = p5.Vector.sub(e.pos, this.pos);
                }

                // Apply avoidance steering
                pursuitVector = this.adjust(pursuitVector);
                pursuitVector.mult(this.priorityPursue);
                this.applyForce(pursuitVector);
            }
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
        this.wanderTheta += random(-1, 1);
        return p5.Vector.fromAngle(this.wanderTheta, this.maxForce);
    }
}
