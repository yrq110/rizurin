# rizurin

A web 2D graphic library, support 4 types rendering, including [WebGPU](https://gpuweb.github.io/gpuweb/).

**warning**: In current it's just a experiment lib to play with webgpu and try a consistency drawing API.

## Features

* Try to make the different rendering methods([Canvas](https://www.w3.org/TR/2dcontext2/)/[WebGL2](https://www.khronos.org/registry/webgl/specs/latest/2.0/)/[SVG](https://www.w3.org/TR/SVG2/)/[WebGPU](https://gpuweb.github.io/gpuweb/)) in a same way with the consistency API.
* Primitive drawing, including rect, circle, polygon, line.
* Inner abstract objects, like Scene, Layer, Group, Shape.
* Pixel-based hit test, use a separate canvas to detect.
* Static and multi layer, sometimes only want to display static contents without interact and use multi layer can do some different rendering works.


## Packages

name | what for
----- | ------- 
[@rizurin/core](packages/core/README.md) | supply basic classes |
[@rizurin/renderer](packages/renderer/README.md) | renderers with init and op methods | 
[@rizurin/shape](packages/shape/README.md) | primitive shapes for each renderer |
[@rizurin/util](packages/util/README.md) | common tools, like color, math, transform |
[@rizurin/doc](packages/doc/README.md) | a document site with vuepress |
[@rizurin/showcase](packages/showcase/README.md) | a document site with vuepress |

## Begin

Draw a rect

```ts
import {}

```

## Todo

* Event transport
* More 2D primitive shapes
* Power for texture and image
* SUpport sprite shape

## WebGPU demos

* [webgpu-samples](https://github.com/austinEng/webgpu-samples)
* [[CN]LearningWebGPU](https://github.com/hjlld/LearningWebGPU)
