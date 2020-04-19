import { Renderer }  from '@rizurin/core';
// @ts-ignore
import * as twgl from 'twgl.js';

export class WebGLRenderer extends Renderer {
  readonly name = 'webgl-renderer';
  public canvas: HTMLCanvasElement;
  public context: WebGL2RenderingContext;
  public hitCanvas: HTMLCanvasElement;
  public hitContext: CanvasRenderingContext2D;
  private vertShader: string = `
        attribute vec2 position;
        uniform mat3 uModelMatrix;
        uniform vec2 uResolution;
        void main() {
            vec2 position = (uModelMatrix * vec3(position, 1)).xy;
            vec2 mapping = position / uResolution;
            vec2 clipSpace = mapping * 2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;
  private fragShader: string = `
        precision mediump float;
        uniform vec3 uFragColor;
        void main() {
            gl_FragColor = vec4(uFragColor, 1.0);
        }
    `;

  private texVertShader: string = `
        // attribute vec3 position;
        // uniform mat3 uModelMatrix;
        // uniform vec2 uResolution;

        attribute vec2 texcoord;
        varying vec2 vTexcoord;

        attribute vec4 position;
        uniform vec2 uResolution;
        uniform mat4 u_matrix;
        uniform mat4 textureMatrix;

        void main() {
            // vec2 m_position = (u_matrix * position).xy;
            // vec2 mapping = m_position / uResolution;
            // vec2 clipSpace = mapping * 2.0 - 1.0;
            // gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            // gl_Position = vec4(position, 0, 1);
            gl_Position = position;
            vTexcoord = texcoord;
        }
    `;
  private texFragShader: string = `
        precision mediump float;
        varying vec2 vTexcoord;

        uniform sampler2D uTexture;
        uniform vec3 uFragColor;

        void main() {
            vec4 uColor = vec4(uFragColor, 1.0);
            gl_FragColor = texture2D(uTexture, vTexcoord) * uColor;
        }
    `;

  constructor(option) {
    super();
    this.canvas = option.canvas;
    this.context = this.canvas.getContext('webgl') as WebGL2RenderingContext;
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.hitCanvas = document.createElement('canvas');
    const { width, height } = this.canvas;
    this.hitCanvas.classList.add('container');
    this.hitCanvas.width = width;
    this.hitCanvas.height = height;
    this.hitContext = this.hitCanvas.getContext('2d') as CanvasRenderingContext2D;

    this.$init();
  }

  bindProgramInfo(name, vert: string, frag: string, ctx: WebGL2RenderingContext) {
    ctx[name] = twgl.createProgramInfo(ctx, [vert, frag]);
    // twgl.resizeCanvasToDisplaySize(ctx.canvas);
    // ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  $init() {
    this.bindProgramInfo('program', this.vertShader, this.fragShader, this.context);
    this.bindProgramInfo('texProgram', this.texVertShader, this.texFragShader, this.context);
  }

  protected $clear() {
    const { width, height } = this.canvas;
    this.context.viewport(0, 0, width, height);
    this.context.clearColor(0, 0, 0, 0);
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    this.hitContext.clearRect(0, 0, width, height);
  }
}

const CONTEXT_PROPERTIES = [
  'fillStyle',
];

CONTEXT_PROPERTIES.forEach(function (prop) {
  Object.defineProperty(WebGLRenderer.prototype, prop, {
    get() {
      return this.context[prop];
    },
    set(val) {
      this.context[prop] = val;
    },
  });
});
