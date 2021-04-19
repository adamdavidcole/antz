const SIZE = 5;
const TOP_SPEED = 2.5;
const NOISE_INCR = 0.01;
const MASS = 3;
const G = 0.025;

class Mover {
  constructor({ x, y }) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.topspeed = TOP_SPEED;
    this.mass = 3;

    this.hasFood = false;
    this.foundFoodSource = {};

    this.beginExploring = false;

    this.xOff = random(0, 1000);
    this.yOff = random(10000, 20000);
  }

  // Newton's 2nd law: F = M * A
  // or A = F / M
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  attract(other) {
    // Calculate direction of force
    let force = p5.Vector.sub(this.position, other.position);
    // Distance between objects
    let distance = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 5.0, 1000);

    // Calculate gravitional force magnitude
    let strength = (G * this.mass * other.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    force.setMag(strength);

    return force;
  }

  explore() {
    const mappedXNoise = map(noise(this.xOff), 0, 1, -1, 1);
    const mappedYNoise = map(noise(this.yOff), 0, 1, -1, 1);

    const mappedNoiseVec = createVector(mappedXNoise, mappedYNoise).setMag(
      0.25
    );
    const randomJitterVec = p5.Vector.random2D().setMag(2);

    this.xOff += NOISE_INCR;
    this.yOff += NOISE_INCR;

    this.applyForce(p5.Vector.add(mappedNoiseVec, randomJitterVec));
  }

  maybeBeginExploring() {
    // if (random() > 0.5) {
    this.beginExploring = true;
    // }
  }

  checkHasFoundFood(foodSource) {
    if (this.hasFood) return;

    const distance = p5.Vector.sub(foodSource.position, this.position).mag();
    if (distance < 20) {
      this.hasFood = true;

      if (!(this.foundFoodSource[foodSource] >= 0)) {
        this.foundFoodSource[foodSource] = 0;
      }

      this.foundFoodSource[foodSource] = this.foundFoodSource[foodSource] + 1;
    }
  }

  getNumFoodSourceVisits(foodSource) {
    return this.foundFoodSource[foodSource] || 0;
  }

  checkHasFoundHome(homeBase) {
    if (!this.hasFood) return;

    const distance = p5.Vector.sub(homeBase.position, this.position).mag();
    if (distance < 20) {
      this.hasFood = false;
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);
    this.position.add(this.velocity);

    this.acceleration = createVector(0, 0);
  }

  display() {
    stroke(0);
    strokeWeight(1);

    const fillColor = this.hasFood ? 250 : 50;

    fill(fillColor);
    ellipse(this.position.x, this.position.y, SIZE, SIZE);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x = this.velocity.x * -0.05;
      if (this.position.x >= width) {
        this.position.x = width;
      } else {
        this.position.x = 0;
      }
    }

    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y = this.velocity.y * -0.05;
      if (this.position.y >= height) {
        this.position.y = height;
      } else {
        this.position.y = 0;
      }
    }
  }

  checkCollision(obstacle) {
    if (obstacle.checkCollision(this)) {
      this.velocity.mult(-2);
    }
  }
}
