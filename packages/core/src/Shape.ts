import { Color, Transform } from '@rizurin/util';
import { Node, NodeConfigType } from './Node';
import { RendererContextType } from './Renderer';

export const shapes = {};

type ShapeConfigType = NodeConfigType & {
  $drawMain?: (context: RendererContextType) => void;
  $drawHit?: (context: RendererContextType) => void;
};

type ShapeFitConfigType = {
  x: number;
  y: number;
};

export abstract class Shape extends Node {
  protected attrs: NodeConfigType = {};
  public hitColor: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public originX: number = 0;
  public originY: number = 0;
  public offsetX: number = 0;
  public offsetY: number = 0;
  public translateX: number = 0;
  public translateY: number = 0;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public rotation: number = 0;
  public visiabe: boolean = true;
  public draggable: boolean = true;
  public dragging: boolean = false;
  public color: string = '';

  constructor(config: ShapeConfigType) {
    super(config);
    for (const k in config) {
      (this[k] !== undefined) && (this[k] = config[k]);
    }
    this.originX = config.x || 0;
    this.originY = config.y || 0;

    let key;
    while (true) {
      key = Color.getRandomColor();
      if (key && !(key in shapes)) {
        break;
      }
    }
    config.$drawMain && (this.$drawMain = config.$drawMain);
    config.$drawHit && (this.$drawHit = config.$drawHit);
    this.hitColor = key;
    shapes[key] = this;
  }

  public fitInto(attrs: ShapeFitConfigType) {
    this.x = attrs.x;
    this.y = attrs.y;
    this.originX = attrs.x;
    this.originY = attrs.y;
    this.resetTransform();
  }

  public resetTransform(): Transform {
    const m = new Transform();
    if (this.x !== 0 || this.y !== 0) {
      m.translate(this.x, this.y);
    }
    if (this.rotation !== 0) {
      m.rotate(this.rotation);
    }
    if (this.scaleX !== 1 || this.scaleY !== 1) {
      m.scale(this.scaleX, this.scaleY);
    }
    this.transform = m;
    return this.transform;
  }

  public translate(x: number, y: number): void {
    this.translateX += x;
    this.translateY += y;
    this.transform.translate(x, y);
  }

  public scale(x: number, y?: number): void {
    const sx = x;
    const sy = y || x;
    this.scaleX *= sx;
    this.scaleY *= sy;
    this.transform.scale(sx, sy);
  }

  public rotate(deg: number): void {
    this.rotation += deg;
    this.transform.rotate(deg);
  }
}
