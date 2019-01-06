import * as PIXI from 'pixi.js';
import {
  Emitter
} from 'pixi-particles';
import {
  ImageTexter
} from 'imageTexter.js';

let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Container = PIXI.Container,
  Graphics = PIXI.Graphics,
  Sprite = PIXI.Sprite,
  Texture = PIXI.Texture,
  Text = PIXI.Text;

const app = new Application({
  autoResize: true,
  resolution: devicePixelRatio,
  transparent: true
});

const MENU_SIZE = 3;
const CARD_COUNT = 144;

document.body.appendChild(app.view);
var menuContainer = new Container();
var sceneContainers = [];
for (let i = 0; i < MENU_SIZE; i++) {
  sceneContainers.push(new Container());
}
var animatedObjects = new Container();
var leftStack = new Container();
var rightStack = new Container();
var emitter;

var state = menu;

PIXI.loader
  .add("img/card.png")
  .add("img/r1.png")
  .add("img/r2.png")
  .add("img/r3.png")
  .add("img/r4.png")
  .add("img/r5.png")
  .add("img/r6.png")
  .add("img/r7.png")
  .add("img/particle.png")
  .load(setup);

function simpleMenuItem(position, text, color, action) {

  var item = new Graphics()
    .beginFill(color)
    .drawRect(0, app.screen.height / MENU_SIZE * position, app.screen.width, app.screen.height / MENU_SIZE);

  item.interactive = true;
  item.buttonMode = true;
  item.on('pointerdown', onClick);

  var basicText = new PIXI.Text(text);
  basicText.x = item.width / 2 - basicText.width / 2;
  basicText.y = app.screen.height / MENU_SIZE * position + item.height / 2 - basicText.height / 2;
  item.addChild(basicText);

  function onClick() {
    menuContainer.visible = false;
    state = action;
    sceneContainers[position].visible = true;
  }

  return item;

}


function setup() {

  sceneContainers[0].visible = false;
  sceneContainers[1].visible = false;
  sceneContainers[2].visible = false;

  app.stage.addChild(menuContainer);
  app.stage.addChild(sceneContainers[0]);
  app.stage.addChild(sceneContainers[1]);
  app.stage.addChild(sceneContainers[2]);

  menuContainer.addChild(simpleMenuItem(0, "Card Stacks", 0xff0000, cardDemo));
  menuContainer.addChild(simpleMenuItem(1, "Random Image/Text", 0x00ff00, imageTexterDemo));
  menuContainer.addChild(simpleMenuItem(2, "Flame Particles", 0x0000ff, particleDemo));


  //menuContainer.addChild(basicText);

  window.addEventListener('resize', resize);

  setupCardDemo();
  //setupImageTexterDemo();
  setupParticleDemo();
  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));
  //app.ticker.autoStart = false;
  //app.ticker.stop();

  emitter.emit = true;

  resize();

}


function gameLoop(delta) {
  //Update the current game state:
  state(delta);

}

function menu(delta) {

}

function setupCardDemo() {

  sceneContainers[0].addChild(fpsText);

  animatedObjects.x = (app.screen.width - animatedObjects.width) / 3;
  animatedObjects.y = (app.screen.height - animatedObjects.height) / 2;
  leftStack.x = animatedObjects.x;
  leftStack.y = animatedObjects.y;
  rightStack.x = 2 * animatedObjects.x;
  rightStack.y = animatedObjects.y;

  sceneContainers[0].addChild(leftStack);
  sceneContainers[0].addChild(rightStack);
  sceneContainers[0].addChild(animatedObjects);

  for (var i = 0; i < CARD_COUNT; i++) {
    let card = new Sprite(PIXI.loader.resources["img/card.png"].texture);
    card.anchor.set(0.5);
    card.x = 0;
    card.y += i * 3;
    card.interactive = false;
    card.cacheAsBitmap = true;

    leftStack.addChild(card);
  }
}

function setupImageTexterDemo() {
//Object pooling can be done for better performance.
  if(sceneContainers[1].children.length > 0){
      let myContainer = sceneContainers[1].removeChildAt(0);
      myContainer.destroy({children:true, texture:false, baseTexture:false});
    //check GC of pixi environment
  }
  sceneContainers[1].addChild(getRandomImageTexter(3));
}

var dummyTexts = [
  'SRP – Single Responsibility Principle.',
  'OCP – Open/Closed Principle.',
  'LSP – Liskov Substitution Principle.',
  'ISP – Interface Segregation Principle.',
  'DIP – \n Dependency Inversion Principle.',
  'short text',
  'I DONT USE CAPITAL LETTERS PARADOX',
  'very very very very very very very very very very very very very long text',
  'May the force be with you! Always',
  'This text \n is multiple \n lines \n x2\n \n \n Right?' 
]

function getRandomImageTexter(numOfSlots){
  var randomTexter = new ImageTexter();

  for(let i = 0;i<numOfSlots;++i){
    var prob = getRandomInt(1,2);
    if(prob % 2 === 0){
      randomTexter.addText(0, dummyTexts[getRandomInt(0,dummyTexts.length-1)], getRandomInt(10,120), getRandomColor(), 300);
    } else{
      randomTexter.addImage(0, 'img/r'+getRandomInt(1,7)+'.png', 300);
    }
  }

    randomTexter.x = (app.screen.width - animatedObjects.width) / MENU_SIZE;
    randomTexter.y = (app.screen.height - animatedObjects.height) / 2;

  return randomTexter;
}

function setupParticleDemo() {
  emitter = new PIXI.particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    sceneContainers[2],

    // The collection of particle images to use
    [PIXI.Texture.fromImage('img/particle.png')],

    // Emitter configuration, edit this to change the look
    // of the emitter
    {
      "alpha": {
        "start": 0.86,
        "end": 0.05
      },
      "scale": {
        "start": 0.25,
        "end": 0.75,
        "minimumScaleMultiplier": 3.2
      },
      "color": {
        "start": "#ffe375",
        "end": "#eb3e23"
      },
      "speed": {
        "start": 50,
        "end": 200,
        "minimumSpeedMultiplier": 1
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 0,
      "startRotation": {
        "min": 265,
        "max": 275
      },
      "noRotation": false,
      "rotationSpeed": {
        "min": 50,
        "max": 50
      },
      "lifetime": {
        "min": 0.3,
        "max": 0.75
      },
      "blendMode": "normal",
      "frequency": 0.003,
      "emitterLifetime": -1,
      "maxParticles": 10,
      "pos": {
        "x": app.screen.width / 2,
        "y": app.screen.height / 2
      },
      "addAtBack": true,
      "spawnType": "circle",
      "spawnCircle": {
        "x": 5,
        "y": 2,
        "r": 4
      }
    }
  );

}


var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var counter = 0;
var first = then;
var last = 0;
var twoSeconds = false;
var fpsCounter = 0;
var fpsText = new Text("init");
var seconds = 0;
fpsText.x = 50;
fpsText.y = 50;

function cardDemo(delta) {
  var time_el = 0;
  now = Date.now();
  delta = now - then;
  //console.log(delta);

  if (delta > interval) {
    then = now - (delta % interval);

    // ... Code for Drawing the Frame ...
    time_el = (then - first) / 1000;
    if (last < parseInt(time_el) % 10000) {

      var animatedLength = animatedObjects.children.length;
      var leftLength = leftStack.children.length;
      last = parseInt(time_el) % 10000;

      if (animatedLength > 0 && seconds > 1) {
        var stopAnimate = animatedObjects.removeChildAt(animatedLength - 1);
        rightStack.addChild(stopAnimate);
        stopAnimate.x = 0;
      }
      if (leftLength > 0) {
        animatedObjects.addChildAt(leftStack.removeChildAt(leftLength - 1), 0);
      }
      if (seconds < 10)
        seconds++;
    }

    animatedLength = animatedObjects.children.length;

    for (let i = 0; i < animatedLength; ++i) {
      //  animatedObjects[i].vx = 1*delta/1000;
      animatedObjects.getChildAt(i).x += (rightStack.x - leftStack.x) / (app.ticker.FPS * 2);
    }

    fpsText.text = ++counter + 'f / ' + parseInt(time_el) + 's = ' + parseInt(counter / time_el) + 'fps ' + app.ticker.FPS + ' ticker';
  }

}

function imageTexterDemo(delta) {
  var time_el = 0;
  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    time_el = (then - first) / 1000;
    if (last + 1 < parseInt(time_el) % 1000) {

      last = parseInt(time_el) % 1000;
      setupImageTexterDemo();
    }
  }

}

var elapsed = Date.now();

function particleDemo(delta) {
  // Update the next frame
  requestAnimationFrame(particleDemo);

  var now = Date.now();

  // The emitter requires the elapsed
  // number of seconds since the last update
  emitter.update((now - elapsed) * 0.001);
  elapsed = now;

  // Should re-render the PIXI Stage
  // renderer.render(stage);
}


function resize() {
  // Resize the renderer
  app.renderer.resize(window.innerWidth, window.innerHeight);
  menuContainer.width = app.screen.width;
  menuContainer.height = app.screen.height;

  animatedObjects.x = (app.screen.width - animatedObjects.width) / MENU_SIZE;
  animatedObjects.y = (app.screen.height - animatedObjects.height) / 2;
  leftStack.x = animatedObjects.x;
  leftStack.y = animatedObjects.y;
  rightStack.x = 2 * animatedObjects.x;
  rightStack.y = animatedObjects.y;
  if(sceneContainers[1].children.length > 0){
    sceneContainers[1].childAt(0).x = (app.screen.width - animatedObjects.width) / MENU_SIZE;
    sceneContainers[1].childAt(0).y = (app.screen.height - animatedObjects.height) / 2;
  }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
