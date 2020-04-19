
<Header on:change={handleRendererChange}/>
<div class="drawer-container">
  <aside class="demo-drawer">
    {#each sectionOptions as section, i}
      <span class="item" class:activated={i===currentDemoIndex} on:click={e => handleDemoIndex(i)}>{section}</span>
    {/each}
  </aside>
  <main class="demo-main-content">
    {#if isWebGPUEnabled && currentRendererIndex===3}
      <div class="hint">* WebGPU drawing task needs optimized in the future</div>
    {/if}
    <section>
      {#if !isWebGPUEnabled && currentRendererIndex===3}
        <div class="warning">Seems that your browser does not support WebGPU feature, please use latest version of Chrome Canary</div> 
      {:else}
        <div class="container"></div>
      {/if}
    </section>
    <section>
      <Highlight language={typescript} {code} />
    </section>
    <footer class="footer">Developed by <a href="https://github.com/yrq110" target="_blank">yrq110</a></footer>
  </main>
</div>

<script lang="ts">
  import './app.scss'
  import Header from '../components/header.svelte'
  import { CanvasRenderer, SVGRenderer, WebGLRenderer, WebGPURenderer } from '@rizurin/renderer'
  import { CANVAS_SHAPES, WEBGL_SHAPES, WEBGPU_SHAPES, SVG_SHAPES } from '@rizurin/shape'
  import Highlight from 'svelte-highlight';
  import { typescript } from 'svelte-highlight/languages';
  import 'svelte-highlight/styles/github.css';
  import { DrawBasicPrimitive, AnimationExample, 
  InteractionExample, GameOfLife } from '../utils/draw'
  import Snippets from '../utils/code'
  import { onMount, onDestroy } from "svelte";
  const shapeOptions = ['CANVAS_SHAPES', 'SVG_SHAPES', 'WEBGL_SHAPES', 'WEBGPU_SHAPES']
  const rendererOptions = ['Canvas', 'SVG', 'WebGL', 'WebGPU']
  const sectionOptions = ['Basic Drawing', 'Interaction', 'Animation', 'Game Of Life']
  let currentDemoIndex = 0
  let currentRendererIndex = 0
  let containerWidth
  let containerHeight
  let isWebGPUEnabled = !!document.createElement('canvas').getContext('gpupresent')
  let functionCode = ''
  let shapes:any = CANVAS_SHAPES;
  let renderer:any = CanvasRenderer;
  $: code = `${functionCode}`
  const handleRendererChange = (event) => {
    let val = event.detail.renderer
    if(val === rendererOptions[currentRendererIndex]) return
    currentRendererIndex = rendererOptions.indexOf(val)
    switch (val) {
      case 'Canvas':
        shapes = CANVAS_SHAPES
        renderer = CanvasRenderer
        break;
      case 'SVG':
        shapes = SVG_SHAPES
        renderer = SVGRenderer
        break;
      case 'WebGL':
        shapes = WEBGL_SHAPES
        renderer = WebGLRenderer
        break;
      case 'WebGPU':
        shapes = WEBGPU_SHAPES
        renderer = WebGPURenderer
        break;
    }
    handleDemoIndex(currentDemoIndex, true)
  }

  const handleDemoIndex = (index, force = false) => {
    if(index===currentDemoIndex && !force) return
    currentDemoIndex = index
    const container = document.querySelector(`.container`) as HTMLElement
    container.innerHTML = ''
    containerHeight = 400
    switch (index) {
      case 0:
        functionCode = Snippets[index](shapeOptions[currentRendererIndex], rendererOptions[currentRendererIndex])
        DrawBasicPrimitive(container, shapes, renderer, [containerWidth, containerHeight])
        break;
      case 1:
        functionCode = Snippets[index]()
        InteractionExample(container, shapes, renderer, [containerWidth, containerHeight])
        break;
      case 2:
        functionCode = Snippets[index]()
        AnimationExample(container, shapes, renderer, [containerWidth, containerHeight])
        break;
      case 3:
        functionCode = Snippets[index](shapeOptions[currentRendererIndex], rendererOptions[currentRendererIndex])
        GameOfLife(container, shapes, renderer)
        break;
    }
    
  }

  onMount(() => {
    const { clientWidth, clientHeight} = document.querySelector('.container') as HTMLElement
    containerWidth = clientWidth
    containerHeight = clientHeight
    console.log("App mounted");
    handleDemoIndex(currentDemoIndex, true)
  });
</script>
