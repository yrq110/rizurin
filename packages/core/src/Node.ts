
import { Transform } from '@rizurin/util';
import { Renderer, RendererContextType } from './Renderer';
export type NodeConfigType = {
  [index: string]: any;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  listening?: boolean;
  id?: string;
  name?: string;
  opacity?: Number;
  draggable?: boolean;
  dragging?: boolean;
  renderer?: any;
};

export abstract class Node<Config extends NodeConfigType = NodeConfigType> {
  readonly type = 'Node';
  protected attrs: NodeConfigType = {};
  public transform: Transform;
  public renderer?: Renderer;
  constructor(config?: Config) {
    for (const key in config) {
      this.attrs[key] = config[key];
    }

    this.transform = new Transform(
      [1, 0, 0, 1, this.attrs['x'] || 0, this.attrs['y'] || 0],
    ); // local transform matrix
  }

  public drawMain(context?: RendererContextType) { this.$drawMain(context); }
  protected abstract $drawMain(context?: RendererContextType): void;

  public drawHit(context?: RendererContextType) { this.$drawHit(context); }
  protected abstract $drawHit(context?: RendererContextType): void;

  public draw() { this.$draw(); }
  protected $draw() {
    this.$drawMain();
    this.$drawHit();
    return this;
  }
}
