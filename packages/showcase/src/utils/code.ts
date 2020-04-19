const BasicDrawingSnippet = (shape = 'CANVAS_SHAPE', renderer = 'Canvas') => `
  import { Scene, Group, Layer } from '@rizurin/core'
  import { ${renderer}Renderer } from '@rizurin/renderer'
  import { ${shape} } from '@rizurin/shape'
  const { Rect, Circle, Line, Polygon } = ${shape}
  const scene = new Scene({ container,
    width: containerWidth,
    height: containerHeight,
  })
  let layer = new Layer()
  layer.bind(await new ${renderer}Renderer({canvas: layer.canvas}))

  const group = new Group()
  const rect = new Rect({x: 200, y: 250, width: 80, height: 80})
  rect.rotate(45 * Math.PI / 180)
  group.add(rect)
  const rect2 = new Rect({x: 400, y: 250, width: 80, height: 80, offsetX: 40, offsetY: 40})
  group.add(rect2)
  const polygon = new Polygon({points: [ 300, 10, 330, 30, 360, 120, 240, 90]});
  group.add(polygon)

  layer.add(group)

  const circle = new Circle({x: 10, y: 60, r: 50})
  layer.add(circle)

  const [x0, y0] = [20, 250]
  const line = new Line({points: [
    x0 + 0, y0 + 10, 
    x0 + 70, y0 + 70,
    x0 + 100, y0 + 30,
    x0 + 150, y0 + 100
  ]})
  layer.add(line)

  scene.add(layer)
`

const InteractionSnippet = () => `
  let drag = false
  let target
  let [x,y] = [0, 0]
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
`

const AnimationCode = () => `
  let step = 3
  let ratio, dir
  const animate = () => {
    if(circle.scaleX > 1.5)  ratio = 0.99
    if(circle.scaleX < 0.5)  ratio = 1.01
    circle.scale(ratio)
    rect.rotate(Math.PI  / 180);
    rect2.rotate(Math.PI  / 180);
    polygon.translate(0, step*dir)
    if (polygon.translateY < 30) { dir = 1 } 
    else if (polygon.translateY > 150){ dir = -1 }
    scene.draw()
    requestAnimationFrame(animate)
  }
  animate()
`

const GameOfLifeCode = (shape = 'CANVAS_SHAPE', renderer = 'Canvas') => `
  import { Scene, Layer } from '@rizurin/core'
  import { ${renderer}Renderer } from '@rizurin/renderer'
  import { ${shape} } from '@rizurin/shape'
  const { Rect } = ${shape}
  const scene = new Scene({ 
    container: target,
    width: edge,
    height: edge,
  })

  const layer = new Layer()
  layer.bind(await new ${renderer}Renderer({canvas: layer.canvas}))
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
  let stage = scene
  setInterval(() => {
    gameOfLife(board)
    boardRects.map((m,w) => m.map((n,h) => n.color = board[w][h] ? '#000000' : '#ffffff'))
    stage.draw()
  }, 500)
`

export default [BasicDrawingSnippet, InteractionSnippet, AnimationCode, GameOfLifeCode];
