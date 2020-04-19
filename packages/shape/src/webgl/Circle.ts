import { Color } from '@rizurin/util';
// @ts-ignore
import * as twgl from 'twgl.js';
import { BaseCircle } from '../base/Circle';
import { drawHit } from '../hit/Circle';

export class Circle extends BaseCircle {
  constructor(config) {
    super(config);
  }

  $drawMain(ctx: any) {
    const { width: W, height: H } = ctx.canvas;
    const { program: programInfo } = ctx;
    const [x, y, radius] = [this.centerX, this.centerY, this.radius];
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
    /**
     * Setting buffer and attribute data
     */
    const vertexPosition = [x || radius, y || radius];
    for (let i = 0; i <= 360; i += 1) {
      const j = i * Math.PI / 180;
      const vert = [(x || radius) + radius * Math.sin(j), (y || radius) + radius * Math.cos(j)];
      vertexPosition.push(...vert);
    }
    const arrays = {
      position: {
        numComponents: 2,
        data: vertexPosition,
      },
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(ctx, arrays);
    twgl.setBuffersAndAttributes(ctx, programInfo, bufferInfo);
    // Draw
    twgl.drawBufferInfo(ctx, bufferInfo, ctx.TRIANGLE_FAN);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
