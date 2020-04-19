import { Shape } from './Shape';
import { Group } from './Group';

export type RendererChildType = Shape | Group;
export type RendererContextType = CanvasRenderingContext2D | WebGL2RenderingContext | SVGSVGElement;

export abstract class Renderer {
  readonly type = 'Renderer';
  abstract name: string;
  abstract canvas?: HTMLCanvasElement;
  abstract context: RendererContextType;
  abstract hitCanvas?: HTMLCanvasElement;
  abstract hitContext?: CanvasRenderingContext2D;
  protected events: any[] = [];

  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [callback];
    } else {
      this.events[event].push(callback);
    }
  }

  $emit(event, payload?) {
    const cbs = this.events[event];
    cbs && cbs.map(cb => cb(payload));
  }

  public clear() { this.$clear(); }
  protected abstract $clear(): void;
}
