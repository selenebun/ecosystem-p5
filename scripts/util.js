// Substitute properties from a template
function applyTemplate(obj, template) {
    let keys = Object.keys(template);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        obj[key] = template[key];
    }
}

// Circle-circle collision detection
function circleCircle(c1, r1, c2, r2) {
    return c1.dist(c2) < r1 + r2;
}

// Point-circle collision detection
function pointCircle(p, c, r) {
    return p.dist(c) < r;
}
