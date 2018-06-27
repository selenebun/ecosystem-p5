const ENTITY = {};

ENTITY.food = {
    // AI
    perception: 0,
    // Display
    color: '#2ECC71',
    // Misc
    canStarve: false,
    foodDropChance: 0,
    type: 'food',
    // Physics
    r: 4,
    maxSpeed: 0,
    maxForce: 0
};

ENTITY.prey = {
    // AI
    priorityAvoid: 0.1,
    toEat: ['food'],
    toAvoid: ['predator'],
    toPursue: ['food'],
    // Display
    color: '#22A7F0',
    model: MODEL.filledCircle,
    // Misc
    childrenExtra: 1,
    foodDropChance: 0,
    hunger: 100,
    reproduceChance: 0.8,
    type: 'prey',
    // Physics
    maxForce: 0.2,
    maxSpeed: 3,
    r: 8
};

ENTITY.predator = {
    // AI
    multiplePursue: true,
    perception: 150,
    priorityAvoid: 0.25,
    priorityPursue: 2,
    toAvoid: ['predator'],
    toEat: ['prey'],
    toPursue: ['prey'],
    // Display
    color: '#D73C2C',
    model: MODEL.pointy,
    // Misc
    hunger: 150,
    foodDropChance: 0.5,
    reproduceChance: 0.1,
    type: 'predator',
    // Physics
    r: 12
};
