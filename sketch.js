const INITIAL_MOVERS_COUNT = 100;
let movers;

function setup() {
  createCanvas(640, 360);

  movers = [];
  for (let i = 0; i < INITIAL_MOVERS_COUNT; i++) {
    movers.push(new Mover());
  }
}

function draw() {
  background(220);

  movers.forEach((mover) => {
    mover.update();
    mover.checkEdges();
    mover.display();
  });
}
