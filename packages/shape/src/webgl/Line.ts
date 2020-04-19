import { Color } from '@rizurin/util';
// @ts-ignore
import * as twgl from 'twgl.js';
import { BaseLine } from '../base/Line';
import { drawHit } from '../hit/Line';

export class Line extends BaseLine {
  $drawMain(ctx: any) {
    const points = this.points.slice();
    const { width: W, height: H } = ctx.canvas;
    const { program: programInfo } = ctx;
    ctx.useProgram(programInfo.program);
    /**
     * Setting uniform data
     */
    const m = this.transform.matrix();
    const modelTransform = [
      m[0], m[1], 0,
      m[2], m[3], 0,
      m[4], m[5], 1,
    ];
    const rgb = Color.hexToRgb(ctx.fillStyle || this.hitColor);
    const uniforms = {
      uModelMatrix: modelTransform,
      uResolution: [W, H],
      uFragColor: Color.getNormalColors(rgb),
    };
    twgl.setUniforms(programInfo, uniforms);

    const vertexPosition = points;
    const arrays = {
      position: {
        numComponents: 2,
        data: vertexPosition,
      },
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(ctx, arrays);
    twgl.setBuffersAndAttributes(ctx, programInfo, bufferInfo);
    // Draw
    twgl.drawBufferInfo(ctx, bufferInfo, ctx.LINE_STRIP);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
