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
    this.mass = this.getRandomSize();

    this.legs = [];
    this.generateLegs();

    this.hasFood = false;
    this.foundFoodSource = {};

    this.beginExploring = false;

    this.xOff = random(0, 1000);
    this.yOff = random(10000, 20000);
  }

  getRandomSize() {
    function getR() {
      while (true) {
        const r1 = random();
        let probability = 1 / (1000 * r1 + 1);
        let r2 = random(1);
        if (r2 < probability) {
          return r1;
        }
      }
    }

    return map(getR(), 0, 1, 3, 8);
  }

  generateLegs() {
    const origin1 = createVector(this.mass, 0);
    // front left
    const leg1 = new Leg(origin1, this.mass * 0.9, true);
    const origin2 = createVector(0, 0);
    // middle left
    const leg2 = new Leg(origin2, this.mass * 0.95, true);
    const origin3 = createVector(-this.mass, 0);
    // back left
    const leg3 = new Leg(origin3, this.mass, true);
    const origin4 = createVector(this.mass, 0);
    // front right
    const leg4 = new Leg(origin1, this.mass * 0.9, false);
    const origin5 = createVector(0, 0);
    // middle right
    const leg5 = new Leg(origin2, this.mass * 0.95, false);
    // back right
    const origin6 = createVector(-this.mass, 0);
    const leg6 = new Leg(origin3, this.mass, false);

    this.legs.push(leg1, leg2, leg3, leg4, leg5, leg6);
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
    const randomJitterVec = p5.Vector.random2D().setMag(2); // 2

    this.xOff += NOISE_INCR;
    this.yOff += NOISE_INCR;

    const bodyAccelertion = p5.Vector.add(mappedNoiseVec, randomJitterVec);
    this.applyForce(bodyAccelertion);

    this.legs.forEach((leg) => {
      leg.update(bodyAccelertion);
    });
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
    noStroke();

    // const fillColor = this.hasFood ? 250 : 50;
    const fillColor = 50;

    fill(fillColor);
    const size = this.mass;
    // ellipse(this.position.x, this.position.y, SIZE, SIZE);
    const { x, y } = this.position;
    const angle = this.velocity.heading();

    push();
    translate(x, y);
    rotate(angle);

    const shiftMag = 0.93;

    ellipse(size * sq(shiftMag), 0, size * shiftMag);
    ellipse(0, 0, size * pow(shiftMag, 4));
    ellipse(-size * sq(shiftMag), 0, size);
    this.legs.forEach((leg) => {
      leg.draw();
    });
    pop();
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
