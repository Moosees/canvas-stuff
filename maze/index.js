const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Mouse,
  MouseConstraint
} = Matter;

// Grid size calculations
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const horizontalCells = Math.floor(width / 200);
const verticalCells = Math.floor(height / 200);
const horizontalSpacing = width / horizontalCells;
const verticalSpacing = height / verticalCells;

// matter-js setup
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#999'
  }
});

Engine.run(engine);
Render.run(render);

// Outer walls
const wallOptions = {
  isStatic: true,
  render: {
    fillStyle: '#000'
  }
};

const walls = [
  Bodies.rectangle(width / 2, 0, width, 10, wallOptions),
  Bodies.rectangle(width / 2, height, width, 10, wallOptions),
  Bodies.rectangle(0, height / 2, 10, height, wallOptions),
  Bodies.rectangle(width, height / 2, 10, height, wallOptions)
];
World.add(world, walls);

// Maze rooms
const rooms = Array(verticalCells).fill(Array(horizontalCells).fill(true));

// Vertical walls
const showVerticalWalls = Array(verticalCells).fill(
  Array(horizontalCells - 1).fill(true)
);

const verticalWalls = [];

showVerticalWalls.forEach((row, y) => {
  row.forEach((wall, x) => {
    if (wall)
      verticalWalls.push(
        Bodies.rectangle(
          horizontalSpacing * x + horizontalSpacing,
          verticalSpacing * y + verticalSpacing / 2,
          8,
          verticalSpacing,
          wallOptions
        )
      );
  });
});

World.add(world, verticalWalls);

// Horizontal walls
const showHorizontalWalls = Array(verticalCells - 1).fill(
  Array(horizontalCells).fill(true)
);

const horizontalWalls = [];

showHorizontalWalls.forEach((row, y) => {
  row.forEach((wall, x) => {
    if (wall)
      horizontalWalls.push(
        Bodies.rectangle(
          horizontalSpacing * x + horizontalSpacing / 2,
          verticalSpacing * y + verticalSpacing,
          horizontalSpacing,
          8,
          wallOptions
        )
      );
  });
});

World.add(world, horizontalWalls);
