import { BasePolygon } from '../base/Polygon';

export const drawHit = <T extends BasePolygon>(target: T, ctx: CanvasRenderingContext2D) => {
  const pts = target.points;
  ctx.save();
  ctx.transform(...target.transform.matrix());
  ctx.fillStyle = target.hitColor;
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i = i + 2) {
    ctx.lineTo(pts[i], pts[i + 1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
