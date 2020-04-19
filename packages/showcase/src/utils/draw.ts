import { Scene, Group, Layer, StaticLayer } from '@rizurin/core'

export const DrawBasicPrimitive = async (container: HTMLElement, shapes: any, renderer: any, size: [number, number], isStatic?) => {
  const { Rect, Circle, Line, Polygon } = shapes
  const [containerWidth, containerHeight] = size
  const scene = new Scene({ 
    container,
    width: containerWidth,
    height: containerHeight,
  })
  let layer
  if(!isStatic) {
    layer = new Layer()
  } else {
    layer = new StaticLayer()
  }
  layer.bind(await new renderer({canvas: layer.canvas}))

  const group = new Group()
  const rect = new Rect({x: 200, y: 250, width: 80, height: 80})
  rect.rotate(30 * Math.PI / 180);
  group.add(rect)
  const rect2 = new Rect({x: 400, y: 250, width: 80, height: 80, offsetX: 40, offsetY: 40})
  group.add(rect2)
  const polygon = new Polygon({points: [ 300, 10, 330, 30, 360, 120, 240, 90]});
  group.add(polygon)
  layer.add(group)

  const circle = new Circle({x: 10, y: 60, r: 50});
  layer.add(circle);

  const [x0, y0] = [20, 250]
  const line = new Line({points: [
    x0 + 0, y0 + 10, 
    x0 + 70, y0 + 70,
    x0 + 100, y0 + 30,
    x0 + 150, y0 + 100
  ]});
  layer.add(line);

  scene.add(layer);
  return {scene, rect, rect2, polygon, line, circle}
}

export const InteractionExample = async (container: HTMLElement, shapes: any, renderer: any, size: [number, number]) => {
  const { scene }= await DrawBasicPrimitive(container, shapes, renderer, size, false)
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
}

export const AnimationExample = async (container: HTMLElement, shapes: any, renderer: any, size: [number, number]) => {
  const { scene, rect, rect2, polygon, circle }= await DrawBasicPrimitive(container, shapes, renderer, size, false)
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
}

export const GameOfLife = async (target: HTMLElement, shapes: any, renderer: any) => {
  let edge = 300
  const { Rect } = shapes
  const scene = new Scene({ 
    container: target,
    width: edge,
    height: edge,
  })

  const layer = new Layer()
  layer.bind(await new renderer({canvas: layer.canvas}))

  let width = edge
  let height = edge
  let size = 5
  const m = width / size;
  const n = height / size;
  let board = Array(m).fill(Array(n).fill(0))
  for(var i = 0; i < m; i++) {
    let arr: number[] = []
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
    let neibors:number[] = []
    let i1:number[] = arr[i-1] || []
    let i2:number[] = arr[i+1] || []
    neibors.push(
        i1[j-1], i1[j],i1[j+1],
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
  }, 2000)
  // let current
  // const animate = (time = performance.now()) => {
  //   if(!current) {
  //     current = time
  //   } else {
  //     if(time-current < 5000) {
  //       requestAnimationFrame(animate)
  //       return;
  //     }
  //   }
  //   gameOfLife(board)
  //   boardRects.map((m,w) => m.map((n,h) => n.color = board[w][h] ? '#000000' : '#ffffff'))
  //   stage.draw()
  //   requestAnimationFrame(animate)
  // }
  // animate()
}
