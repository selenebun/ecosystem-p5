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
    priorityFlee: 0,
    toEat: ['food'],
    toFlee: ['predator'],
    toSeek: ['food'],
    toSeparate: ['prey'],
    // Display
    color: '#22A7F0',
    model: MODEL.pointy,
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
    prioritySeparation: 0,
    toEat: ['prey'],
    toSeek: ['prey'],
    toSeparate: ['predator'],
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
        let e = new Entity(this.pos.x, this.pos.y);
        applyTemplate(e, ENTITY.food);
        e.init();
        newEntities.push(e);
    },
    onEat: function() {
        this.reproduce();
    }
};
