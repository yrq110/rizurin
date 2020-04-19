import { BaseLine } from '../base/Line';

export const drawHit = <T extends BaseLine>(target: T, ctx: CanvasRenderingContext2D) => {
  const { points } = target;
  const pts = points.slice();
  ctx.strokeStyle = target.hitColor;
  ctx.save();
  ctx.transform(...target.transform.matrix());
  ctx.beginPath();
  ctx.moveTo(pts.shift()!, pts.shift()!);
  for (let i = 0; i < pts.length; i = i + 2) {
    ctx.lineTo(pts[i], pts[i + 1]);
  }
  ctx.stroke();
  ctx.restore();
};
