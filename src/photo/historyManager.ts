import { Layer } from '../types';

export class HistoryManager {
  private undoStack: ImageData[] = [];
  private redoStack: ImageData[] = [];
  private maxStates: number = 30;

  public saveState(layer: Layer) {
    const data = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
    this.undoStack.push(data);
    if (this.undoStack.length > this.maxStates) {
      this.undoStack.shift();
    }
    // Clear redo on new action
    this.redoStack = [];
  }

  public undo(layer: Layer): boolean {
    if (this.undoStack.length === 0) return false;
    const current = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
    this.redoStack.push(current);

    const prev = this.undoStack.pop()!;
    layer.ctx.putImageData(prev, 0, 0);
    return true;
  }

  public redo(layer: Layer): boolean {
    if (this.redoStack.length === 0) return false;
    const current = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
    this.undoStack.push(current);

    const next = this.redoStack.pop()!;
    layer.ctx.putImageData(next, 0, 0);
    return true;
  }
}
