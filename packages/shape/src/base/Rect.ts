
import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
export abstract class BaseRect extends Shape {
  public readonly shapeType = SHAPES.RECT;
  // public color: string
  constructor(config) {
    super(config);
    // this.color = config.color
  }
}
