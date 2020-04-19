import { Shape } from '@rizurin/core';
import { SHAPES } from '../const';
type BaseTextOption = {
  text: string,
  fontSize: string
  maxWidth?: number,
};
export abstract class BaseText extends Shape {
  public readonly shapeType = SHAPES.TEXT;
  public text: string;
  public fontSize: string;
  public maxWidth: number;
  constructor(config) {
    super(config);
    this.text = config.text;
    this.fontSize = config.fontSize || '20px';
    // this.maxWidth = config.maxWidth || 0
    this.maxWidth = 0;
  }
}
