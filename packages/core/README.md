# @rizurin/core

## Installation

```bash
yarn add @rizurin/core
```

## Usage


Supply basic objects to handle drawing contents: 

```js
import { CanvasRenderer } from '@rizurin/renderer';
import { Scene, Layer, Group } from '@rizurin/core';
...
let scene = new Scene({container, width, height})
let layer = new Layer({renderer: 'canvas'})
layer.bind(await new CanvasRenderer({canvas: layer.canvas}))
let group = new Group()
...
layer.add(group)
scene.add(layer)
...
```
