import { BaseRect } from '../base/Rect';
import { drawHit } from '../hit/Rect';
import { setTransform } from './util';

export class Rect extends BaseRect {
  public el: SVGRectElement;
  constructor(config) {
    super(config);
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  }

  $drawMain(ctx: SVGSVGElement) {
    const el = this.el;
    setTransform(el, this.transform);
    el.setAttribute('x', `${-this.offsetX}`);
    el.setAttribute('y', `${-this.offsetY}`);
    el.setAttribute('height', `${this.height}`);
    el.setAttribute('width', `${this.width}`);
    el.setAttribute('fill', this.color || this.hitColor);
    !el.parentElement && ctx.appendChild(el);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
