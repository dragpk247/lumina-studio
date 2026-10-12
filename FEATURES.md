# Lumina Studio - Architecture & Feature Expansion Plan

## 1. High-Value Adobe Creative Cloud Replacement Features

### A. Photo Studio (Photoshop Killer)
- **Advanced Layer Engine**:
  - Non-destructive Adjustment Layers (Curves, Levels, HSL, Color Balance, Vibrance).
  - Layer Masks & Clipping Masks (Paint on mask in grayscale to hide/reveal pixels).
  - Full 16 Blend Modes (Multiply, Screen, Overlay, Color Dodge, Soft Light, Difference, etc.).
  - History State Snapshot & Unlimited Undo/Redo Tree (`Ctrl+Z` / `Ctrl+Shift+Z`).
- **Smart Selection & Masking**:
  - Magic Wand / Color Range Selector (Flood fill with tolerance).
  - Magnetic & Polygonal Lasso.
  - Quick Selection Brush.
- **Local AI Inpainting & Retouching (RTX 5070 Ti)**:
  - Generative Fill (Type prompt inside selection, local diffusion fills background).
  - One-Click Background Removal (Bi-RefNet / RMBG model on GPU).
  - Super-Resolution 4x Upscaling (Real-ESRGAN).

---

### B. Vector Studio (Illustrator Killer)
- **Interactive Cubic Bézier Pen Tool**:
  - Click to place anchor point, drag for smooth tangent control handles.
  - Node editing tool (Direct Selection `A`) to adjust anchor points and handle curvature.
  - Convert point: smooth vs. corner anchor points.
- **Boolean Path Operations (Pathfinder)**:
  - Union (Merge paths).
  - Subtract / Minus Front (Cut hole in shape).
  - Intersect (Keep overlapping geometry).
  - Exclude (XOR non-overlapping areas).
- **Typography Engine**:
  - Text-on-a-path & glyph outlines (via `opentype.js`).
  - Font loading, kerning, tracking, and leading controls.
  - Convert text to editable vector outlines.

---

### C. Motion Studio (Premiere Pro & After Effects Killer)
- **Interactive Multi-Track NLE Timeline**:
  - Draggable timeline playhead with real-time timecode readout.
  - Multi-track timeline sequencing: Video 1, Video 2, Audio 1, Audio 2.
  - Clip trimming, slip/slide, razor cutting tool (`C`), and drag-and-drop reordering.
- **Keyframe Animation Engine**:
  - Property keyframing: Position (X, Y), Scale, Rotation, Opacity over time.
  - Easing curves (Linear, Ease-In, Ease-Out, Cubic Bézier).
- **Audio Waveform Visualizer & Scrubbing**:
  - Web Audio API real-time waveform rendering per audio clip.
  - Volume attenuation envelope and cross-fades.

---

### D. Publish Studio (InDesign Killer)
- **Master Pages & Multi-Page Document Spreads**:
  - Facing pages view (Left / Right spreads).
  - Automatic page numbering (`Page [current] of [total]`).
- **Print Production & Layout Grid**:
  - Column guides, baseline grid, bleed box (3mm print bleed), margin rulers.
  - High-res vector PDF export with embedded fonts.

---

### E. AI Creative Co-Pilot & Offline Generation Hub
- **Local Bridge to RTX 5070 Ti**:
  - Python FastAPI / PyTorch daemon on localhost (`:8086`) for Stable Diffusion SDXL / Flux Schnell and background removal.
  - Smart Assistant Panel: Ask design critique, auto-palette generator, or prompt enhancer.
