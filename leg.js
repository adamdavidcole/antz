class Leg {
  constructor(origin, length, directionUp) {
    this.origin = origin;

    this.angle = random(TWO_PI);
    this.angleV = 0.2;
    this.amplitude = length;
    this.legLength = length;
    this.directionUp = directionUp;
  }

  update(bodyAccelertion) {
    const accMag = bodyAccelertion.mag();
    this.angleV = map(accMag, 1.5, 3, 0, 1) + random(0.1);
    this.angle += this.angleV;
  }

  draw() {
    const x = this.amplitude * sin(this.angle);
    const y = this.directionUp ? -this.legLength : this.legLength;
    // const y = this.length * cos(this.angle);

    noFill();
    stroke(50);
    strokeWeight(1);
    push();
    translate(this.origin.x, this.origin.y);
    line(0, 0, x, y);
    // ellipse(x, this.length, 30);
    pop();
  }
}
