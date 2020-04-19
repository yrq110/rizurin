import { Color } from '@rizurin/util';
import { BaseCircle } from '../base/Circle';
import { drawHit } from '../hit/Circle';

export class Circle extends BaseCircle {
  normalColor(val: number): number {
    return val / 255;
  }

  $drawMain(ctx) {
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
      pipelines: { triListPipeline },
    } = gpu;
    renderPassEncoder.setPipeline(triListPipeline);
    /**
     * init data array
     */
    const [x, y, radius] = [this.centerX, this.centerY, this.radius];
    const rgb = Color.hexToRgb(ctx.fillStyle || this.hitColor);
    const colorArray = new Float32Array([
      this.normalColor(rgb.r), this.normalColor(rgb.g), this.normalColor(rgb.b), 1.0,
    ]);
    const vertex:number[] = [];
    for (let i = 0; i <= 360; i += 1) {
      const j1 = i * Math.PI / 180;
      const j2 = (i + 1) * Math.PI / 180;
      const [vx, vy] = [x || radius, y || radius];
      vertex.push(
        vx, vy, 0,
        vx + radius * Math.sin(j1), vy + radius * Math.cos(j1), 0,
        vx + radius * Math.sin(j2), vy + radius * Math.cos(j2), 0,
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
