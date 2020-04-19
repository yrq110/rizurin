import { Node } from './Node';
export abstract class Container<T extends any>{
  public children: T[] = [];
  constructor() {
  }
  public add(child: T) { this.$add(child); }
  protected $add(child:T) {
    this.children.push(child);
  }

  public drawChildren(context, hitContext?) {
    this.children.map((child) => {
      child.drawMain(context);
      hitContext && child.drawHit(hitContext);
    });
  }

  protected $remove(child:T) {}
}
