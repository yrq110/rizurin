import { BaseCircle } from '../base/Circle';
import { drawHit } from '../hit/Circle';
import { setTransform } from './util';

export class Circle extends BaseCircle {
  public el: SVGCircleElement;
  constructor(config) {
    super(config);
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  }

  $drawMain(ctx: SVGSVGElement) {
    const el = this.el;
    setTransform(el, this.transform);
    const [x, y, radius] = [this.centerX, this.centerY, this.radius];
    el.setAttribute('cx', `${x || radius}`);
    el.setAttribute('cy', `${y || radius}`);
    el.setAttribute('r', `${radius}`);
    el.setAttribute('fill', this.color || this.hitColor);
    !el.parentElement && ctx.appendChild(el);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
