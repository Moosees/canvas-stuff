const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Mouse,
  MouseConstraint
} = Matter;

const width = document.body.clientWidth;
const height = document.body.clientHeight;
console.log({ width, height });

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#333'
  }
});

Engine.run(engine);
Render.run(render);

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
);

// Walls
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

// Stuff to play with
const stuff = Array(30)
  .fill(undefined)
  .map(() => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const size = Math.floor((Math.random() * (width + height)) / 20 + 10);
    return Math.random() < 0.5
      ? Bodies.circle(x, y, size)
      : Bodies.rectangle(x, y, size, size);
  });
World.add(world, stuff);
