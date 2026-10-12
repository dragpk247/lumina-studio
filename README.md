<div align="center">

# 🎨 Lumina Creative Studio
### The Next-Generation, Open-Source Alternative to Adobe Creative Cloud

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Hardware](https://img.shields.io/badge/Hardware-NVIDIA_RTX_5070_Ti-green.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Zero Cloud Subscriptions](https://img.shields.io/badge/Subscription-$0.00/mo-success.svg)]()

**A unified, offline-first creative workstation combining raster photo editing, vector illustration, multi-track motion editing, and page layout publishing — backed by private local GPU acceleration.**

[Live Demo](#-quickstart--live-development) • [Features](#-core-creative-engines) • [Architecture](#-architecture--engine-pillars) • [Roadmap](#-future-plans--roadmap) • [Contributing](#-contributing)

</div>

---

## 💡 Why Lumina Studio?

For decades, digital creatives and engineers have faced an anti-consumer landscape:
1. **Predatory Subscriptions**: Adobe Creative Cloud locks individual artists and dev studios into $60–$90/month subscription fees that hold private project files hostage.
2. **Fragmented Open-Source Ecosystem**: Existing open-source tools (GIMP, Inkscape, Kdenlive, Scribus) are built on disjointed GUI frameworks (GTK, Qt, wxWidgets) with clunky interfaces, inconsistent keybindings, and zero interoperability.
3. **Data Harvesting & Cloud Insecurity**: Modern cloud creative apps upload user work to external servers to train proprietary AI models without consent.

**Lumina Studio** resolves this by bringing **all four creative pillars** (Photo, Vector, Motion, and Publish) into a single, cohesive, modern workstation that runs at **60fps in any browser or native desktop wrapper**, powered entirely by **your local GPU for $0/month**.

---

## 🏛️ Architecture & Engine Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LUMINA CREATIVE STUDIO WORKSPACE                     │
├────────────────────────────────────────────────────────────────────────┤
│  Top Command Bar: Mode Switcher | Local GPU Monitor | Quick Export     │
├────────────┬───────────────────────────────────────────┬───────────────┤
│ TOOL DOCK  │ HARDWARE VIEWPORT STAGE                   │ INSPECTOR     │
│ • Move (V) │ 📸 Photo Studio (Canvas2D / WebGL)        │ • Layers      │
│ • Brush(B) │ 📐 Vector Studio (SVG / Cubic Bézier)     │ • History Undo│
│ • Pen  (P) │ 🎬 Motion Studio (WebCodecs Multi-Track)  │ • Filters     │
│ • Type (T) │ 📄 Publish Studio (Paged Typography Grid) │ • Properties  │
├────────────┴───────────────────────────────────────────┴───────────────┤
│ MULTI-TRACK NLE TIMELINE: Video 1/2 | Audio 1/2 | Waveform Scrubbing   │
├────────────────────────────────────────────────────────────────────────┤
│ LOCAL AI BACKEND (RTX 5070 Ti 16GB): Generative Inpainting, Smart Fill │
└────────────────────────────────────────────────────────────────────────┘
```

| Adobe Product | Lumina Studio Module | Underlying Engine | Key Differentiator |
| :--- | :--- | :--- | :--- |
| **Photoshop** | **Photo Studio** | Canvas2D / WebGL Compositor | Non-destructive layers, 30-state undo history, real-time adjustments |
| **Illustrator** | **Vector Studio** | SVG DOM & Cubic Bézier Curves | Draggable anchor nodes & tangent handles, `opentype.js` glyphs |
| **Premiere Pro** | **Motion Studio** | Web Audio API & Multi-Track NLE | Waveform synthesizer, audible scrub tones, clip timeline sequencing |
| **InDesign** | **Publish Studio** | Paged Vector Layout Engine | Multi-page spreads, baseline typography grids, vector PDF export |
| **Firefly** | **Local AI Hub** | Local PyTorch / RTX 5070 Ti | 100% private inpainting, zero tokens billed, runs completely offline |

---

## ⚡ Core Creative Engines

### 📸 1. Photo Studio (Raster Imaging)
- **Multi-Layer Stack**: Independent opacity sliders, layer visibility toggles, and composite blend modes (`source-over`, `destination-out`, etc.).
- **Real-Time Adjustment Filters**: Instant GPU-accelerated Brightness, Invert, and Grayscale filters.
- **State History Manager**: Infinite undo (`Ctrl+Z`) and redo (`Ctrl+Shift+Z`) snapshot tree preserving pixel states.
- **Dynamic Color Engine**: Real-time palette color picker with primary/secondary swatch toggles.

### 📐 2. Vector Studio (Illustration & Typography)
- **Interactive Cubic Bézier Pen Tool**: Anchor point placement with real-time tangent control handles (`C cp1.x cp1.y, cp2.x cp2.y, curr.x curr.y`).
- **Path Auto-Closing**: Automatic path loop detection (`Z`) when clicking within tolerance of the origin node.
- **SVG Export Engine**: Export crisp, scalable SVG code ready for web and mobile assets.
- **Typography Integration**: Font glyph outline rendering powered by `opentype.js`.

### 🎬 3. Motion Studio (Video & Audio NLE)
- **Multi-Track Timeline Dock**: Sequenced video tracks (`V1`, `V2`) and audio tracks (`A1`, `A2`).
- **Web Audio API Scrubbing**: Synthetic real-time audio scrub preview tones generated while dragging the timeline playhead.
- **Waveform Visualizer**: Algorithmic audio energy bar rendering for accurate musical cut points.

### 🤖 4. Local AI Creative Co-Pilot
- **Hardware Integration**: Bridges directly to your local **NVIDIA RTX 5070 Ti (16GB VRAM)** via localhost (`:8085` / `:11434`).
- **Generative Prompt Synthesizer**: Expands shorthand creative concepts into high-detail artistic diffusion prompts using local reasoning models.
- **Zero-Cloud Privacy**: Prompts and pixel buffers never leave your machine.

---

## 🚀 Quickstart & Live Development

### Prerequisites
- **Node.js** (v18+) & **npm**
- Modern WebGL2 / WebGPU-compatible browser (Chrome, Edge, Firefox, Brave)
- *(Optional)* NVIDIA GPU with CUDA for local AI acceleration

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/dragpk247/lumina-studio.git
cd lumina-studio

# Install dependencies
npm install

# Start the high-performance local dev server
npm run dev
```

Navigate to **`http://localhost:3000`** in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🗺️ Future Plans & Roadmap

### Phase 1: Cornerstone Refinements (Current Sprint)
- [x] Unified 4-in-1 Creative Mode Switcher (Photo, Vector, Motion, Publish)
- [x] Interactive Cubic Bézier Pen Tool with tangent handle manipulation
- [x] Multi-layer composite engine with Brightness, Invert, and Grayscale filters
- [x] Undo/Redo state snapshot history manager (`historyManager.ts`)
- [x] Multi-track NLE timeline dock with Web Audio API scrub tone generation
- [x] Local RTX 5070 Ti hardware status probe and prompt synthesis
- [ ] Magic Wand selection tool with flood-fill color tolerance
- [ ] Direct selection tool (`A`) for fine-grained node repositioning

### Phase 2: Vector Pathfinder & Typography (Q4 2026)
- [ ] **Boolean Pathfinder Engine**: Union, Subtract (Minus Front), Intersect, and Exclude for complex vector geometry.
- [ ] **Text-on-a-Path**: Flowing typography along arbitrary Bézier curves.
- [ ] **Vector Gradient Mesh**: Multi-point gradient mesh shading for photorealistic vector illustrations.

### Phase 3: Hardware Inpainting & Local Diffusion (Q1 2027)
- [ ] **Direct PyTorch / ComfyUI WebSocket Bridge**: Wire the canvas inpainting mask directly to local Stable Diffusion SDXL / Flux Schnell on RTX 5070 Ti.
- [ ] **One-Click Background Removal**: Bi-RefNet / RMBG model execution running in sub-500ms on local GPU.
- [ ] **Super-Resolution 4x**: Real-ESRGAN upscaling running directly from the export menu.

### Phase 4: Non-Linear Video Compositing & Keyframing (Q2 2027)
- [ ] **WebCodecs Video Decoding**: Hardware-accelerated H.264/AV1 multi-stream playback.
- [ ] **Razor Cut (`C`) & Slip Tool**: Interactive timeline splitting, trimming, and dragging.
- [ ] **Keyframe Animation Engine**: Cubic Bézier easing curves for Position, Scale, Rotation, and Opacity over time.

### Phase 5: Desktop Native Packaging & Plugin Ecosystem (Q3 2027)
- [ ] **Tauri / Electron Native Wrapper**: Full offline desktop application with native OS menus, file system drag-and-drop, and global shortcut hooks.
- [ ] **Open Extension API**: WebAssembly / JavaScript plugin architecture allowing developers to create custom filters, brushes, and timeline effects.

---

## 📂 Project Directory Structure

```
lumina-studio/
├── src/
│   ├── ai/
│   │   └── aiEngine.ts           # Local GPU bridge & generative prompting
│   ├── motion/
│   │   └── audioEngine.ts        # Web Audio scrubbing & waveform visualizer
│   ├── photo/
│   │   ├── historyManager.ts     # 30-state undo/redo snapshot stack
│   │   └── photoEngine.ts        # Layer compositing & adjustment filters
│   ├── styles/
│   │   └── app.css               # Dark theme studio workstation styling
│   ├── vector/
│   │   ├── bezierPen.ts          # Cubic Bézier pen tool with tangent handles
│   │   └── vectorEngine.ts       # SVG DOM rendering & shape generation
│   ├── main.ts                   # Central studio orchestrator & event loop
│   ├── types.ts                  # Core multi-modal TypeScript definitions
│   └── vite-env.d.ts             # Environment typings
├── dist/                         # Optimized production build artifacts
├── index.html                    # Web workstation viewport entry
├── package.json                  # Dependencies & build scripts
├── tsconfig.json                 # Strict TypeScript configuration
├── vite.config.ts                # Cross-origin isolated build configuration
├── FEATURES.md                   # Detailed technical feature breakdown
└── README.md                     # Project documentation & master roadmap
```

---

## 🤝 Contributing

We welcome contributions from graphics engineers, video specialists, UI designers, and AI researchers!
1. Fork the Project (`https://github.com/dragpk247/lumina-studio/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

*Built with passion by [dragpk247](https://github.com/dragpk247) — dedicated to creative freedom, open standards, and high-performance local computing.*
