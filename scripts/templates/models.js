const MODEL = {};

MODEL.circle = function(alpha) {
    fill(this.color);
    stroke(0, alpha);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
};

MODEL.filledCircle = function(alpha) {
    fill(0, alpha);
    stroke(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
};

MODEL.pointy = function(alpha) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    fill(0, alpha);
    stroke(this.color);
    let back = -this.r;
    let front = this.r * 4/3;
    let middle = -this.r/2;
    let side = this.r;
    quad(back, -side, middle, 0, back, side, front, 0);

    pop();
};
