import { Renderer }  from '@rizurin/core';

const CONTEXT_PROPERTIES = [
  'fillStyle',
];

export class CanvasRenderer extends Renderer {
  readonly name = 'canvas-renderer';
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public hitCanvas: HTMLCanvasElement;
  public hitContext: CanvasRenderingContext2D;

  constructor(option) {
    super();
    this.canvas = option.canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.hitCanvas = document.createElement('canvas');
    const { width, height } = this.canvas;
    this.hitCanvas.width = width;
    this.hitCanvas.height = height;
    this.hitContext = this.hitCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  protected $clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hitContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

CONTEXT_PROPERTIES.forEach(function (prop) {
  Object.defineProperty(CanvasRenderer.prototype, prop, {
    get() {
      return this.context[prop];
    },
    set(val) {
      this.context[prop] = val;
    },
  });
});
