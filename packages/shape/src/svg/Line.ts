import { BaseLine } from '../base/Line';
import { drawHit } from '../hit/Line';
import { setTransform } from './util';

export class Line extends BaseLine {
  public el: SVGPolylineElement;
  constructor(config) {
    super(config);
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  }

  $drawMain(ctx: SVGSVGElement) {
    const points = this.points.slice();
    // let pts = points.slice()
    const el = this.el;
    setTransform(el, this.transform);
    el.setAttribute('points', `${points.join(' ')}`);
    el.setAttribute('stroke', this.color || this.hitColor);
    el.setAttribute('fill', 'none');
    !el.parentElement && ctx.appendChild(el);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
