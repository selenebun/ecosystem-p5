const ENTITY = {};

ENTITY.food = {
    // AI
    perception: 0,
    // Display
    color: '#2ECC71',
    // Misc
    canStarve: false,
    type: 'food',
    // Physics
    r: 4,
    maxSpeed: 0,
    maxForce: 0
};

ENTITY.prey = {
    // AI
    priorityAvoid: 0.2,
    toEat: ['food'],
    toAvoid: ['predator'],
    toPursue: ['food'],
    // Display
    color: '#22A7F0',
    model: MODEL.filledCircle,
    // Misc
    childrenExtra: 1,
    hunger: 200,
    type: 'prey',
    // Physics
    maxForce: 0.2,
    maxSpeed: 3,
    r: 8,
    // Methods
    onEat: function() {
        this.reproduce();
    }
};

ENTITY.predator = {
    // AI
    multiplePursue: true,
    perception: 150,
    priorityAvoid: 0.125,
    toAvoid: ['predator'],
    toEat: ['prey'],
    toPursue: ['prey'],
    // Display
    color: '#D73C2C',
    model: MODEL.pointy,
    // Misc
    hunger: 100,
    type: 'predator',
    // Physics
    r: 12,
    // Methods
    onDeath: function() {
        if (random() < 0.5) return;
        spawnEntity(this.pos.x, this.pos.y, 'food');
    },
    onEat: function() {
        this.reproduce();
    }
};
