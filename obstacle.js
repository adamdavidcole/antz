class Obstacle {
  constructor() {
    this.width = 350;
    this.height = 10;
    this.position = createVector(
      width / 2 - this.width / 2,
      height / 2 - this.height / 2
    );
  }

  checkCollision(mover) {
    const posX = mover.position.x;
    const posY = mover.position.y;

    return (
      posX >= this.position.x &&
      posX <= this.position.x + this.width &&
      posY >= this.position.y &&
      posY <= this.position.y + this.height
    );
  }

  display() {
    fill(30);
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}
