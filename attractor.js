class Attractor {
  constructor({ type, x, y, mass, size, shouldAttract = true }) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.type = type;
    this.size = size;
    this.shouldAttract = shouldAttract;

    this.G = 1;
  }

  attract(mover) {
    // Calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);
    // Distance between objects
    let distance = force.mag();
    // if (this.type == "reppelent") console.log("distance", distance);
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 0.1, 25);

    // Calculate gravitional force magnitude
    let strength = (this.G * this.mass * mover.mass) / (distance * distance);

    // if (this.type == "reppelent") console.log("strength", strength);

    if (this.type == "food") {
      const numExistingVisits = mover.getNumFoodSourceVisits(this) || 0;
      //   console.log("numExistingVisits", numExistingVisits);
      if (numExistingVisits > 0) {
        const clampedNumExistingVisits = Math.min(
          Math.max(numExistingVisits, 1),
          4
        );
        // console.log("strength before", strength);
        strength = strength + clampedNumExistingVisits;
        // console.log("strength after", strength);
      }
    }

    if (!this.shouldAttract) {
      strength = strength * -1;
    }

    // Get force vector --> magnitude * direction
    force.setMag(strength);
    // if (this.type == "reppelent") console.log("force", force);

    return force;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
    strokeWeight(4);
    stroke(0);
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
  }
}
