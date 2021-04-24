const INITIAL_MOVERS_COUNT = 100;
const INITIAL_FOOD_SOURCE_COUNT = 1;

let movers;
let homeBase;
let foodSources;
let repellers;
let rec;

function setup() {
  createCanvas(600, 600);
  rec = new p5.Recorder();

  homeBase = new Attractor({
    type: "home",
    x: 0,
    y: 0,
    mass: 250,
    size: 50,
  });

  movers = [];

  foodSources = [];
  for (let i = 0; i < INITIAL_FOOD_SOURCE_COUNT; i++) {
    const yOffset = random(0, height / 3);
    const xOffset = (width / INITIAL_FOOD_SOURCE_COUNT) * i + random(width / 3);
    map;
    foodSource = new Attractor({
      type: "food",
      x: width,
      y: height,
      mass: 25,
      size: 25,
    });

    foodSources.push(foodSource);
  }

  movers.push(new Mover({ x: width / 2, y: width / 2 }));

  repellers = [];

  releaseAnts();
}

function releaseAnts() {
  const interval = setInterval(() => {
    if (random() > movers.length / INITIAL_MOVERS_COUNT) {
      movers.push(
        new Mover({ x: homeBase.position.x, y: homeBase.position.y })
      );
    }

    if (movers.length === INITIAL_MOVERS_COUNT) clearInterval(interval);
  }, 500);
}

function draw() {
  background(220, 155);

  homeBase.display();
  repellers.forEach((repeller) => repeller.display());
  foodSources.forEach((foodSource) => foodSource.display());

  movers.forEach((mover) => {
    if (mover.beginExploring) {
      mover.explore();

      if (mover.hasFood) {
        const attractorForce = homeBase.attract(mover);
        mover.applyForce(attractorForce);
      } else {
        foodSources.forEach((foodSource) => {
          const attractorForce = foodSource.attract(mover);
          mover.applyForce(attractorForce);
        });
      }

      repellers.forEach((repeller) => {
        const repellerForce = repeller.attract(mover);
        mover.applyForce(repellerForce);
      });

      movers.forEach((otherMover) => {
        if (mover !== otherMover && !otherMover.hasFood) {
          const force = otherMover.attract(mover);
          mover.applyForce(force);
        }
      });
    } else {
      mover.maybeBeginExploring();
    }

    if (mouseIsPressed) {
      const mouse = createVector(mouseX, mouseY);
      const forceDir = p5.Vector.sub(mouse, mover.position);
      forceDir.setMag(3);
      mover.applyForce(forceDir);
    }

    mover.update();

    foodSources.forEach((foodSource) => {
      mover.checkHasFoundFood(foodSource);
    });
    mover.checkHasFoundHome(homeBase);
    mover.checkEdges();

    mover.display();
  });
}

// function mouseClicked() {
//   repellers.push(
//     new Attractor({
//       type: "repeller",
//       x: mouseX,
//       y: mouseY,
//       mass: 50,
//       size: 10,
//       shouldAttract: false,
//     })
//   );
// }

function getWorldState() {
  return {
    movers,
    foodSource,
    homeBase,
  };
}
