import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
export abstract class BaseLine extends Shape {
  public readonly shapeType = SHAPES.CIRC;
  public points: number[];
  constructor(config) {
    super(config);
    this.points = config.points;
  }
}
