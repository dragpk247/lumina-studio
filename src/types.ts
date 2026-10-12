export type StudioMode = 'photo' | 'vector' | 'motion' | 'publish';

export type ToolType = 
  | 'select' 
  | 'marquee' 
  | 'brush' 
  | 'eraser' 
  | 'pen' 
  | 'rectangle' 
  | 'ellipse' 
  | 'text' 
  | 'razor' 
  | 'bucket' 
  | 'eyedropper' 
  | 'inpaint';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: GlobalCompositeOperation;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface VectorShape {
  id: string;
  type: 'rect' | 'circle' | 'path' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  pathData?: string;
  text?: string;
  fontSize?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface VideoClip {
  id: string;
  trackId: string;
  name: string;
  startTime: number;
  duration: number;
  color: string;
}

export interface StudioState {
  mode: StudioMode;
  activeTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  canvasSize: { width: number; height: number };
  layers: Layer[];
  activeLayerId: string;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  brushOpacity: number;
  vectorShapes: VectorShape[];
  videoClips: VideoClip[];
  currentTime: number;
  isPlaying: boolean;
  aiConnected: boolean;
}
