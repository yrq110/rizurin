import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
export abstract class BaseCurve extends Shape {
  public readonly shapeType = SHAPES.CURV;
  constructor(config) {
    super(config);
  }
}
