import { BaseRect } from '../base/Rect';
import { drawHit } from '../hit/Rect';

export class Rect extends BaseRect {

  $drawMain(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color || this.hitColor;
    ctx.transform(...this.transform.matrix());
    ctx.fillRect(-this.offsetX, -this.offsetY, this.width, this.height);
    ctx.restore();
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
