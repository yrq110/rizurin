import { Color } from '@rizurin/util';
import { BaseRect } from '../base/Rect';
import { drawHit } from '../hit/Rect';

export class Rect extends BaseRect {
  constructor(config) {
    super(config);
  }

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
    const [width, height] = [this.width, this.height];
    const rgb = Color.hexToRgb(this.color || this.hitColor);
    const colorArray = new Float32Array([
      this.normalColor(rgb.r), this.normalColor(rgb.g), this.normalColor(rgb.b), 1.0,
    ]);
    const indexArray = new Uint32Array([0, 1, 2, 1, 2, 3]);
    let vertexArray = new Float32Array([
      0, 0, 0 ,
      0, height, 0 ,
      width, 0, 0 ,
      width, height, 0,
    ]);
    vertexArray = vertexArray.map((e, index) => {
      let delta = 0;
      switch (index % 3) {
      case 0: {
        delta = this.offsetX;
        break;
      }
      case 1: {
        delta = this.offsetY;
        break;
      }
      }
      return e - delta;
    });
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
    // @ts-ignore
    const indexBuffer: GPUBuffer = device.createBuffer({
      size: indexArray.length * 4,
      // @ts-ignore
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    indexBuffer.setSubData(0, indexArray);
    renderPassEncoder.setIndexBuffer(indexBuffer);
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
    renderPassEncoder.drawIndexed(indexArray.length, 1, 0, 0, 0);
  }

  $drawHit(ctx: CanvasRenderingContext2D) {
    drawHit(this, ctx);
  }
}
