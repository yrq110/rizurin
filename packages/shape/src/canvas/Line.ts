import { BaseLine } from '../base/Line';
import { drawHit } from '../hit/Line';
export class Line extends BaseLine {
  $drawMain(ctx: CanvasRenderingContext2D) {
    const pts = this.points.slice();
    ctx.strokeStyle = ctx.fillStyle || this.hitColor;
    ctx.save();
    ctx.transform(...this.transform.matrix());
    ctx.beginPath();
    ctx.moveTo(pts.shift()!, pts.shift()!);
    for (let i = 0; i < pts.length; i = i + 2) {
      ctx.lineTo(pts[i], pts[i + 1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
