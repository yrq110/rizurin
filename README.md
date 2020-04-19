# Rizurin

> 实验性~~玩具~~项目，WebGPU还有许多尚不确定的地方，且项目本身仍有很多需要优化的地方

一个提供一致性API的小型Web 2D图形库，支持四种渲染模式，包括[Canvas](https://www.w3.org/TR/2dcontext2/), [WebGL](https://www.khronos.org/registry/webgl/specs/latest/2.0/), [SVG](https://www.w3.org/TR/SVG2/)和[WebGPU](https://gpuweb.github.io/gpuweb/)。

[示例演示](https://yrq110.me/rizurin/)

## Features

* 利用核心对象(core)、渲染器(renderer)、图形(shape)组合的方式进行绘制
* 支持多种渲染方式，提供一致性API进行操作
* 支持多种图元，矩形、圆、多边形等
* 基于像素的碰撞检测，利用额外一层进行hitTest处理

## Packages

名称 | 用途
----- | ------- 
[@rizurin/core](packages/core/README.md) | 提供核心对象，如Scene,Layer,Group等 |
[@rizurin/renderer](packages/renderer/README.md) | 提供渲染器，如CanvasRenderer, SVGRenderer等 | 
[@rizurin/shape](packages/shape/README.md) | 提供某种渲染方式的图元对象，如Rect, Circle, Polygon等 |
[@rizurin/util](packages/util/README.md) | 通用工具， 如颜色、变换等 |

## Todo

* 添加使用文档
* 添加对象事件传递模块
* 更多图元类型及样式设置
* 提供纹理/精灵对象

## Thanks

编写过程中学习并借鉴了[Fabric](https://github.com/fabricjs/fabric.js), [Konva](https://github.com/konvajs/konva), [Pixi](https://github.com/pixijs/pixi.js)等web图形库中的一些优秀设计。部分总结文章见[博客](https://yrq110.me/post/front-end/dive-into-2d-canvas-framework-i-fabric/)

## WebGPU demos

* [webgpu-samples](https://github.com/austinEng/webgpu-samples)
* [LearningWebGPU](https://github.com/hjlld/LearningWebGPU)
