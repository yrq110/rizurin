import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
export abstract class BasePolygon extends Shape {
  public readonly shapeType = SHAPES.POLY;
  public points: number[];
  constructor(config) {
    super(config);
    this.points = config.points;
  }
}
