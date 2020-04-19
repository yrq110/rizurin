# @rizurin/renderer

## Installation

```bash
yarn add @rizurin/renderer
```

## Usage
 
Use a renderer to draw graphics, bind to layer:  

```js
import { CanvasRenderer } from '@rizurin/render'
import { Layer } from '@rizurin/core';
...
let layer = new Layer({renderer: 'canvas'})
layer.bind(await new CanvasRenderer({canvas: layer.canvas}))
...
```
