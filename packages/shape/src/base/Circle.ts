import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
export abstract class BaseCircle extends Shape {
  public readonly shapeType = SHAPES.CIRC;
  public radius: number;
  public centerX: number;
  public centerY: number;
  constructor(config) {
    super(config);
    this.radius = config.r;
    this.centerX = config.centerX;
    this.centerY = config.centerY;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }
}
