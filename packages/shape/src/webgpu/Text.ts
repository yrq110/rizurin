import { BaseText } from '../base/Text';
import { drawHit } from '../hit/Text';
export class Text extends BaseText {
  $drawMain(context: CanvasRenderingContext2D) {

  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
