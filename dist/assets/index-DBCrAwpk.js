(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{width;height;constructor(e,t){this.width=e,this.height=t}createLayer(e,t=!1){let n=document.createElement(`canvas`);n.width=this.width,n.height=this.height;let r=n.getContext(`2d`);return t&&(r.fillStyle=`#ffffff`,r.fillRect(0,0,this.width,this.height)),{id:`layer_`+Math.random().toString(36).substring(2,9),name:e,visible:!0,locked:!1,opacity:1,blendMode:`source-over`,canvas:n,ctx:r}}renderComposite(e,t){t.clearRect(0,0,this.width,this.height);for(let n of e)n.visible&&n.opacity!==0&&(t.save(),t.globalAlpha=n.opacity,t.globalCompositeOperation=n.blendMode,t.drawImage(n.canvas,0,0),t.restore())}drawStroke(e,t,n,r,i,a=!1){e.save(),a?(e.globalCompositeOperation=`destination-out`,e.strokeStyle=`rgba(0,0,0,1)`):(e.globalCompositeOperation=`source-over`,e.strokeStyle=r),e.lineWidth=i,e.lineCap=`round`,e.lineJoin=`round`,e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(n.x,n.y),e.stroke(),e.restore()}applyAdjustment(e,t){let n=e.ctx.getImageData(0,0,this.width,this.height),r=n.data;for(let e=0;e<r.length;e+=4)if(t===`invert`)r[e]=255-r[e],r[e+1]=255-r[e+1],r[e+2]=255-r[e+2];else if(t===`grayscale`){let t=.299*r[e]+.587*r[e+1]+.114*r[e+2];r[e]=t,r[e+1]=t,r[e+2]=t}else t===`brightness`&&(r[e]=Math.min(255,r[e]+30),r[e+1]=Math.min(255,r[e+1]+30),r[e+2]=Math.min(255,r[e+2]+30));e.ctx.putImageData(n,0,0)}},t=class{svgElement;constructor(e){this.svgElement=e}render(e,t){this.svgElement.innerHTML=``;for(let n of e){let e=null;if(n.type===`rect`){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);t.setAttribute(`x`,n.x.toString()),t.setAttribute(`y`,n.y.toString()),t.setAttribute(`width`,(n.width||100).toString()),t.setAttribute(`height`,(n.height||100).toString()),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),e=t}else if(n.type===`circle`){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);t.setAttribute(`cx`,n.x.toString()),t.setAttribute(`cy`,n.y.toString()),t.setAttribute(`r`,(n.radius||50).toString()),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),e=t}else if(n.type===`path`&&n.pathData){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);t.setAttribute(`d`,n.pathData),t.setAttribute(`fill`,n.fill),t.setAttribute(`stroke`,n.stroke),t.setAttribute(`stroke-width`,n.strokeWidth.toString()),t.setAttribute(`stroke-linecap`,`round`),t.setAttribute(`stroke-linejoin`,`round`),e=t}e&&(e.setAttribute(`data-id`,n.id),n.id===t&&(e.setAttribute(`stroke`,`#38bdf8`),e.setAttribute(`stroke-dasharray`,`4 2`)),this.svgElement.appendChild(e))}}exportSVG(){return this.svgElement.outerHTML}},n=class{endpoint;constructor(e=`http://localhost:8085`){this.endpoint=e}async checkConnection(){try{return(await fetch(`${this.endpoint}/health`,{method:`GET`})).ok}catch{return!1}}async generatePromptAugmentation(e){try{return(await(await fetch(`${this.endpoint}/v1/chat/completions`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({model:`auto`,messages:[{role:`system`,content:`You are an expert digital artist and visual director. Expand the user concept into a high-detail generative art prompt. Return only the prompt.`},{role:`user`,content:e}]})})).json()).choices?.[0]?.message?.content||e}catch{return e}}async inpaintMask(e,t,n){return console.log(`Sending inpainting payload to local GPU engine:`,{prompt:n}),e}},r=class{audioCtx=null;isPlaying=!1;currentPlayhead=0;constructor(){}init(){if(!this.audioCtx){let e=window.AudioContext||window.webkitAudioContext;this.audioCtx=new e}}getAudioContext(){return this.audioCtx}generateWaveformPoints(e=10,t=200){let n=[],r=0;for(let e=0;e<t;e++){r+=.2;let t=Math.sin(e*.1)*.4+Math.sin(r)*.3+Math.random()*.3;n.push(Math.max(.05,Math.min(1,Math.abs(t))))}return n}playScrubTone(e=440,t=.05){if(this.audioCtx||this.init(),!this.audioCtx)return;this.audioCtx.state===`suspended`&&this.audioCtx.resume();let n=this.audioCtx.createOscillator(),r=this.audioCtx.createGain();n.type=`triangle`,n.frequency.setValueAtTime(e,this.audioCtx.currentTime),r.gain.setValueAtTime(.15,this.audioCtx.currentTime),r.gain.exponentialRampToValueAtTime(.001,this.audioCtx.currentTime+t),n.connect(r),r.connect(this.audioCtx.destination),n.start(),n.stop(this.audioCtx.currentTime+t)}},i=class{clips;tracks;duration;currentTime=0;isPlaying=!1;playheadRafId=null;lastRafTime=0;pixelsPerSecond=50;audioEngine;onTimeUpdateCallback;onStateChangeCallback;constructor(e,t,n=30){this.clips=e,this.audioEngine=t,this.duration=n,this.tracks=[{id:`v1`,type:`video`,name:`Video 1`},{id:`v2`,type:`video`,name:`Video 2`},{id:`a1`,type:`audio`,name:`Audio 1`},{id:`a2`,type:`audio`,name:`Audio 2`}]}setOnTimeUpdate(e){this.onTimeUpdateCallback=e}setOnStateChange(e){this.onStateChangeCallback=e}getCurrentTime(){return this.currentTime}setCurrentTime(e,t=!1){if(this.currentTime=Math.max(0,Math.min(this.duration,e)),t){let e=220+this.currentTime%4*80;this.audioEngine.playScrubTone(e,.04)}this.onTimeUpdateCallback&&this.onTimeUpdateCallback(this.currentTime)}getDuration(){return this.duration}getClips(){return this.clips}getTracks(){return this.tracks}togglePlay(){this.isPlaying?this.pause():this.play()}play(){if(this.isPlaying)return;this.isPlaying=!0,this.audioEngine.init(),this.lastRafTime=performance.now();let e=t=>{if(!this.isPlaying)return;let n=(t-this.lastRafTime)/1e3;this.lastRafTime=t,this.currentTime+=n,this.currentTime>=this.duration&&(this.currentTime=0),this.onTimeUpdateCallback&&this.onTimeUpdateCallback(this.currentTime),this.playheadRafId=requestAnimationFrame(e)};this.playheadRafId=requestAnimationFrame(e),this.onStateChangeCallback&&this.onStateChangeCallback()}pause(){this.isPlaying=!1,this.playheadRafId!==null&&(cancelAnimationFrame(this.playheadRafId),this.playheadRafId=null),this.onStateChangeCallback&&this.onStateChangeCallback()}isPlaybackActive(){return this.isPlaying}razorCutAtPlayhead(){let e=this.currentTime,t=this.clips.findIndex(t=>e>t.startTime&&e<t.startTime+t.duration);if(t===-1)return!1;let n=this.clips[t],r=e-n.startTime,i=n.duration-r;n.duration=r;let a={id:`clip_`+Math.random().toString(36).substring(2,9),trackId:n.trackId,name:`${n.name} (Cut)`,startTime:e,duration:i,color:n.color};return this.clips.splice(t+1,0,a),this.onStateChangeCallback&&this.onStateChangeCallback(),!0}static formatTimecode(e,t=30){let n=Math.floor(e*t),r=String(n%t).padStart(2,`0`),i=Math.floor(e)%60,a=String(i).padStart(2,`0`),o=Math.floor(e/60)%60,s=String(o).padStart(2,`0`),c=Math.floor(e/3600);return`${String(c).padStart(2,`0`)}:${s}:${a}:${r}`}},a=class{state;photoEngine;vectorEngine;aiEngine;audioEngine;timelineController;canvasElement;canvasCtx;svgOverlay;isDrawing=!1;lastPos={x:0,y:0};constructor(){let a=1080;this.photoEngine=new e(a,720),this.aiEngine=new n,this.audioEngine=new r;let o=this.photoEngine.createLayer(`Background`,!0),s=this.photoEngine.createLayer(`Layer 1`,!1);this.state={mode:`photo`,activeTool:`brush`,zoom:1,pan:{x:0,y:0},canvasSize:{width:a,height:720},layers:[o,s],activeLayerId:s.id,primaryColor:`#38bdf8`,secondaryColor:`#ffffff`,brushSize:18,brushOpacity:1,vectorShapes:[{id:`v1`,type:`rect`,x:80,y:80,width:220,height:140,fill:`#8b5cf6`,stroke:`#c084fc`,strokeWidth:3},{id:`v2`,type:`circle`,x:420,y:220,radius:75,fill:`#06b6d4`,stroke:`#67e8f9`,strokeWidth:3}],videoClips:[{id:`c1`,trackId:`v1`,name:`Intro_Shot_4k.mp4`,startTime:0,duration:4.5,color:`#3b82f6`},{id:`c2`,trackId:`v1`,name:`Main_Scene.mp4`,startTime:4.5,duration:6,color:`#8b5cf6`},{id:`c3`,trackId:`a1`,name:`Score_Master.wav`,startTime:0,duration:10.5,color:`#10b981`}],currentTime:0,isPlaying:!1,aiConnected:!1},this.timelineController=new i(this.state.videoClips,this.audioEngine,20),this.timelineController.setOnTimeUpdate(e=>{this.state.currentTime=e,this.updatePlayheadDOM()}),this.timelineController.setOnStateChange(()=>{this.updatePlayControlsDOM(),this.renderTimeline()}),this.initDOM(),this.vectorEngine=new t(this.svgOverlay),this.bindEvents(),this.render(),this.checkAI()}async checkAI(){let e=await this.aiEngine.checkConnection();this.state.aiConnected=e;let t=document.getElementById(`ai-status-badge`);t&&(t.innerText=e?`● RTX 5070 Ti Active`:`○ AI Engine Offline`,t.style.color=e?`#10b981`:`#94a3b8`)}initDOM(){let e=document.getElementById(`app`);e.innerHTML=`
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
            <button class="btn-pill" id="btn-stop">⏹ Stop</button>
            <button class="btn-pill" id="btn-razor" title="Split Clip at Playhead (C)">✂ Razor Cut</button>
            <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--accent-cyan); margin-left: 8px;" id="timecode">00:00:00:00</span>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">Web Audio Scrub: Active ♫</span>
            <span style="font-size: 11px; font-weight: 600; color: var(--text-dim);">Multi-Track NLE Engine</span>
          </div>
        </div>
        <div class="timeline-workspace">
          <div class="timeline-track-headers" id="timeline-track-headers">
            <!-- Track labels: V1, V2, A1, A2 -->
          </div>
          <div class="timeline-tracks-area" id="timeline-tracks-area">
            <div class="timeline-ruler" id="timeline-ruler">
              <!-- Ruler ticks -->
            </div>
            <div id="timeline-lanes-container">
              <!-- Clip lanes -->
            </div>
            <div class="timeline-playhead" id="timeline-playhead" style="left: 0px;">
              <div class="timeline-playhead-head"></div>
            </div>
          </div>
        </div>
      </div>
    `,this.canvasElement=document.getElementById(`main-canvas`),this.canvasCtx=this.canvasElement.getContext(`2d`),this.svgOverlay=document.getElementById(`vector-overlay`)}bindEvents(){document.querySelectorAll(`.mode-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.mode;this.switchMode(t)})}),document.querySelectorAll(`.tool-item`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.tool;t&&(document.querySelectorAll(`.tool-item`).forEach(e=>e.classList.remove(`active`)),e.currentTarget.classList.add(`active`),this.state.activeTool=t)})}),document.getElementById(`primary-color`).addEventListener(`input`,e=>{this.state.primaryColor=e.target.value}),this.canvasElement.addEventListener(`mousedown`,e=>this.onMouseDown(e)),window.addEventListener(`mousemove`,e=>this.onMouseMove(e)),window.addEventListener(`mouseup`,()=>this.onMouseUp()),document.getElementById(`btn-export`)?.addEventListener(`click`,()=>{let e=document.createElement(`a`);e.href=this.canvasElement.toDataURL(`image/png`),e.download=`Lumina_Project_${Date.now()}.png`,e.click()}),document.getElementById(`btn-gen-ai`)?.addEventListener(`click`,async()=>{let e=window.prompt(`Describe generation or edit for RTX 5070 Ti:`,`futuristic glowing neon cyberpunk city, cinematic lighting`);if(!e)return;let t=await this.aiEngine.generatePromptAugmentation(e);alert(`⚡ Prompt Synthesized via Local GPU:\n\n"${t}"\n\nQueuing diffusion tensor pipeline on RTX 5070 Ti...`)}),document.getElementById(`btn-play`)?.addEventListener(`click`,()=>{this.timelineController.togglePlay()}),document.getElementById(`btn-stop`)?.addEventListener(`click`,()=>{this.timelineController.pause(),this.timelineController.setCurrentTime(0,!1),this.updatePlayheadDOM()}),document.getElementById(`btn-razor`)?.addEventListener(`click`,()=>{this.timelineController.razorCutAtPlayhead()?this.renderTimeline():alert(`Position the playhead over a clip to perform a razor split.`)});let e=document.getElementById(`timeline-tracks-area`);if(e){let t=!1,n=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left+e.scrollLeft,i=Math.max(0,r/50);this.timelineController.setCurrentTime(i,!0)};e.addEventListener(`mousedown`,e=>{t=!0,n(e)}),window.addEventListener(`mousemove`,e=>{t&&n(e)}),window.addEventListener(`mouseup`,()=>{t=!1})}}switchMode(e){this.state.mode=e,document.querySelectorAll(`.mode-btn`).forEach(t=>{t.classList.remove(`active`),t.dataset.mode===e&&t.classList.add(`active`)});let t=document.getElementById(`timeline-dock`);t&&(t.style.display=e===`motion`?`flex`:`none`),e===`vector`?this.svgOverlay.style.pointerEvents=`auto`:this.svgOverlay.style.pointerEvents=`none`,this.render()}onMouseDown(e){let t=this.canvasElement.getBoundingClientRect();if(this.isDrawing=!0,this.lastPos={x:e.clientX-t.left,y:e.clientY-t.top},this.state.activeTool===`brush`||this.state.activeTool===`eraser`){let e=this.getActiveLayer();e&&(this.photoEngine.drawStroke(e.ctx,this.lastPos,this.lastPos,this.state.primaryColor,this.state.brushSize,this.state.activeTool===`eraser`),this.renderCanvas())}}onMouseMove(e){if(!this.isDrawing)return;let t=this.canvasElement.getBoundingClientRect(),n={x:e.clientX-t.left,y:e.clientY-t.top};if(this.state.activeTool===`brush`||this.state.activeTool===`eraser`){let e=this.getActiveLayer();e&&(this.photoEngine.drawStroke(e.ctx,this.lastPos,n,this.state.primaryColor,this.state.brushSize,this.state.activeTool===`eraser`),this.renderCanvas())}this.lastPos=n}onMouseUp(){this.isDrawing=!1}getActiveLayer(){return this.state.layers.find(e=>e.id===this.state.activeLayerId)}render(){this.renderCanvas(),this.renderVectorOverlay(),this.renderPanels(),this.renderTimeline()}renderCanvas(){this.photoEngine.renderComposite(this.state.layers,this.canvasCtx)}renderVectorOverlay(){this.state.mode===`vector`||this.state.mode===`publish`?(this.svgOverlay.style.display=`block`,this.vectorEngine.render(this.state.vectorShapes)):this.svgOverlay.style.display=`none`}renderPanels(){let e=document.getElementById(`panel-content`);e.innerHTML=`
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
    `,document.querySelectorAll(`.layer-item`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.layerId;t&&(this.state.activeLayerId=t,this.renderPanels())})}),document.getElementById(`filter-bright`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`brightness`),this.renderCanvas())}),document.getElementById(`filter-invert`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`invert`),this.renderCanvas())}),document.getElementById(`filter-gray`)?.addEventListener(`click`,()=>{let e=this.getActiveLayer();e&&(this.photoEngine.applyAdjustment(e,`grayscale`),this.renderCanvas())})}updatePlayheadDOM(){let e=document.getElementById(`timecode`);e&&(e.innerText=i.formatTimecode(this.state.currentTime));let t=document.getElementById(`timeline-playhead`);if(t){let e=this.state.currentTime*50;t.style.left=`${e}px`}}updatePlayControlsDOM(){let e=document.getElementById(`btn-play`);e&&(e.innerText=this.timelineController.isPlaybackActive()?`⏸ Pause`:`▶ Play`)}renderTimeline(){let e=document.getElementById(`timeline-track-headers`),t=document.getElementById(`timeline-lanes-container`),n=document.getElementById(`timeline-ruler`);if(!e||!t||!n)return;n.innerHTML=``;let r=this.timelineController.getDuration();for(let e=0;e<=r;e+=2){let t=document.createElement(`div`);t.style.position=`absolute`,t.style.left=`${e*50}px`,t.style.top=`2px`,t.style.fontSize=`10px`,t.style.color=`var(--text-dim)`,t.style.fontFamily=`var(--font-mono)`,t.innerText=`${e}s`,n.appendChild(t)}let i=this.timelineController.getTracks();e.innerHTML=i.map(e=>`
      <div class="timeline-track-header">
        <span>${e.name}</span>
        <span style="font-size: 9px; color: ${e.type===`video`?`var(--accent-blue)`:`var(--accent-emerald)`}; text-transform: uppercase;">${e.type}</span>
      </div>
    `).join(``);let a=this.timelineController.getClips();t.innerHTML=i.map(e=>{let t=a.filter(t=>t.trackId===e.id);return`
        <div class="timeline-track-lane" data-track-id="${e.id}">
          ${t.map(e=>`
              <div class="timeline-clip" style="left: ${e.startTime*50}px; width: ${e.duration*50}px; background: ${e.color};" data-clip-id="${e.id}">
                ${e.name}
              </div>
            `).join(``)}
        </div>
      `}).join(``),this.updatePlayheadDOM(),this.updatePlayControlsDOM()}};window.addEventListener(`DOMContentLoaded`,()=>{new a});