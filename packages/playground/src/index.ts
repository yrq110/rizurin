import { Scene, Group, Layer, StaticLayer, Shape } from '@rizurin/core'
import { CanvasRenderer, SVGRenderer, WebGLRenderer, WebGPURenderer } from '@rizurin/renderer'
import { CANVAS_SHAPES, WEBGL_SHAPES, WEBGPU_SHAPES, SVG_SHAPES } from '@rizurin/shape'

const Shapes  = (renderer) => {
  switch (renderer) {
    case 'canvas': { return CANVAS_SHAPES }
    case 'webgl': { return WEBGL_SHAPES }
    case 'webgpu': { return WEBGPU_SHAPES }
    case 'svg': { return SVG_SHAPES }
  }
}
const Renderers = (renderer) => {
  switch (renderer) {
    case 'canvas': { return CanvasRenderer }
    case 'webgl': { return WebGLRenderer }
    case 'webgpu': { return WebGPURenderer }
    case 'svg': { return SVGRenderer }
  }
}

const RainbowShape = () => {
  
}

const { clientWidth: containerWidth, clientHeight: containerHeight} = document.querySelector('.section')
/**
 * Sierpinski triangle example
 */
const SierMap = {
  '000': 0,
  '001': 1,
  '010': 0,
  '011': 1,
  '100': 1,
  '101': 0,
  '110': 1,
  '111': 0
}
const SierpinskiTriangle = async renderType => {
  let width = containerWidth 
  let height = containerHeight
  let size = 5

  let stats = Array(Math.round(width/size)).fill(0)
  stats[Math.round(stats.length/2)] = 1
  let net = [stats]
  for (let n = 0; n < height / size; n++) {
    let newStats = [0]
    for (let i = 1; i < stats.length - 1; i++) {
      newStats[i] = SierMap[''+stats[i-1]+stats[i]+stats[i+1]]
    }
    newStats.push(0)
    stats = newStats
    net.push(stats)
  }
  
  const { Rect } = Shapes(renderType)
  
  const cells = []
  for (let j = 0; j < net.length; j++) {
    for (let i = 0; i < stats.length; i++) {
      const cell = new Rect({ x: i*size, y: j*size, width: size, height: size, color: net[j][i] ? '#000000' : '#ffffff' });
      cells.push(cell);
    }
  }
  const scene = new Scene({ 
    container: document.querySelector(`.${renderType}`),
    width: containerWidth,
    height: containerHeight,
  })
  const renderCtor = Renderers(renderType)
  const layer = new Layer()
  layer.bind(await new renderCtor({canvas: layer.canvas}))
  cells.map(c => layer.add(c))
  scene.add(layer)
}


/**
 * Game of life example
 */
const GameOfLife = async renderType => {
  let edge = 300
  const { Rect } = Shapes(renderType)
  const scene = new Scene({ 
    container: document.querySelector(`.${renderType}`),
    width: edge,
    height: edge,
  })
  const renderCtor = Renderers(renderType)
  const layer = new Layer()
  layer.bind(await new renderCtor({canvas: layer.canvas}))

  let width = edge
  let height = edge
  let size = 5
  const m = width / size;
  const n = height / size;
  let board = Array(m).fill(Array(n).fill(0))
  for(var i = 0; i < m; i++) {
    let arr = []
    for(var j = 0; j < n; j++){
      arr.push(Math.random() > 0.5 ? 1 : 0)
    }
    board[i] = arr
  }
  let boardRects = Array(m).fill(Array(n).fill(null))
  boardRects = boardRects.map((m,w) => {
    return m.map((_,h) => {
      let rect = new Rect({ 
        x: w*size, y: h*size, 
        width: size, height: size,
        color: board[w][h] ? '#000000' : '#ffffff'
      })
      layer.add(rect)
      return rect
    })
  })
  scene.add(layer)

  const getNeibor = (arr, i, j) => {
    let neibors = []
    let i1 = arr[i-1] || []
    let i2 = arr[i+1] || []
    neibors.push(
        i1[j-1],i1[j],i1[j+1],
        arr[i][j-1],arr[i][j+1],
        i2[j-1],i2[j],i2[j+1]
    )
    neibors = neibors.filter(e => e !== undefined)
    return neibors.length ? neibors.reduce((acc,cur) => acc+cur) : 0
  }
  const gameOfLife = function(board) {
      if(!board.length) return
      let [m,n] = [board.length, board[0].length];
      let data = [...board.map(r => r.slice())]
      for(let i=0;i<m;i++) {
          for(let j=0;j<n;j++) {
              let state = data[i][j]
              let live = getNeibor(data, i, j)
              state === 1 && (live<2 || live>3) && (state = 0)
              state === 0 && live === 3 && (state = 1)
              board[i][j] = state
          }
      }
  };
  let stage = scene
  setInterval(() => {
    gameOfLife(board)
    boardRects.map((m,w) => m.map((n,h) => n.color = board[w][h] ? '#000000' : '#ffffff'))
    stage.draw()
  }, 1000)
}

class RainbowText extends Shape {
  public text = ''
  public fontSize = 25
  public left = 0
  public top = 0
  public colors = ["red", 'rgb(217,31,38)', 'rgb(226,91,14)', 'rgb(245,221,8)', 'rgb(5,148,68)', 'rgb(2,135,206)', 'rgb(4,77,145)', 'rgb(42,21,113)']
  constructor(config) {
    super(config);
    this.text = config.text || 'Hello world';
    this.width = this.text.length * this.fontSize * 0.6;
    this.height = this.fontSize * 1.5;
  }
  $drawMain(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.fontSize}px Sans`;
    ctx.textAlign = "center";
    ctx.transform(...this.transform.matrix());
    for(let i=this.colors.length; i>0; i--) {
      ctx.fillStyle = this.colors[i];
      ctx.fillText(this.text, (i + 1) * 3, (i + 1) * 3);
    }
    ctx.restore()
  }
  $drawHit(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.fontSize}px Sans`;
    ctx.textAlign = "center";
    ctx.transform(...this.transform.matrix());
    for(let i=this.colors.length; i>0; i--) {
      ctx.fillStyle = this.colors[i];
      ctx.fillText(this.text, (i + 1) * 3, (i + 1) * 3);
    }
    ctx.restore()
  }
}
const DrawCustomShape = async () => {
  const container = document.querySelector(`.canvas`) as HTMLCanvasElement
  const scene = new Scene({ 
    container,
    width: containerWidth,
    height: containerHeight,
  })
  let layer = new Layer()
  layer.bind(await new CanvasRenderer({canvas: layer.canvas}))
  const rainbow = new RainbowText({text:'hello', x: 100, y: 100})
  layer.add(rainbow)
  scene.add(layer)
}
const DrawBasicPrimitive = async renderType => {
  const { Rect, Circle, Line, Polygon, Text } = Shapes(renderType)
  const container = document.querySelector(`.${renderType}`) as HTMLCanvasElement
  const scene = new Scene({ 
    container,
    width: containerWidth,
    height: containerHeight,
  })
  
  const rendererCtor = Renderers(renderType)
  let layer
  // if (renderType === 'canvas') {
  //   layer = new StaticLayer({renderer: renderType})
  // } else {
  layer = new Layer()
  // }
  layer.bind(await new rendererCtor({canvas: layer.canvas}))
  // let renderer = await new rendererCtor({})
  // layer = new Layer({renderer})

  const group = new Group()

  const rect = new Rect({x: 200, y: 250, width: 80, height: 80, offsetX: 0, offsetY: 0})
  rect.rotate(45 * Math.PI / 180);
  group.add(rect)
  // layer.add(rect);

  // const text = new Text({ x: 100, y: 200, text:'Hello world' })
  // layer.add(text)
  
  const polygon = new Polygon({points: [ 300, 10, 330, 30, 360, 120, 300 - 60, 90]});
  group.add(polygon)
  layer.add(group)
  // layer.add(polygon);

  const circle = new Circle({x: 10, y: 60, r: 50});
  layer.add(circle);

  const by = 250
  const line = new Line({points: [
    0, by + 10, 
    70, by + 70,
    100, by + 30,
    150, by + 100
  ]});
  layer.add(line);
  scene.add(layer);
  return {scene, rect, polygon, line, circle}
}

const l = console.log
const InteractionExample = async renderType => {
  const { scene, rect, polygon, line, circle }= await DrawBasicPrimitive(renderType)
  let drag = null
  let target = null
  let [x,y] = [null, null]
  scene.on('pointerdown', (e, shapes) => {
    if(!shapes.length) return
    drag = true
    x = e.clientX;
    y = e.clientY;
    target = shapes[0];
  })
  scene.on('pointerup', (e) => {
    drag = false;
    target = null;
  })
  scene.on('pointermove', (e) => {
    if (drag) {
      let [dx, dy] = [e.clientX - x, e.clientY - y]
      x = e.clientX
      y = e.clientY
      target.fitInto({
        x: target.x + dx,
        y: target.y + dy
      })
      scene.draw()
    }
  })
}

const AnimationExample = async renderType => {
  const { scene, rect, polygon, line, circle }= await DrawBasicPrimitive(renderType)
  let step = 3, dir = 1;
  let ratio = 1.01
  const animate = () => {
    if(circle.scaleX > 1.5)  ratio = 0.99
    if(circle.scaleX < 0.5)  ratio = 1.01
    circle.scale(ratio)
    rect.rotate(1 * Math.PI  / 180);
    polygon.translate(0, step*dir)
    if (polygon.translateY < 30) { dir = 1 } 
    else if (polygon.translateY > 150){ dir = -1 }
    scene.draw()
    requestAnimationFrame(animate)
  }
  animate()
}
DrawCustomShape()
// ['canvas', 'webgl', 'webgpu', 'svg'].map(r => AnimationExample(r))
// ['canvas', 'webgl', 'webgpu', 'svg'].map(r => InteractionExample(r))
// ['canvas', 'webgl', 'webgpu', 'svg'].map(r => DrawBasicPrimitive(r))
// ['canvas', 'webgl', 'webgpu', 'svg'].map(r => SierpinskiTriangle(r))
// ['canvas', 'webgl', 'webgpu', 'svg'].map(r => GameOfLife(r))