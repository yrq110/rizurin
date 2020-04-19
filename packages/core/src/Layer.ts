import { Color } from '@rizurin/util';
import { Shape, shapes } from './Shape';
import { Container } from './Container';
import { Group } from './Group';
import { Renderer } from './Renderer';

export type LayerConfigType = {
  canvas?: HTMLCanvasElement,
};
export type LayerChildType = Group | Shape | any;
export class StaticLayer<Config extends LayerConfigType = LayerConfigType>
  extends Container<LayerChildType>{
  readonly type: string = 'Layer';
  public renderer: any;
  public canvas: HTMLCanvasElement | SVGSVGElement;
  public context: any;
  public shapeKeys: string[] = [];

  constructor(config?: Config) {
    super();

    this.canvas = config && config.canvas || document.createElement('canvas');
  }

  public bind(renderer: Renderer) {
    this.renderer = renderer;
    if (renderer.name === 'svg-renderer') {
      this.canvas = renderer.context as SVGSVGElement;
    }
    this.context = renderer.context;
  }

  public clear() {
    this.renderer && this.renderer.clear();
  }

  public add(child: LayerChildType) {
    this.$add(child);
  }

  protected $add(child: LayerChildType) {
    super.$add(child);
    if (child instanceof Shape) {
      this.shapeKeys.push(child.hitColor);
    }
  }

  protected $draw() {
    this.children.map((child) => {
      if (child instanceof Group) {
        child.drawChildren(this.context);
      } else if (child instanceof Shape) {
        child.drawMain(this.context);
      }
    });
  }

  public draw() {
    this.clear();
    this.context['commands'] = []; // for webgpu renderer
    this.$draw();
    /* svg renderer part */
    if (this.renderer.name === 'svg') {
      this.canvas = this.renderer.context;
    }
    /* webgpu renderer part */
    if (!this.context.gpu) return;
    const { device, renderPassEncoder, commandEncoder } = this.context.gpu;
    renderPassEncoder.endPass();
    device.defaultQueue.submit([commandEncoder.finish()]);
  }
}
export class Layer extends StaticLayer {
  public hitCanvas?: HTMLCanvasElement;
  public hitContext?: CanvasRenderingContext2D;

  public bind(renderer: Renderer) {
    super.bind(renderer);
    this.hitCanvas = renderer.hitCanvas;
    this.hitContext = renderer.hitContext;
  }

  public getHit(x, y): Shape | null {
    if(!this.hitContext) return null
    const p = this.hitContext.getImageData(x, y, 1, 1).data || [];
    if (p.length < 3) return null;
    const hexColor = `#${Color.rgbToHex(p[0], p[1], p[2])}`;
    if (Object.keys(shapes).includes(hexColor)) {
      return shapes[hexColor];
    }
    return null;
  }

  protected $draw() {
    this.children.map((child) => {
      if (child instanceof Group) {
        child.drawChildren(this.context, this.hitContext);
      } else if (child instanceof Shape) {
        child.drawMain(this.context);
        child.drawHit(this.hitContext);
      }
    });
  }
}
