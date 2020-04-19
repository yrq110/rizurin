# @rizurin/shape

## Installation

```bash
yarn add @rizurin/shape
```

## Usage

Create primitive objects, use this with renderer:

```js
import { Scene, Layer } from '@rizurin/core';
import { CanvasRenderer } from '@rizurin/renderer';
import { CANVAS_SHAPES } from '@rizurin/shape';
...
let layer = new Layer({renderer: 'canvas'})
layer.bind(await new CanvasRenderer({canvas: layer.canvas}))
const { Rect, Polygon } = CANVAS_SHAPES
const rect = new Rect({x: 200, y: 250, width: 80, height: 80})
rect.rotate(30 * Math.PI / 180);
layer.add(rect)
const polygon = new Polygon({points: [ 300, 10, 330, 30, 360, 120, 240, 90]});
layer.add(rect)
...
```
