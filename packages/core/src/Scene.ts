import { Container } from './Container';
import { Layer, StaticLayer } from './Layer';

export type SceneConfig<T> = {
  container: T;
  width?: number;
  height?: number;
};
export type SceneChildType = Layer | StaticLayer;

export class Scene<Config extends SceneConfig<HTMLElement>> extends Container<SceneChildType> {
  readonly type = 'Scene';
  public children: Layer[] = [];
  public width: number;
  public height: number;
  public container: HTMLElement;
  private events: Record<string, Function[]> = {};

  constructor(config: Config) {
    super();
    this.container = config.container;
    this.container.style.position = 'relative';
    this.width = config.width || 400;
    this.height = config.height || 300;
    ['mousedown', 'pointerdown'].map((eventName) => {
      this.container.addEventListener((eventName), (e) => {
        const { offsetX: x, offsetY: y } = e as MouseEvent;
        const targets = this.children.map((layer) => {
          let results;
          if (layer instanceof Layer)  {
            results = layer.getHit(x, y);
          }
          return results;
        }).filter(e => e);
        this.emit(eventName, e, targets);
      });
    });

    ['mousemove', 'pointermove', 'mouseup', 'pointerup'].map((eventName) => {
      this.container.addEventListener((eventName), (e) => {
        this.emit(eventName, e);
      });
    });
  }

  emit(event, ...payload: any) {
    if (!this.events[event]) return;
    const handlers = this.events[event];
    handlers.map((h) => { h(...payload); });
  }

  on(event, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [callback];
    } else {
      this.events[event].push(callback);
    }
  }

  public add(child: SceneChildType): void {
    this.$add(child);
  }
  protected $add(child: SceneChildType): void {
    super.$add(child);
    if (child.canvas instanceof HTMLCanvasElement) {
      // HTMLCanvasElement
      child.canvas.width = this.width;
      child.canvas.height = this.height;
    } else {
      // SVGSVGElement
      child.canvas.setAttribute('width', `${this.width}`);
      child.canvas.setAttribute('height', `${this.height}`);
    }
    if (child instanceof Layer) {
      // Layer has hitCanvas, StaticLayer not
      child.hitCanvas!.width = this.width;
      child.hitCanvas!.height = this.height;
    }
    this.container.appendChild(child.canvas);
    child.draw();
    if (child.canvas instanceof SVGSVGElement) {
      this.container.removeChild(this.container.querySelector('svg')!);
      this.container.appendChild(child.context);
    }
  }

  public draw() {
    this.$draw();
  }
  protected $draw() {
    this.children.map(layer => layer.draw());
  }
}
