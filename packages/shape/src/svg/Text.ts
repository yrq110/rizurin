import { BaseText } from '../base/Text';
import { drawHit } from '../hit/Text';
import { setTransform } from './util';

export class Text extends BaseText {
  public el: SVGTextElement;
  constructor(config) {
    super(config);
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  }

  $drawMain(context: SVGSVGElement) {
    const text = this.text;
    const fontSize = this.fontSize;
    const el = this.el;
    setTransform(el, this.transform);
    el.setAttribute('x', `${-this.offsetX}`);
    el.setAttribute('y', `${-this.offsetY}`);
    el.setAttribute('font-size', `${fontSize}`);
    el.setAttribute('fill', this.color || this.hitColor);
    el.textContent = text;
    !el.parentElement && context.appendChild(el);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
