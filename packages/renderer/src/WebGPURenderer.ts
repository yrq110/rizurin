import { Renderer }  from '@rizurin/core';
import glslangJs from '@webgpu/glslang/dist/web-devel-onefile/glslang.js';

const glslang = undefined;
const glslModule = async () => {
  if (glslang !== undefined) return glslang;
  const glslangModule = await glslangJs();
  return glslangModule;
};

export class WebGPURenderer extends Renderer {
  readonly name = 'webgpu-renderer';
  public canvas?: HTMLCanvasElement;
  public context: any; //
  public hitCanvas: HTMLCanvasElement | undefined;
  public hitContext: CanvasRenderingContext2D | undefined;
  public clearColor: any = { r: 1, g: 1, b: 1, a: 1.0 };
  public glslModule: any;
  private vertShader: string = `#version 450
        layout(binding = 0) uniform Uniforms {
            mat4 uModelTransform;
            vec2 uResolution;
        };
        layout(location = 0) in vec3 aVertexPosition;
        layout(location = 1) in vec4 aVertexColor;
        layout(location = 0) out vec4 vColor;
        void main() {
            vec2 position = (uModelTransform * vec4(aVertexPosition, 1.0)).xy;
            vec2 mapping = position / uResolution;
            vec2 clipSpace = mapping * 2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            vColor = aVertexColor;
        }
    `;
  private fragShader: string = `#version 450
        layout(location = 0) in vec4 vColor;
        layout(location = 0) out vec4 outColor;
        void main() {
            outColor = vColor;
        }
    `;

  constructor(option) {
    super();
    const targetCanvas = option.canvas;
    // @ts-ignore
    return (async () => {
      const glslLoader = await glslModule();
      this.glslModule = glslLoader;
      this.canvas = targetCanvas;
      // chrome webgpu context flag: 'gpupresent'
      this.context = this.canvas && this.canvas.getContext('gpupresent');
      this.context['canvas'] = this.canvas;
      this.context['commands'] = [];
      this.context['gpu'] = await this.$init();
      this.hitCanvas = document.createElement('canvas');
      const { width, height } = this.canvas as HTMLCanvasElement;
      this.hitCanvas.classList.add('container');
      this.hitCanvas.width = width;
      this.hitCanvas.height = height;
      this.hitContext = this.hitCanvas.getContext('2d') as CanvasRenderingContext2D;
      return this;
    })();
  }

  protected createRenderPass(option) {
    const { device, clearColor, swapChain } = option;
    const commandEncoder = device.createCommandEncoder();
        // @ts-ignore
    const renderPassDescricptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        attachment: swapChain.getCurrentTexture().createView(),
        loadValue: clearColor,
      }],
    };
    const renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescricptor);
    return { commandEncoder, renderPassEncoder };
  }
  protected createPipeline(device, option) {
    const { layout, glslang, swapChainFormat, primitiveTopology } = option;
    return device.createRenderPipeline({
      layout,
      primitiveTopology,
      vertexStage: {
        module: device.createShaderModule({
          code: glslang.compileGLSL(this.vertShader, 'vertex'),
                    // @ts-ignore
          source: this.vertShader,
          transform: source => glslang.compileGLSL(source, 'vertex'),
        }),
        entryPoint: 'main',
      },
      fragmentStage: {
        module: device.createShaderModule({
          code: glslang.compileGLSL(this.fragShader, 'fragment'),
                    // @ts-ignore
          source: this.fragShader,
          transform: source => glslang.compileGLSL(source, 'fragment'),
        }),
        entryPoint: 'main',
      },
      vertexState: {
        indexFormat: 'uint32',
        vertexBuffers: [
          {
            arrayStride: 4 * 3,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float3',
              },
            ],
            stepMode: 'vertex',
          },
          {
            arrayStride: 4 * 4,
            attributes: [
              {
                shaderLocation: 1,
                offset: 0,
                format: 'float4',
              },
            ],
            stepMode: 'instance',
          },
        ],
      },
      colorStates: [{
        format: swapChainFormat,
      }],
    });
  }
  private async $init() {
    const context = this.context;
    const canvas = this.canvas;
    /**
     * init device and swapChain
     */
    const adapter = await (navigator as any).gpu.requestAdapter({
      powerPreference: 'high-performance',
    });
    const device = await adapter.requestDevice();
    const glslang = this.glslModule;
    const swapChainFormat = await this.context.getSwapChainPreferredFormat(device); // 'bgra8unorm'
    // @ts-ignore
    const swapChain: GPUSwapChain = context.configureSwapChain({
      device,
      format: swapChainFormat,
      // @ts-ignore
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    });
    /**
     * init pipeline
     */
    const uniformsBindGroupLayout = device.createBindGroupLayout({
      entries: [{
        binding: 0,
        // @ts-ignore
        visibility: GPUShaderStage.VERTEX,
        type: 'uniform-buffer',
      }],
    });
    // @ts-ignore
    const layout = device.createPipelineLayout({ bindGroupLayouts: [uniformsBindGroupLayout] });
    const baseOption = { layout, glslang, swapChainFormat };
    const merge = (base, topo) => Object.assign(base, { primitiveTopology: topo });
    const triListPipeline = this.createPipeline(device, merge(baseOption, 'triangle-list'));
    const lineListPipeline = this.createPipeline(device, merge(baseOption, 'line-list'));
    const pipelines = { triListPipeline, lineListPipeline };
    const { commandEncoder, renderPassEncoder } = this.createRenderPass({
      device, swapChain, clearColor: this.clearColor,
    });

    renderPassEncoder.setViewport(0, 0, canvas!.width, canvas!.height, 0, 1);

    return {
      device, glslang,
      swapChainFormat, swapChain, pipelines, uniformsBindGroupLayout,
      commandEncoder, renderPassEncoder };
  }

  protected $clear() {
    if (!this.context.gpu) return;
    const { swapChain, device } = this.context.gpu;
    this.context.gpu = Object.assign(
      this.context.gpu,
      this.createRenderPass({ device, swapChain, clearColor: this.clearColor }),
    );
  }
}

const CONTEXT_PROPERTIES = [
  'fillStyle',
];

CONTEXT_PROPERTIES.forEach(function (prop) {
  Object.defineProperty(WebGPURenderer.prototype, prop, {
    get() {
      return this.context[prop];
    },
    set(val) {
      this.context[prop] = val;
    },
  });
});
