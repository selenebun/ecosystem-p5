function setup() {
    // Set up canvas
    let sketch = document.getElementById('sketch');
    let canvas = createCanvas(sketch.offsetWidth, sketch.offsetHeight);
    canvas.parent(sketch);
    resizeCanvas(sketch.offsetWidth, sketch.offsetHeight, true);
}

function draw() {
    background(0);
}
