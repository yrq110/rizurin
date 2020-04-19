import { BaseCircle } from '../base/Circle';
import { drawHit } from '../hit/Circle';
export class Circle extends BaseCircle {
  $drawMain(ctx: CanvasRenderingContext2D) {
    const [x, y, radius] = [this.centerX, this.centerY, this.radius];
    ctx.fillStyle = this.hitColor;
    ctx.save();
    ctx.transform(...this.transform.matrix());
    ctx.beginPath();
    ctx.arc(x || radius, y || radius, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
