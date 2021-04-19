const SIZE = 5;
const TOP_SPEED = 2.5;
const NOISE_INCR = 0.01;

class Mover {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector();
    this.acceleration = createVector();
    this.topspeed = TOP_SPEED;

    this.xOff = 0;
    this.yOff = 1000;
  }

  update() {
    // this.acceleration = p5.Vector.random2D();
    // console.log("this.acceleration", this.acceleration);
    // random2D() not implemented? doing raw math for now instead
    // var angle = random(TWO_PI);
    // this.acceleration = createVector(cos(angle), sin(angle));
    // this.acceleration.mult(random(2));

    const mappedXNoise = map(noise(this.xOff), 0, 1, -1, 1);
    const mappedYNoise = map(noise(this.yOff), 0, 1, -1, 1);

    const mappedNoiseVec = createVector(mappedXNoise, mappedYNoise).setMag(
      0.05
    );
    const randomJitterVec = p5.Vector.random2D().setMag(0.5);

    this.acceleration = p5.Vector.add(mappedNoiseVec, randomJitterVec);

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);
    this.position.add(this.velocity);

    this.xOff += NOISE_INCR;
    this.yOff += NOISE_INCR;
  }

  display() {
    stroke(0);
    strokeWeight(2);
    fill(50);
    ellipse(this.position.x, this.position.y, SIZE, SIZE);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x = this.velocity.x * -1.5;
    }

    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y = this.velocity.y * -1.5;
    }
  }
}
