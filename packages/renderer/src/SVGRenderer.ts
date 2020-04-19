import { Renderer }  from '@rizurin/core';

type SVGElOption = {
  width?: number,
  height?: number,
};
const namespace = 'http://www.w3.org/2000/svg'

export class SVGRenderer extends Renderer {
  readonly name = 'svg-renderer';
  public canvas: HTMLCanvasElement;
  public context: SVGSVGElement;
  public hitCanvas: HTMLCanvasElement;
  public hitContext: CanvasRenderingContext2D;

  constructor(option) {
    super();
    this.canvas = option.canvas;
    const { width, height } = option.canvas;
    const svgElement = document.createElementNS(namespace, 'svg') as SVGSVGElement;
    svgElement.setAttribute('height', `${height}`);
    svgElement.setAttribute('width', `${width}`);
    this.context = svgElement;

    this.hitCanvas = document.createElement('canvas');
    this.hitCanvas.width = Number(width);
    this.hitCanvas.height = Number(height);
    this.hitContext = this.hitCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  protected $clear(): void {
    // rebind events to new svg element
    const { clientWidth: width, clientHeight: height } = this.canvas;
    this.context = SVGRenderer.createSVGElement({ height, width });
    this.hitContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  static createSVGElement(option: SVGElOption): SVGSVGElement {
    const { height, width } = option;
    const svgElement = document.createElementNS(namespace, 'svg');
    svgElement.setAttribute('height', `${height || 0}`);
    svgElement.setAttribute('width', `${width || 0}`);
    return svgElement;
  }
}
