(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{width;height;constructor(e,t){this.width=e,this.height=t}createLayer(e,t=!1){let n=document.createElement(`canvas`);n.width=this.width,n.height=this.height;let r=n.getContext(`2d`);return t&&(r.fillStyle=`#ffffff`,r.fillRect(0,0,this.width,this.height)),{id:`layer_`+Math.random().toString(36).substring(2,9),name:e,visible:!0,locked:!1,opacity:1,blendMode:`source-over`,canvas:n,ctx:r}}renderComposite(e,t){t.clearRect(0,0,this.width,this.height);for(let n of e)n.visible&&n.opacity!==0&&(t.save(),t.globalAlpha=n.opacity,t.globalCompositeOperation=n.blendMode,t.drawImage(n.canvas,0,0),t.restore())}drawStroke(e,t,n,r,i,a=!1){e.save(),a?(e.globalCompositeOperation=`destination-out`,e.strokeStyle=`rgba(0,0,0,1)`):(e.globalCompositeOperation=`source-over`,e.strokeStyle=r),e.lineWidth=i,e.lineCap=`round`,e.lineJoin=`round`,e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(n.x,n.y),e.stroke(),e.restore()}applyAdjustment(e,t){let n=e.ctx.getImageData(0,0,this.width,this.height),r=n.data;for(let e=0;e<r.length;e+=4)if(t===`invert`)r[e]=255-r[e],r[e+1]=255-r[e+1],r[e+2]=255-r[e+2];else if(t===`grayscale`){let t=.299*r[e]+.587*r[e+1]+.114*r[e+2];r[e]=t,r[e+1]=t,r[e+2]=t}else t===`brightness`&&(r[e]=Math.min(255,r[e]+30),r[e+1]=Math.min(255,r[e+1]+30),r[e+2]=Math.min(255,r[e+2]+30));e.ctx.putImageData(n,0,0)}},t=class{svgElement;constructor(e){this.svgElement=e}render(e,t){this.svgElement.innerHTML=``;for(let n of e){let e=null;if(n.type===`rect`){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);t.setAttribute(`x`,n.x.toString()),t.setAttribute(`y`,n.y.toString()),t.setAttribute(`width`,(n.width||100).toString()),t.setAttribute(`height`,(n.height||100).toString()),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),e=t}else if(n.type===`circle`){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);t.setAttribute(`cx`,n.x.toString()),t.setAttribute(`cy`,n.y.toString()),t.setAttribute(`r`,(n.radius||50).toString()),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),e=t}else if(n.type===`path`&&n.pathData){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);t.setAttribute(`d`,n.pathData),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),t.setAttribute(`stroke-linecap`,`round`),t.setAttribute(`stroke-linejoin`,`round`),e=t}e&&(e.setAttribute(`data-id`,n.id),n.id===t&&(e.setAttribute(`stroke`,`#38bdf8`),e.setAttribute(`stroke-dasharray`,`4 2`)),this.svgElement.appendChild(e))}}exportSVG(){return this.svgElement.outerHTML}},n=class{endpoint;constructor(e=`http://localhost:8085`){this.endpoint=e}async checkConnection(){try{return(await fetch(`${this.endpoint}/health`,{method:`GET`})).ok}catch{return!1}}async generatePromptAugmentation(e){try{return(await(await fetch(`${this.endpoint}/v1/chat/completions`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({model:`auto`,messages:[{role:`system`,content:`You are an expert digital artist and visual director. Expand the user concept into a high-detail generative art prompt. Return only the prompt.`},{role:`user`,content:e}]})})).json()).choices?.[0]?.message?.content||e}catch{return e}}async inpaintMask(e,t,n){return console.log(`Sending inpainting payload to local GPU engine:`,{prompt:n}),e}},r=class{state;photoEngine;vectorEngine;aiEngine;canvasElement;canvasCtx;svgOverlay;isDrawing=!1;lastPos={x:0,y:0};constructor(){let r=1080;this.photoEngine=new e(r,720),this.aiEngine=new n;let i=this.photoEngine.createLayer(`Background`,!0),a=this.photoEngine.createLayer(`Layer 1`,!1);this.state={mode:`photo`,activeTool:`brush`,zoom:1,pan:{x:0,y:0},canvasSize:{width:r,height:720},layers:[i,a],activeLayerId:a.id,primaryColor:`#38bdf8`,secondaryColor:`#ffffff`,brushSize:18,brushOpacity:1,vectorShapes:[{id:`v1`,type:`rect`,x:80,y:80,width:220,height:140,fill:`#8b5cf6`,stroke:`#c084fc`,strokeWidth:3},{id:`v2`,type:`circle`,x:420,y:220,radius:75,fill:`#06b6d4`,stroke:`#67e8f9`,strokeWidth:3}],videoClips:[{id:`c1`,trackId:`v1`,name:`Intro_Shot_4k.mp4`,startTime:0,duration:4.5,color:`#3b82f6`},{id:`c2`,trackId:`v1`,name:`Main_Scene.mp4`,startTime:4.5,duration:6,color:`#8b5cf6`},{id:`c3`,trackId:`a1`,name:`Score_Master.wav`,startTime:0,duration:10.5,color:`#10b981`}],currentTime:0,isPlaying:!1,aiConnected:!1},this.initDOM(),this.vectorEngine=new t(this.svgOverlay),this.bindEvents(),this.render(),this.checkAI()}async checkAI(){let e=await this.aiEngine.checkConnection();this.state.aiConnected=e;let t=document.getElementById(`ai-status-badge`);t&&(t.innerText=e?`● RTX 5070 Ti Active`:`○ AI Engine Offline`,t.style.color=e?`#10b981`:`#94a3b8`)}initDOM(){let e=document.getElementById(`app`);e.innerHTML=`
      <header class="app-header">
        <div class="brand-badge">
          <div class="brand-logo">L</div>
          <span>Lumina Creative Suite</span>
        </div>

        <div class="mode-selector">
          <button class="mode-btn mode-photo active" data-mode="photo">📸 Photo</button>
          <button class="mode-btn mode-vector" data-mode="vector">📐 Vector</button>
          <button class="mode-btn mode-motion" data-mode="motion">🎬 Motion</button>
          <button class="mode-btn mode-publish" data-mode="publish">📄 Publish</button>
        </div>

        <div class="header-actions">
          <span id="ai-status-badge" style="font-size: 11px; font-weight: 600; font-family: var(--font-mono); margin-right: 6px;">● Checking GPU...</span>
          <button class="btn-pill btn-ai" id="btn-gen-ai">⚡ Smart Inpaint / AI</button>
          <button class="btn-pill" id="btn-export">Export</button>
        </div>
      </header>

      <div class="workspace-body">
        <aside class="tool-dock">
          <button class="tool-item active" data-tool="select" title="Move / Select (V)">↖</button>
          <button class="tool-item" data-tool="brush" title="Paint Brush (B)">🖌</button>
          <button class="tool-item" data-tool="eraser" title="Eraser (E)">⌫</button>
          <button class="tool-item" data-tool="pen" title="Bézier Pen Tool (P)">✒</button>
          <div class="tool-divider"></div>
          <button class="tool-item" data-tool="rectangle" title="Rectangle (U)">▭</button>
          <button class="tool-item" data-tool="text" title="Type Tool (T)">T</button>
          <button class="tool-item" data-tool="eyedropper" title="Color Picker (I)">💧</button>
          <div class="tool-divider"></div>
          <input type="color" id="primary-color" value="${this.state.primaryColor}" style="width: 28px; height: 28px; border: none; cursor: pointer; border-radius: 4px; background: transparent;">
        </aside>

        <main class="canvas-stage checker-bg">
          <div class="canvas-viewport" style="width: ${this.state.canvasSize.width}px; height: ${this.state.canvasSize.height}px;">
            <canvas id="main-canvas" width="${this.state.canvasSize.width}" height="${this.state.canvasSize.height}" class="main-canvas"></canvas>
            <svg id="vector-overlay" class="vector-overlay"></svg>
          </div>
        </main>

        <aside class="panel-dock">
          <div class="panel-tab-bar">
            <div class="panel-tab active" data-tab="layers">Layers</div>
            <div class="panel-tab" data-tab="props">Properties</div>
            <div class="panel-tab" data-tab="filters">Filters</div>
          </div>
          <div class="panel-content" id="panel-content">
            <!-- Layers will render here -->
          </div>
        </aside>
      </div>

      <div class="timeline-dock" id="timeline-dock" style="display: none;">
        <div class="timeline-controls">
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn-pill" id="btn-play">▶ Play</button>
            <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);" id="timecode">00:00:00:00</span>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">Multi-Track NLE Video Engine</span>
        </div>
        <div class="timeline-tracks" id="timeline-tracks" style="padding: 10px;">
          <!-- Tracks will render here -->
        </div>
      </div>
    `,this.canvasElement=document.getElementById(`main-canvas`),this.canvasCtx=this.canvasElement.getContext(`2d`),this.svgOverlay=document.getElementById(`vector-overlay`)}bindEvents(){document.querySelectorAll(`.mode-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.mode;this.switchMode(t)})}),document.querySelectorAll(`.tool-item`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.tool;t&&(document.querySelectorAll(`.tool-item`).forEach(e=>e.classList.remove(`active`)),e.currentTarget.classList.add(`active`),this.state.activeTool=t)})}),document.getElementById(`primary-color`).addEventListener(`input`,e=>{this.state.primaryColor=e.target.value}),this.canvasElement.addEventListener(`mousedown`,e=>this.onMouseDown(e)),window.addEventListener(`mousemove`,e=>this.onMouseMove(e)),window.addEventListener(`mouseup`,()=>this.onMouseUp()),document.getElementById(`btn-export`)?.addEventListener(`click`,()=>{let e=document.createElement(`a`);e.href=this.canvasElement.toDataURL(`image/png`),e.download=`Lumina_Project_${Date.now()}.png`,e.click()}),document.getElementById(`btn-gen-ai`)?.addEventListener(`click`,async()=>{let e=window.prompt(`Describe generation or edit for RTX 5070 Ti:`,`futuristic glowing neon cyberpunk city, cinematic lighting`);if(!e)return;let t=await this.aiEngine.generatePromptAugmentation(e);alert(`⚡ Prompt Synthesized via Local GPU:\n\n"${t}"\n\nQueuing diffusion tensor pipeline on RTX 5070 Ti...`)})}switchMode(e){this.state.mode=e,document.querySelectorAll(`.mode-btn`).forEach(t=>{t.classList.remove(`active`),t.dataset.mode===e&&t.classList.add(`active`)});let t=document.getElementById(`timeline-dock`);t&&(t.style.display=e===`motion`?`flex`:`none`),e===`vector`?this.svgOverlay.style.pointerEvents=`auto`:this.svgOverlay.style.pointerEvents=`none`,this.render()}onMouseDown(e){let t=this.canvasElement.getBoundingClientRect();if(this.isDrawing=!0,this.lastPos={x:e.clientX-t.left,y:e.clientY-t.top},this.state.activeTool===`brush`||this.state.activeTool===`eraser`){let e=this.getActiveLayer();e&&(this.photoEngine.drawStroke(e.ctx,this.lastPos,this.lastPos,this.state.primaryColor,this.state.brushSize,this.state.activeTool===`eraser`),this.renderCanvas())}}onMouseMove(e){if(!this.isDrawing)return;let t=this.canvasElement.getBoundingClientRect(),n={x:e.clientX-t.left,y:e.clientY-t.top};if(this.state.activeTool===`brush`||this.state.activeTool===`eraser`){let e=this.getActiveLayer();e&&(this.photoEngine.drawStroke(e.ctx,this.lastPos,n,this.state.primaryColor,this.state.brushSize,this.state.activeTool===`eraser`),this.renderCanvas())}this.lastPos=n}onMouseUp(){this.isDrawing=!1}getActiveLayer(){return this.state.layers.find(e=>e.id===this.state.activeLayerId)}render(){this.renderCanvas(),this.renderVectorOverlay(),this.renderPanels(),this.renderTimeline()}renderCanvas(){this.photoEngine.renderComposite(this.state.layers,this.canvasCtx)}renderVectorOverlay(){this.state.mode===`vector`||this.state.mode===`publish`?(this.svgOverlay.style.display=`block`,this.vectorEngine.render(this.state.vectorShapes)):this.svgOverlay.style.display=`none`}renderPanels(){let e=document.getElementById(`panel-content`);e.innerHTML=`
      <div style="font-weight: 700; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; color: var(--text-muted);">Layers Stack</div>
      <div class="layer-list">
        ${this.state.layers.map(e=>`
          <div class="layer-item ${e.id===this.state.activeLayerId?`active`:``}" data-layer-id="${e.id}">
            <div class="layer-thumb">🖼</div>
            <span class="layer-name">${e.name}</span>
            <span style="font-size: 11px; color: var(--text-dim);">${Math.round(e.opacity*100)}%</span>
          </div>
        `).reverse().join(``)}
      </div>

      <div style="margin-top: 14px; font-weight: 700; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; color: var(--text-muted);">Layer Filters</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <button class="btn-pill" id="filter-bright">☀️ Brightness</button>
        <button class="btn-pill" id="filter-invert">🔄 Invert</button>
        <button class="btn-pill" id="filter-gray">⬛ Grayscale</button>
      </div>
    `,document.querySelectorAll(`.layer-item`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.layerId;t&&(this.state.activeLayerId=t,this.renderPanels())})}),document.getElementById(`filter-bright`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`brightness`),this.renderCanvas())}),document.getElementById(`filter-invert`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`invert`),this.renderCanvas())}),document.getElementById(`filter-gray`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`grayscale`),this.renderCanvas())})}renderTimeline(){let e=document.getElementById(`timeline-tracks`);e&&(e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="width: 60px; font-size: 11px; font-weight: 600; color: var(--text-muted);">Video 1</span>
          <div style="flex: 1; height: 32px; background: #161a22; border-radius: 4px; position: relative; border: 1px solid var(--border-color);">
            <div style="position: absolute; left: 0%; width: 45%; height: 100%; background: #3b82f6; border-radius: 4px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: #fff;">Intro_Scene.mp4</div>
            <div style="position: absolute; left: 45%; width: 40%; height: 100%; background: #8b5cf6; border-radius: 4px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: #fff;">Cut_Two.mp4</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="width: 60px; font-size: 11px; font-weight: 600; color: var(--text-muted);">Audio 1</span>
          <div style="flex: 1; height: 28px; background: #161a22; border-radius: 4px; position: relative; border: 1px solid var(--border-color);">
            <div style="position: absolute; left: 0%; width: 85%; height: 100%; background: #10b981; border-radius: 4px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: #fff;">Master_Score.wav ♫</div>
          </div>
        </div>
      </div>
    `)}};window.addEventListener(`DOMContentLoaded`,()=>{new r});