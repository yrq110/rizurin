import { BaseCircle } from '../base/Circle';

export const drawHit = <T extends BaseCircle>(target: T, ctx: CanvasRenderingContext2D) => {
  const { radius, centerX: x, centerY: y, offsetX, offsetY } = target;
  ctx.save();
  ctx.transform(...target.transform.matrix());
  ctx.fillStyle = target.hitColor;
  ctx.beginPath();
  ctx.arc(x || radius, y || radius, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};
