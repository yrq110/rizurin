import { Color } from '@rizurin/util';
import { BaseLine } from '../base/Line';
import { drawHit } from '../hit/Line';

export class Line extends BaseLine {
  normalColor(val: number): number {
    return val / 255;
  }

  $drawMain(ctx: any) {
    const { canvas, gpu } = ctx;
    const { clientWidth: W, clientHeight: H } = canvas;
    const m = this.transform.matrix();
    const modelTransform = [
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0,    0, 1, 0,
      m[4], m[5], 0, 1,
    ];
    const uResolution = [W, H];
    const uniformsBufferView = new Float32Array(modelTransform.concat(uResolution));

    const {
      device, uniformsBindGroupLayout, renderPassEncoder,
      pipelines: { lineListPipeline },
    } = gpu;
    renderPassEncoder.setPipeline(lineListPipeline);
    /**
     * init data array
     */
    const points = this.points.slice();
    const rgb = Color.hexToRgb(ctx.fillStyle || this.hitColor);
    const colorArray = new Float32Array([
      this.normalColor(rgb.r), this.normalColor(rgb.g), this.normalColor(rgb.b), 1.0,
    ]);
    const vertex:number[] = [];
    for (let i = 0; i < points.length; i = i + 2) {
      vertex.push(
        points[i], points[i + 1], 0,
        points[i + 2], points[i + 3], 0,
      );
    }
    const vertexArray = new Float32Array(vertex);
    /**
     * init render buffers
     */
    // @ts-ignore
    const vertexBuffer: GPUBuffer = device.createBuffer({
      size: vertexArray.length * 4,
      // @ts-ignore
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    vertexBuffer.setSubData(0, vertexArray);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    // @ts-ignore
    const colorBuffer: GPUBuffer = device.createBuffer({
      size: colorArray.length * 4,
        // @ts-ignore
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    colorBuffer.setSubData(0, colorArray);
    renderPassEncoder.setVertexBuffer(1, colorBuffer, 0);

    const uniformBuffer = device.createBuffer({
      size:  4 * uniformsBufferView.length,
      // @ts-ignore
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    uniformBuffer.setSubData(0, uniformsBufferView);
    const uniformBindGroup = device.createBindGroup({
      layout: uniformsBindGroupLayout,
      entries: [{
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      }],
    });
    renderPassEncoder.setBindGroup(0, uniformBindGroup);

    /**
     * draw content
     */
    renderPassEncoder.draw(vertexArray.length, 1, 0, 0);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
