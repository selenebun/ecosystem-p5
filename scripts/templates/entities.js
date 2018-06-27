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
    priorityFlee: 0.2,
    toEat: ['food'],
    toFlee: ['predator'],
    toSeek: ['food'],
    // Display
    color: '#22A7F0',
    model: MODEL.filledCircle,
    // Misc
    childrenExtra: 1,
    type: 'prey',
    // Physics
    r: 8,
    // Methods
    onEat: function() {
        this.reproduce();
    }
};

ENTITY.predator = {
    // AI
    perception: 150,
    priorityFlee: 0,
    toEat: ['prey'],
    toFlee: ['predator'],
    toSeek: ['prey'],
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
