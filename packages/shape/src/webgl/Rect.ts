import { Color } from '@rizurin/util';
// @ts-ignore
import * as twgl from 'twgl.js';
import { BaseRect } from '../base/Rect';
import { drawHit } from '../hit/Rect';

export class Rect extends BaseRect {
  constructor(config) {
    super(config);
  }

  $drawMain(ctx: any) {
    const { width: W, height: H } = ctx.canvas;
    const { program: programInfo } = ctx;
    const [width, height] = [this.width, this.height];
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
    const rgb = Color.hexToRgb(this.color || this.hitColor);
    const uniforms = {
      uModelMatrix: modelTransform,
      uResolution: [W, H],
      uFragColor: Color.getNormalColors(rgb),
    };
    twgl.setUniforms(programInfo, uniforms);

    /**
     * Setting buffer and attribute data
     */
    let vertexPosition = [
      0, 0,
      0, height,
      width, 0,
      width, height,
    ];
    // bind offset values to vertexPOsition
    vertexPosition = vertexPosition.map((e, index) => {
      const delta = (index % 2) ? this.offsetX : this.offsetY;
      return e - delta;
    });
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
