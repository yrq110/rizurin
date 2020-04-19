import { Color } from '@rizurin/util';
// @ts-ignore
import * as twgl from 'twgl.js';
import { BaseText } from '../base/Text';
import { drawHit } from '../hit/Text';

const { primitives, m4 } = twgl;
export class Text extends BaseText {
  $drawMain(ctx: any) {
    const { width: W, height: H } = ctx.canvas;
    const { texProgram: programInfo } = ctx;
    const text = this.text;
    const gl = ctx;
    console.log(programInfo);
    ctx.useProgram(programInfo.program);

    const bufferInfo = primitives.createPlaneBufferInfo(ctx, 1, 1, 1, 1, m4.rotationX(Math.PI / 2));
    // // m4.identity() - m4.rotationX(Math.PI / 2)
    twgl.setBuffersAndAttributes(ctx, programInfo, bufferInfo);
    const rgb = Color.hexToRgb(ctx.fillStyle || this.hitColor);
    const textCtx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    const [width, height] = [58 * text.length, 102];
    textCtx.canvas.width  = width;
    textCtx.canvas.height = height;
    textCtx.font = '80px Arial';
    textCtx.textAlign = 'left';
    textCtx.textBaseline = 'middle';
    textCtx.fillStyle = 'white';
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, 0, 0);

    const uniforms = {
      uFragColor: Color.getNormalColors(rgb),
      u_matrix: new Float32Array([]),
      // uTexture: null,
      uResolution: [W, H],
    };
    // let mat = m4.identity();
    const m = this.transform.matrix();
    const mat = new Float32Array([
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0,    0, 1, 0,
      m[4], m[5], 0, 1,
    ]);
    console.log('text matrix: ', mat);
    // const textTex = twgl.createTexture(gl, { src: textCtx.canvas });
    uniforms.u_matrix = mat;
    // uniforms.uTexture = textTex;
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(ctx, bufferInfo, ctx.TRIANGLES);
    // }
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
