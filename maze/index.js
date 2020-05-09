const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// Grid size calculations
const width = document.body.clientWidth;
const height = document.body.clientHeight;
// const width = 400;
// const height = 400;
const horizontalCells = Math.floor(width / 125);
const verticalCells = Math.floor(height / 125);
const totalRooms = horizontalCells * verticalCells;
const horizontalSpacing = width / horizontalCells;
const verticalSpacing = height / verticalCells;

// matter-js setup
const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#939',
  },
});

// Setup initial maze layout
const maze = Array.from(Array(verticalCells), () =>
  Array(horizontalCells).fill(false)
);
const verticalWallLayout = Array.from(Array(verticalCells), () =>
  Array(horizontalCells - 1).fill(true)
);
const horizontalWallLayout = Array.from(Array(verticalCells - 1), () =>
  Array(horizontalCells).fill(true)
);

// Pick a starting room
const startingRoom = {
  x: Math.floor(Math.random() * horizontalCells),
  y: Math.floor(Math.random() * verticalCells),
};

// Maze helper functions
const checkRoom = (x, y, maze) =>
  x >= 0 && x < horizontalCells && y >= 0 && y < verticalCells && !maze[y][x];

const findAdjacentRooms = (x, y, maze) => {
  const adjacentRooms = [];
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

const breakWall = (nextRoom, verticalWalls, horizontalWalls) => {
  if (nextRoom.direction === 'up') {
    horizontalWalls[nextRoom.y][nextRoom.x] = false;
  }
  if (nextRoom.direction === 'right') {
    verticalWalls[nextRoom.y][nextRoom.x - 1] = false;
  }
  if (nextRoom.direction === 'down') {
    horizontalWalls[nextRoom.y - 1][nextRoom.x] = false;
  }
  if (nextRoom.direction === 'left') {
    verticalWalls[nextRoom.y][nextRoom.x] = false;
  }
};

const buildMaze = (
  maze,
  startingRoom,
  totalRooms,
  verticalWalls,
  horizontalWalls
) => {
  const path = [startingRoom];
  let unvisitedRooms = totalRooms;
  let currentRoom = startingRoom;
  maze[currentRoom.y][currentRoom.x] = true;

  while (path.length && unvisitedRooms) {
    const adjacentRooms = findAdjacentRooms(currentRoom.x, currentRoom.y, maze);

    if (adjacentRooms.length) {
      const direction = Math.floor(Math.random() * adjacentRooms.length);
      currentRoom = adjacentRooms[direction];
      breakWall(currentRoom, verticalWalls, horizontalWalls);
      path.push(currentRoom);
      maze[currentRoom.y][currentRoom.x] = true;
      unvisitedRooms--;
    } else {
      path.pop();
      currentRoom = path[path.length - 1];
    }
  }
};

// Generate the maze
buildMaze(
  maze,
  startingRoom,
  totalRooms,
  verticalWallLayout,
  horizontalWallLayout
);

// Body options
const borderOptions = {
  isStatic: true,
  label: 'border',
  render: {
    fillStyle: '#000',
  },
};

const wallOptions = {
  isStatic: true,
  label: 'wall',
  render: {
    fillStyle: '#333',
  },
};

// Setup outer walls
const outerWalls = [
  Bodies.rectangle(width / 2, 0, width, 10, borderOptions),
  Bodies.rectangle(width / 2, height, width, 10, borderOptions),
  Bodies.rectangle(0, height / 2, 10, height, borderOptions),
  Bodies.rectangle(width, height / 2, 10, height, borderOptions),
];

// Determine what walls to render
const verticalWalls = [];
verticalWallLayout.forEach((row, y) => {
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

const goal = Bodies.rectangle(
  width - horizontalSpacing / 2,
  height - verticalSpacing / 2,
  horizontalSpacing * 0.9,
  verticalSpacing * 0.9,
  { isStatic: true, label: 'goal', render: { fillStyle: '#5c5' } }
);

const player = Bodies.circle(
  horizontalSpacing / 2,
  verticalSpacing / 2,
  Math.min(horizontalSpacing, verticalSpacing) * 0.3,
  {
    label: 'player',
    friction: 0.05,
    frictionAir: 0.005,
    render: { fillStyle: '#f0f' },
  }
);

// Render the maze
Engine.run(engine);
Render.run(render);
World.add(world, outerWalls);
World.add(world, verticalWalls);
World.add(world, horizontalWalls);
World.add(world, goal);
World.add(world, player);

// Controls
let currentVelocity = 5;

document.addEventListener('keydown', (e) => {
  const { x, y } = player.velocity;

  switch (e.keyCode) {
    // Up
    case 87:
    case 38:
      Body.setVelocity(player, { x, y: y - currentVelocity });
      break;

    // Right
    case 68:
    case 39:
      Body.setVelocity(player, { x: x + currentVelocity, y });
      break;

    // Down
    case 83:
    case 40:
      Body.setVelocity(player, { x, y: y + currentVelocity });
      break;

    // Left
    case 65:
    case 37:
      Body.setVelocity(player, { x: x - currentVelocity, y });
      break;

    default:
      break;
  }
});

// Game logic
Events.on(engine, 'collisionStart', (e) => {
  e.pairs.forEach(({ bodyA, bodyB }) => {
    const labels = [bodyA.label, bodyB.label];

    if (labels.includes('player') && labels.includes('goal')) {
      winGame();
    }
  });
});

const winGame = () => {
  world.bodies.forEach((body) => {
    if (body.label === 'wall') {
      Body.setStatic(body, false);
    }
  });
  currentVelocity = 20;
  Events.off(engine, 'collisionStart');
  
  Body.setVelocity(player, { x: -20, y: -20 });
  Body.scale(player, 2, 2);
  Body.setMass(player, 50);
  Body.set(player, { friction: 0.01, frictionAir: 0.001 });
};
