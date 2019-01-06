import * as PIXI from 'pixi.js';

export class ImageTexter extends PIXI.Container {
  constructor() {
    super();
    this.Sprites = {};

    // others custom proprety for game obj
  }

  addText(order, text, size, color, gap) {
  //  color = 0xff1010;
    var newText = new PIXI.Text(text, {
      fontFamily: 'Arial',
      fontSize: size,
      fill: color,
      align: 'center'
    });
    newText.anchor.set(0.5);
    newText.width = gap+ getRandomInt(-10,10);
    newText.x += order * gap;
    newText.scale.y = newText.scale.x;


    this.addChildAt(newText, order);
    this.moveChildren(gap, order + 1);

  }

  addImage(order, path, gap) {
    //var newTexture = Texture.fromImage(path);
    var newSprite = new PIXI.Sprite(PIXI.loader.resources[path].texture);
    newSprite.anchor.set(0.5);
    newSprite.x += order * gap;

    this.addChildAt(newSprite, order);

    this.moveChildren(gap, order + 1);
  }

  moveChildren(gap, start) {
    for (let i = start; i < this.children.length; i++) {
      this.getChildAt(i).x += gap;
      //    this.getChildAt(i).y = this.height/2;
    }
  }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
