import { BaseText } from '../base/Text';
import { drawHit } from '../hit/Text';

export class Text extends BaseText {
  $drawMain(ctx: CanvasRenderingContext2D) {
    const text = this.text;
    const fontSize = this.fontSize;
    ctx.save();
    ctx.transform(...this.transform.matrix());
    ctx.fillStyle = this.hitColor;
    ctx.font = `${fontSize} san-serif`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, 0, 0, textWidth);
    ctx.restore();
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
