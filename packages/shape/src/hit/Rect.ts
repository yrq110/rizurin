import { BaseRect } from '../base/Rect';

export const drawHit = <T extends BaseRect>(target: T, ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.fillStyle = target.hitColor;
  ctx.transform(...target.transform.matrix());
  ctx.fillRect(-target.offsetX, -target.offsetY, target.width, target.height);
  ctx.restore();
};
