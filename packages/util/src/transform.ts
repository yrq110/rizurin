/**
 * Inspired by Simon Sarris's code in KineticJS
 */
type Matrix = [number, number, number, number, number, number]
;

export class Transform {
  public localMatrix: Matrix;
  protected sx: number;
  protected sy: number;
  protected cx: number;
  protected cy: number;
  protected tx: number;
  protected ty: number;

  constructor(m: Matrix = [1, 0, 0, 1, 0, 0]) {
    /**
     *  Tansform matrix:
     *   sx, cx, tx
     *   cy, sy, ty
     *   0,  0,  1
     *  To flatten array:
     *   [sx, cy, cx, sy, tx, ty]
    */
    this.localMatrix = m;
    this.sx = m[0];
    this.cy = m[1];
    this.cx = m[2];
    this.sy = m[3];
    this.tx = m[4];
    this.ty = m[5];
  }

  public getOriginMatrix(): Matrix {
    return this.localMatrix;
  }

  public getTranslation() {
    return {
      x: this.tx,
      y: this.ty,
    };
  }

  public clone(): Transform {
    return new Transform(this.matrix());
  }

  public matrix(): Matrix {
    return [this.sx, this.cy, this.cx, this.sy, this.tx, this.ty];
  }

  public scale(x: number, y: number): Transform {
    this.sx *= x;
    this.cy *= x;
    this.cx *= y;
    this.sy *= y;
    return this;
  }

  public rotate(rad: number): Transform {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const m11 = this.sx * c + this.cx * s;
    const m12 = this.cy * c + this.sy * s;
    const m21 = this.sx * -s + this.cx * c;
    const m22 = this.cy * -s + this.sy * c;
    this.sx = m11;
    this.cy = m12;
    this.cx = m21;
    this.sy = m22;
    return this;
  }

  public translate(x: number, y?: number): Transform {
    const n = arguments.length;
    if (n > 2 || !n) return this;
    if (n === 2) {
      this.tx += this.sx * x + this.cx * y!;
      this.ty += this.cy * x + this.sy * y!;
    } else {
      this.tx += (this.sx + this.cx) * x;
      this.ty += (this.cy + this.sy) * x;
    }
    return this;
  }

  public multiply(matrix: Transform): Transform {
    const m11 = this.sx * matrix.sx + this.cx * matrix.cy;
    const m12 = this.cy * matrix.sx + this.sy * matrix.cy;

    const m21 = this.sx * matrix.cx + this.cx * matrix.sy;
    const m22 = this.cy * matrix.cx + this.sy * matrix.sy;

    const dx = this.sx * matrix.tx + this.cx * matrix.ty + this.tx;
    const dy = this.cy * matrix.tx + this.sy * matrix.ty + this.ty;

    this.sx = m11;
    this.cy = m12;
    this.cx = m21;
    this.sy = m22;
    this.tx = dx;
    this.ty = dy;
    return this;
  }

  public invert(): Transform {
    const d = 1 / (this.sx * this.sy - this.cy * this.cx);
    const m0 = this.sy * d;
    const m1 = -this.cy * d;
    const m2 = -this.cx * d;
    const m3 = this.sx * d;
    const m4 = d * (this.cx * this.ty - this.sy * this.tx);
    const m5 = d * (this.cy * this.tx - this.sx * this.ty);
    this.sx = m0;
    this.cy = m1;
    this.cx = m2;
    this.sy = m3;
    this.tx = m4;
    this.ty = m5;
    return this;
  }

  public setAbsolutePosition(x: number, y: number): Transform {
    const m = this.localMatrix;
    const yt = (m[0] * (y - m[5]) - m[1] * (x - m[4])) / (m[0] * m[3] - m[1] * m[2]);
    const xt = (x - m[4] - m[2] * yt) / m[0];
    return this.translate(xt, yt);
  }
}
