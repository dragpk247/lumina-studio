import './styles/app.css';
import { StudioState, StudioMode, ToolType, VectorShape } from './types';
import { PhotoEngine } from './photo/photoEngine';
import { VectorEngine } from './vector/vectorEngine';
import { LocalAIEngine } from './ai/aiEngine';
import { AudioEngine } from './motion/audioEngine';
import { TimelineController } from './motion/timelineController';
import { BezierPenTool } from './vector/bezierPen';
import { HistoryManager } from './photo/historyManager';

class LuminaStudioApp {
  private state: StudioState;
  private photoEngine: PhotoEngine;
  private vectorEngine: VectorEngine;
  private aiEngine: LocalAIEngine;
  private audioEngine: AudioEngine;
  private timelineController: TimelineController;
  private historyManager: HistoryManager;
  private penTool: BezierPenTool;
  private activeTab: 'layers' | 'props' | 'filters' = 'layers';
  
  private canvasElement!: HTMLCanvasElement;
  private canvasCtx!: CanvasRenderingContext2D;
  private svgOverlay!: SVGSVGElement;
  private isDrawing: boolean = false;
  private lastPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    const width = 1080;
    const height = 720;

    this.photoEngine = new PhotoEngine(width, height);
    this.aiEngine = new LocalAIEngine();
    this.audioEngine = new AudioEngine();
    this.historyManager = new HistoryManager();
    this.penTool = new BezierPenTool();

    const bgLayer = this.photoEngine.createLayer('Background', true);
    const artLayer = this.photoEngine.createLayer('Layer 1', false);

    this.state = {
      mode: 'photo',
      activeTool: 'brush',
      zoom: 1.0,
      pan: { x: 0, y: 0 },
      canvasSize: { width, height },
      layers: [bgLayer, artLayer],
      activeLayerId: artLayer.id,
      primaryColor: '#38bdf8',
      secondaryColor: '#ffffff',
      brushSize: 18,
      brushOpacity: 1.0,
      vectorShapes: [
        { id: 'v1', type: 'rect', x: 80, y: 80, width: 220, height: 140, fill: '#8b5cf6', stroke: '#c084fc', strokeWidth: 3 },
        { id: 'v2', type: 'circle', x: 420, y: 220, radius: 75, fill: '#06b6d4', stroke: '#67e8f9', strokeWidth: 3 }
      ],
      videoClips: [
        { id: 'c1', trackId: 'v1', name: 'Intro_Shot_4k.mp4', startTime: 0, duration: 4.5, color: '#3b82f6' },
        { id: 'c2', trackId: 'v1', name: 'Main_Scene.mp4', startTime: 4.5, duration: 6.0, color: '#8b5cf6' },
        { id: 'c3', trackId: 'a1', name: 'Score_Master.wav', startTime: 0, duration: 10.5, color: '#10b981' }
      ],
      currentTime: 0,
      isPlaying: false,
      aiConnected: false,
    };

    this.timelineController = new TimelineController(this.state.videoClips, this.audioEngine, 20);

    this.timelineController.setOnTimeUpdate((time) => {
      this.state.currentTime = time;
      this.updatePlayheadDOM();
    });

    this.timelineController.setOnStateChange(() => {
      this.updatePlayControlsDOM();
      this.renderTimeline();
    });

    this.initDOM();
    this.vectorEngine = new VectorEngine(this.svgOverlay);
    this.bindEvents();
    this.render();
    this.checkAI();
  }

  private async checkAI() {
    const connected = await this.aiEngine.checkConnection();
    this.state.aiConnected = connected;
    const badge = document.getElementById('ai-status-badge');
    if (badge) {
      badge.innerText = connected ? '● RTX 5070 Ti Active' : '○ AI Engine Offline';
      badge.style.color = connected ? '#10b981' : '#94a3b8';
    }
  }

  private initDOM() {
    const app = document.getElementById('app')!;
    app.innerHTML = `
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
    `;

    this.canvasElement = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext('2d')!;
    this.svgOverlay = document.getElementById('vector-overlay') as unknown as SVGSVGElement;
  }

  private bindEvents() {
    // Mode Switcher
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.mode as StudioMode;
        this.switchMode(mode);
      });
    });

    // Tool Switcher
    document.querySelectorAll('.tool-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = (e.currentTarget as HTMLElement).dataset.tool as ToolType;
        if (tool) this.selectTool(tool);
      });
    });

    // Color Picker
    const colorInput = document.getElementById('primary-color') as HTMLInputElement;
    colorInput.addEventListener('input', (e) => {
      this.state.primaryColor = (e.target as HTMLInputElement).value;
    });

    // Canvas Mouse Drawing
    this.canvasElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', () => this.onMouseUp());

    // Export button
    document.getElementById('btn-export')?.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = this.canvasElement.toDataURL('image/png');
      a.download = `Lumina_Project_${Date.now()}.png`;
      a.click();
    });

    // AI Inpaint / Generative button
    document.getElementById('btn-gen-ai')?.addEventListener('click', async () => {
      const userPrompt = window.prompt('Describe generation or edit for RTX 5070 Ti:', 'futuristic glowing neon cyberpunk city, cinematic lighting');
      if (!userPrompt) return;
      const enhanced = await this.aiEngine.generatePromptAugmentation(userPrompt);
      alert(`⚡ Prompt Synthesized via Local GPU:\n\n"${enhanced}"\n\nQueuing diffusion tensor pipeline on RTX 5070 Ti...`);
    });

    // Timeline Controls
    document.getElementById('btn-play')?.addEventListener('click', () => {
      this.timelineController.togglePlay();
    });

    document.getElementById('btn-stop')?.addEventListener('click', () => {
      this.timelineController.pause();
      this.timelineController.setCurrentTime(0, false);
      this.updatePlayheadDOM();
    });

    document.getElementById('btn-razor')?.addEventListener('click', () => {
      const split = this.timelineController.razorCutAtPlayhead();
      if (split) {
        this.renderTimeline();
      } else {
        alert('Position the playhead over a clip to perform a razor split.');
      }
    });

    // Inspector Panel Tab Switching
    document.querySelectorAll('.panel-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).dataset.tab as 'layers' | 'props' | 'filters';
        if (!tab) return;
        this.activeTab = tab;
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        this.renderPanels();
      });
    });

    // Keyboard Shortcuts (Undo, Redo, Tools)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const activeLayer = this.getActiveLayer();
        if (activeLayer) {
          if (e.shiftKey) {
            this.historyManager.redo(activeLayer);
          } else {
            this.historyManager.undo(activeLayer);
          }
          this.renderCanvas();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        const activeLayer = this.getActiveLayer();
        if (activeLayer) {
          this.historyManager.redo(activeLayer);
          this.renderCanvas();
        }
      } else if (e.key.toLowerCase() === 'b') {
        this.selectTool('brush');
      } else if (e.key.toLowerCase() === 'e') {
        this.selectTool('eraser');
      } else if (e.key.toLowerCase() === 'p') {
        this.selectTool('pen');
      } else if (e.key.toLowerCase() === 'v') {
        this.selectTool('select');
      } else if (e.key.toLowerCase() === 'u') {
        this.selectTool('rectangle');
      } else if (e.key.toLowerCase() === 't') {
        this.selectTool('text');
      } else if (e.key.toLowerCase() === 'i') {
        this.selectTool('eyedropper');
      } else if (e.key.toLowerCase() === 'c' && this.state.mode === 'motion') {
        this.timelineController.razorCutAtPlayhead();
        this.renderTimeline();
      } else if (e.key === ' ' && this.state.mode === 'motion') {
        e.preventDefault();
        this.timelineController.togglePlay();
      }
    });

    // Interactive timeline ruler scrubbing
    const tracksArea = document.getElementById('timeline-tracks-area');
    if (tracksArea) {
      let isScrubbing = false;

      const handleScrub = (e: MouseEvent) => {
        const rect = tracksArea.getBoundingClientRect();
        const offsetX = e.clientX - rect.left + tracksArea.scrollLeft;
        const targetSeconds = Math.max(0, offsetX / 50);
        this.timelineController.setCurrentTime(targetSeconds, true);
      };

      tracksArea.addEventListener('mousedown', (e) => {
        isScrubbing = true;
        handleScrub(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isScrubbing) handleScrub(e);
      });

      window.addEventListener('mouseup', () => {
        isScrubbing = false;
      });
    }
  }

  private switchMode(mode: StudioMode) {
    this.state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.remove('active');
      if ((b as HTMLElement).dataset.mode === mode) b.classList.add('active');
    });

    const timeline = document.getElementById('timeline-dock');
    if (timeline) {
      timeline.style.display = (mode === 'motion') ? 'flex' : 'none';
    }

    if (mode === 'vector') {
      this.svgOverlay.style.pointerEvents = 'auto';
    } else {
      this.svgOverlay.style.pointerEvents = 'none';
    }

    this.render();
  }

  private onMouseDown(e: MouseEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    this.isDrawing = true;
    this.lastPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const activeLayer = this.getActiveLayer();

    if (this.state.activeTool === 'brush' || this.state.activeTool === 'eraser') {
      if (activeLayer) {
        this.historyManager.saveState(activeLayer);
        this.photoEngine.drawStroke(
          activeLayer.ctx,
          this.lastPos,
          this.lastPos,
          this.state.primaryColor,
          this.state.brushSize,
          this.state.activeTool === 'eraser'
        );
        this.renderCanvas();
      }
    } else if (this.state.activeTool === 'eyedropper') {
      if (activeLayer) {
        const pixel = activeLayer.ctx.getImageData(this.lastPos.x, this.lastPos.y, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        this.state.primaryColor = hex;
        const colorInput = document.getElementById('primary-color') as HTMLInputElement;
        if (colorInput) colorInput.value = hex;
      }
    } else if (this.state.activeTool === 'pen') {
      if (!this.penTool.getCurrentPath()) {
        const newPath = this.penTool.startPath(this.lastPos, this.state.primaryColor, 3);
        const pathShape: VectorShape = {
          id: newPath.id,
          type: 'path',
          x: 0,
          y: 0,
          pathData: BezierPenTool.toSVGPathData(newPath),
          fill: 'transparent',
          stroke: this.state.primaryColor,
          strokeWidth: 3
        };
        this.state.vectorShapes.push(pathShape);
      } else {
        const updated = this.penTool.addNode(this.lastPos);
        if (updated) {
          const shape = this.state.vectorShapes.find(s => s.id === updated.id);
          if (shape) shape.pathData = BezierPenTool.toSVGPathData(updated);
        }
      }
      this.renderVectorOverlay();
    } else if (this.state.activeTool === 'rectangle') {
      const rectShape: VectorShape = {
        id: 'rect_' + Math.random().toString(36).substring(2, 9),
        type: 'rect',
        x: this.lastPos.x,
        y: this.lastPos.y,
        width: 140,
        height: 90,
        fill: this.state.primaryColor,
        stroke: '#ffffff',
        strokeWidth: 2
      };
      this.state.vectorShapes.push(rectShape);
      this.renderVectorOverlay();
    } else if (this.state.activeTool === 'text') {
      const userText = window.prompt('Enter text to insert onto canvas:', 'Lumina Design');
      if (userText) {
        const textShape: VectorShape = {
          id: 'text_' + Math.random().toString(36).substring(2, 9),
          type: 'text',
          x: this.lastPos.x,
          y: this.lastPos.y,
          text: userText,
          fontSize: 32,
          fill: this.state.primaryColor,
          stroke: 'none',
          strokeWidth: 0
        };
        this.state.vectorShapes.push(textShape);
        this.renderVectorOverlay();
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (this.state.activeTool === 'pen') {
      this.penTool.dragHandle(currentPos);
      const curr = this.penTool.getCurrentPath();
      if (curr) {
        const shape = this.state.vectorShapes.find(s => s.id === curr.id);
        if (shape) {
          shape.pathData = BezierPenTool.toSVGPathData(curr);
          this.renderVectorOverlay();
        }
      }
    }

    if (!this.isDrawing) return;

    if (this.state.activeTool === 'brush' || this.state.activeTool === 'eraser') {
      const activeLayer = this.getActiveLayer();
      if (activeLayer) {
        this.photoEngine.drawStroke(
          activeLayer.ctx,
          this.lastPos,
          currentPos,
          this.state.primaryColor,
          this.state.brushSize,
          this.state.activeTool === 'eraser'
        );
        this.renderCanvas();
      }
    }

    this.lastPos = currentPos;
  }

  private onMouseUp() {
    this.isDrawing = false;
    if (this.state.activeTool === 'pen') {
      this.penTool.finishCurrentNode();
    }
  }

  private getActiveLayer() {
    return this.state.layers.find(l => l.id === this.state.activeLayerId);
  }

  private render() {
    this.renderCanvas();
    this.renderVectorOverlay();
    this.renderPanels();
    this.renderTimeline();
  }

  private renderCanvas() {
    this.photoEngine.renderComposite(this.state.layers, this.canvasCtx);
  }

  private renderVectorOverlay() {
    if (this.state.mode === 'vector' || this.state.mode === 'publish') {
      this.svgOverlay.style.display = 'block';
      this.vectorEngine.render(this.state.vectorShapes);
    } else {
      this.svgOverlay.style.display = 'none';
    }
  }

  private selectTool(tool: ToolType) {
    this.state.activeTool = tool;
    document.querySelectorAll('.tool-item').forEach(b => {
      b.classList.remove('active');
      if ((b as HTMLElement).dataset.tool === tool) b.classList.add('active');
    });
  }

  private renderPanels() {
    const panel = document.getElementById('panel-content')!;

    if (this.activeTab === 'layers') {
      panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: var(--text-muted);">Layers Stack</span>
          <button class="btn-pill" id="btn-add-layer" style="padding: 2px 8px; font-size: 11px;">+ New Layer</button>
        </div>
        <div class="layer-list">
          ${this.state.layers.map(layer => `
            <div class="layer-item ${layer.id === this.state.activeLayerId ? 'active' : ''}" data-layer-id="${layer.id}">
              <div class="layer-thumb">🖼</div>
              <span class="layer-name">${layer.name}</span>
              <span style="font-size: 11px; color: var(--text-dim);">${Math.round(layer.opacity * 100)}%</span>
            </div>
          `).reverse().join('')}
        </div>
      `;

      document.getElementById('btn-add-layer')?.addEventListener('click', () => {
        const newLayer = this.photoEngine.createLayer(`Layer ${this.state.layers.length + 1}`);
        this.state.layers.push(newLayer);
        this.state.activeLayerId = newLayer.id;
        this.render();
      });

      document.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).dataset.layerId;
          if (id) {
            this.state.activeLayerId = id;
            this.renderPanels();
          }
        });
      });
    } else if (this.activeTab === 'props') {
      const activeLayer = this.getActiveLayer();
      panel.innerHTML = `
        <div style="font-weight: 700; font-size: 11px; margin-bottom: 12px; text-transform: uppercase; color: var(--text-muted);">Canvas & Tool Properties</div>
        <div class="prop-group" style="margin-bottom: 12px;">
          <div class="prop-label">Brush Size: <span id="brush-size-val">${this.state.brushSize}px</span></div>
          <input type="range" min="1" max="100" value="${this.state.brushSize}" class="prop-slider" id="slider-brush-size">
        </div>
        <div class="prop-group" style="margin-bottom: 12px;">
          <div class="prop-label">Layer Opacity: <span id="layer-opacity-val">${activeLayer ? Math.round(activeLayer.opacity * 100) : 100}%</span></div>
          <input type="range" min="0" max="100" value="${activeLayer ? Math.round(activeLayer.opacity * 100) : 100}" class="prop-slider" id="slider-layer-opacity">
        </div>
        <div class="prop-group">
          <div class="prop-label">Active Mode: <strong style="color: var(--accent-cyan);">${this.state.mode.toUpperCase()}</strong></div>
          <div class="prop-label" style="margin-top: 4px;">Canvas: ${this.state.canvasSize.width} x ${this.state.canvasSize.height} px</div>
        </div>
      `;

      document.getElementById('slider-brush-size')?.addEventListener('input', (e) => {
        this.state.brushSize = parseInt((e.target as HTMLInputElement).value, 10);
        const valEl = document.getElementById('brush-size-val');
        if (valEl) valEl.innerText = `${this.state.brushSize}px`;
      });

      document.getElementById('slider-layer-opacity')?.addEventListener('input', (e) => {
        const val = parseInt((e.target as HTMLInputElement).value, 10) / 100;
        if (activeLayer) {
          activeLayer.opacity = val;
          this.renderCanvas();
          const valEl = document.getElementById('layer-opacity-val');
          if (valEl) valEl.innerText = `${Math.round(val * 100)}%`;
        }
      });
    } else if (this.activeTab === 'filters') {
      panel.innerHTML = `
        <div style="font-weight: 700; font-size: 11px; margin-bottom: 10px; text-transform: uppercase; color: var(--text-muted);">Non-Destructive Adjustments</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="btn-pill" id="filter-bright">☀️ Enhance Brightness (+30)</button>
          <button class="btn-pill" id="filter-invert">🔄 Invert RGB Channels</button>
          <button class="btn-pill" id="filter-gray">⬛ High-Contrast Grayscale</button>
          <button class="btn-pill" id="filter-undo" style="margin-top: 10px; border-color: var(--accent-blue);">↩ Undo Action (Ctrl+Z)</button>
        </div>
      `;

      document.getElementById('filter-bright')?.addEventListener('click', () => {
        const l = this.getActiveLayer();
        if (l) { this.historyManager.saveState(l); this.photoEngine.applyAdjustment(l, 'brightness'); this.renderCanvas(); }
      });
      document.getElementById('filter-invert')?.addEventListener('click', () => {
        const l = this.getActiveLayer();
        if (l) { this.historyManager.saveState(l); this.photoEngine.applyAdjustment(l, 'invert'); this.renderCanvas(); }
      });
      document.getElementById('filter-gray')?.addEventListener('click', () => {
        const l = this.getActiveLayer();
        if (l) { this.historyManager.saveState(l); this.photoEngine.applyAdjustment(l, 'grayscale'); this.renderCanvas(); }
      });
      document.getElementById('filter-undo')?.addEventListener('click', () => {
        const l = this.getActiveLayer();
        if (l) { this.historyManager.undo(l); this.renderCanvas(); }
      });
    }
  }

  private updatePlayheadDOM() {
    const timecodeEl = document.getElementById('timecode');
    if (timecodeEl) {
      timecodeEl.innerText = TimelineController.formatTimecode(this.state.currentTime);
    }
    const playhead = document.getElementById('timeline-playhead');
    if (playhead) {
      const leftPx = this.state.currentTime * 50; // 50px per second
      playhead.style.left = `${leftPx}px`;
    }
  }

  private updatePlayControlsDOM() {
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.innerText = this.timelineController.isPlaybackActive() ? '⏸ Pause' : '▶ Play';
    }
  }

  private renderTimeline() {
    const headers = document.getElementById('timeline-track-headers');
    const lanes = document.getElementById('timeline-lanes-container');
    const ruler = document.getElementById('timeline-ruler');
    if (!headers || !lanes || !ruler) return;

    // Render ruler markers (every second for 20s)
    ruler.innerHTML = '';
    const totalSecs = this.timelineController.getDuration();
    for (let s = 0; s <= totalSecs; s += 2) {
      const tick = document.createElement('div');
      tick.style.position = 'absolute';
      tick.style.left = `${s * 50}px`;
      tick.style.top = '2px';
      tick.style.fontSize = '10px';
      tick.style.color = 'var(--text-dim)';
      tick.style.fontFamily = 'var(--font-mono)';
      tick.innerText = `${s}s`;
      ruler.appendChild(tick);
    }

    // Render track headers
    const tracks = this.timelineController.getTracks();
    headers.innerHTML = tracks.map(t => `
      <div class="timeline-track-header">
        <span>${t.name}</span>
        <span style="font-size: 9px; color: ${t.type === 'video' ? 'var(--accent-blue)' : 'var(--accent-emerald)'}; text-transform: uppercase;">${t.type}</span>
      </div>
    `).join('');

    // Render track lanes & clips
    const clips = this.timelineController.getClips();
    lanes.innerHTML = tracks.map(t => {
      const trackClips = clips.filter(c => c.trackId === t.id);
      return `
        <div class="timeline-track-lane" data-track-id="${t.id}">
          ${trackClips.map(c => {
            const left = c.startTime * 50;
            const width = c.duration * 50;
            return `
              <div class="timeline-clip" style="left: ${left}px; width: ${width}px; background: ${c.color};" data-clip-id="${c.id}">
                ${c.name}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }).join('');

    this.updatePlayheadDOM();
    this.updatePlayControlsDOM();
  }
}

// Mount app on startup
window.addEventListener('DOMContentLoaded', () => {
  new LuminaStudioApp();
});
