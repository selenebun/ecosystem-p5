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
    toEat: ['food'],
    toSeek: ['food'],
    // Display
    color: '#22A7F0',
    model: MODEL.pointy,
    // Misc
    type: 'prey',
    // Physcis
    r: 8,
    // Methods
    onEat: function() {
        this.reproduce();
    }
};
