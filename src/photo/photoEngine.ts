import { Layer } from '../types';

export class PhotoEngine {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public createLayer(name: string, fillWithWhite: boolean = false): Layer {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d')!;

    if (fillWithWhite) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    return {
      id: 'layer_' + Math.random().toString(36).substring(2, 9),
      name,
      visible: true,
      locked: false,
      opacity: 1.0,
      blendMode: 'source-over',
      canvas,
      ctx,
    };
  }

  public renderComposite(layers: Layer[], targetCtx: CanvasRenderingContext2D) {
    targetCtx.clearRect(0, 0, this.width, this.height);

    for (const layer of layers) {
      if (!layer.visible || layer.opacity === 0) continue;

      targetCtx.save();
      targetCtx.globalAlpha = layer.opacity;
      targetCtx.globalCompositeOperation = layer.blendMode;
      targetCtx.drawImage(layer.canvas, 0, 0);
      targetCtx.restore();
    }
  }

  public drawStroke(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    size: number,
    isEraser: boolean = false
  ) {
    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  public applyAdjustment(layer: Layer, type: 'brightness' | 'invert' | 'grayscale' | 'blur') {
    const imgData = layer.ctx.getImageData(0, 0, this.width, this.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (type === 'invert') {
        data[i] = 255 - data[i];       // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      } else if (type === 'grayscale') {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      } else if (type === 'brightness') {
        data[i] = Math.min(255, data[i] + 30);
        data[i + 1] = Math.min(255, data[i + 1] + 30);
        data[i + 2] = Math.min(255, data[i + 2] + 30);
      }
    }

    layer.ctx.putImageData(imgData, 0, 0);
  }
}
