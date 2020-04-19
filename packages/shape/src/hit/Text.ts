import { BaseText } from '../base/Text';

export const drawHit = <T extends BaseText>(target: T, ctx: CanvasRenderingContext2D) => {
  const { text, fontSize, maxWidth } = target;
  ctx.save();
  ctx.transform(...target.transform.matrix());
  ctx.fillStyle = target.hitColor;
  ctx.font = `${fontSize} san-serif`;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, 0, 0, textWidth);
  ctx.restore();
};
