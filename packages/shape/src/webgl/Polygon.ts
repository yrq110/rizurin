import { Color } from '@rizurin/util';
// @ts-ignore
import * as twgl from 'twgl.js';
import { BasePolygon } from '../base/Polygon';
import { drawHit } from '../hit/Polygon';

export class Polygon extends BasePolygon {
  constructor(config) {
    super(config);
  }

  $drawMain(ctx: any) {
    const { width: W, height: H } = ctx.canvas;
    const { program: programInfo } = ctx;
    const points = this.points.slice();
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
    // /**
    //  * Setting buffer and attribute data
    //  */
    const vertexPosition = [...points, points[0], points[1]];
    const arrays = {
      position: {
        numComponents: 2,
        data: vertexPosition,
      },
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(ctx, arrays);
    twgl.setBuffersAndAttributes(ctx, programInfo, bufferInfo);
    // Draw
    twgl.drawBufferInfo(ctx, bufferInfo, ctx.TRIANGLE_STRIP);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
