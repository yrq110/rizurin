import { BasePolygon } from '../base/Polygon';
import { drawHit } from '../hit/Polygon';
import { setTransform } from './util';

export class Polygon extends BasePolygon {
  public el: SVGPolygonElement;
  constructor(config) {
    super(config);
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  }

  $drawMain(ctx: SVGSVGElement) {
    const points = this.points.slice();
    const el = this.el;
    setTransform(el, this.transform);
    // const pts = points.map((p, idx) => {
    //   if (!idx) return p
    //   return idx % 2 ?  `,${p}` : ` ${p}`
    // })
    el.setAttribute('points', `${points.join(' ')}`);
    el.setAttribute('fill', this.color || this.hitColor);
    !el.parentElement && ctx.appendChild(el);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
