const { Engine, Render, Runner, World, Bodies } = Matter;

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

// Setup initial wall grid
const vericalWallLayout = Array(verticalCells).fill(
  Array(horizontalCells - 1).fill(true)
);

const horizontalWallLayout = Array(verticalCells - 1).fill(
  Array(horizontalCells).fill(true)
);

// Setup maze for traversal
const maze = Array(verticalCells).fill(Array(horizontalCells).fill(false));
const startingRoom = {
  x: Math.floor(Math.random() * horizontalCells),
  y: Math.floor(Math.random() * verticalCells)
};
const path = [startingRoom];

// Maze helper functions
const checkRoom = (x, y, maze) => {
  return (
    x >= 0 && x < horizontalCells && y >= 0 && y < verticalCells && !maze[y][x]
  );
};

const findAdjacentRooms = (x, y, maze) => {
  let adjacentRooms = [];
  if (checkRoom(x, y - 1, maze)) {
    adjacentRooms.push({ x, y: y - 1, direction: 'up' });
  }
  if (checkRoom(x + 1, y, maze)) {
    adjacentRooms.push({ x: x + 1, y, direction: 'right' });
  }
  if (checkRoom(x, y + 1, maze)) {
    adjacentRooms.push({ x, y: y + 1, direction: 'down' });
  }
  if (checkRoom(x - 1, y, maze)) {
    adjacentRooms.push({ x: x - 1, y, direction: 'left' });
  }
  return adjacentRooms;
};

const buildMaze = (maze, path, verticalWalls, horizontalWalls) => {
  while (path.length) {
    const adjacentRooms = findAdjacentRooms(path[0].x, path[0].y, maze);
    if (adjacentRooms.length) {
      const direction = Math.floor(Math.random() * adjacentRooms.length);
      const nextRoom = adjacentRooms[direction];
      maze[nextRoom.y][nextRoom.x] = true;
      path.push(nextRoom);
    } else {
      path.pop();
    }
  }
};

// Generate the maze
buildMaze(maze, path, vericalWallLayout, horizontalWallLayout);

// Styling for the walls
const wallOptions = {
  isStatic: true,
  render: {
    fillStyle: '#000'
  }
};

// Setup outer walls
const outerWalls = [
  Bodies.rectangle(width / 2, 0, width, 10, wallOptions),
  Bodies.rectangle(width / 2, height, width, 10, wallOptions),
  Bodies.rectangle(0, height / 2, 10, height, wallOptions),
  Bodies.rectangle(width, height / 2, 10, height, wallOptions)
];

// Determine what walls to render
const verticalWalls = [];
vericalWallLayout.forEach((row, y) => {
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

const horizontalWalls = [];
horizontalWallLayout.forEach((row, y) => {
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

// Render the maze
Engine.run(engine);
Render.run(render);
World.add(world, outerWalls);
World.add(world, verticalWalls);
World.add(world, horizontalWalls);
