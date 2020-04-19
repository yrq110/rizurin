import { BasePolygon } from '../base/Polygon';
import { drawHit } from '../hit/Polygon';

export class Polygon extends BasePolygon {
  constructor(config) {
    super(config);
  }

  $drawMain(ctx: CanvasRenderingContext2D) {
    const pts = this.points.slice();
    ctx.save();
    ctx.transform(...this.transform.matrix());
    ctx.fillStyle = this.hitColor;
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i = i + 2) {
      ctx.lineTo(pts[i], pts[i + 1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
