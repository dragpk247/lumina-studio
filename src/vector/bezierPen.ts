export interface Point {
  x: number;
  y: number;
}

export interface BezierNode {
  anchor: Point;
  handleIn?: Point;
  handleOut?: Point;
}

export interface BezierPath {
  id: string;
  nodes: BezierNode[];
  closed: boolean;
  stroke: string;
  strokeWidth: number;
  fill: string;
}

export class BezierPenTool {
  private currentPath: BezierPath | null = null;
  private activeNodeIndex: number = -1;
  private isDraggingHandle: boolean = false;

  public startPath(point: Point, stroke: string = '#c084fc', strokeWidth: number = 2, fill: string = 'transparent'): BezierPath {
    this.currentPath = {
      id: 'path_' + Math.random().toString(36).substring(2, 9),
      nodes: [
        {
          anchor: { ...point },
          handleIn: undefined,
          handleOut: { ...point }
        }
      ],
      closed: false,
      stroke,
      strokeWidth,
      fill
    };
    this.activeNodeIndex = 0;
    this.isDraggingHandle = true;
    return this.currentPath;
  }

  public dragHandle(currentPoint: Point) {
    if (!this.currentPath || this.activeNodeIndex < 0 || !this.isDraggingHandle) return;
    const node = this.currentPath.nodes[this.activeNodeIndex];
    const dx = currentPoint.x - node.anchor.x;
    const dy = currentPoint.y - node.anchor.y;

    node.handleOut = { x: node.anchor.x + dx, y: node.anchor.y + dy };
    node.handleIn = { x: node.anchor.x - dx, y: node.anchor.y - dy };
  }

  public addNode(point: Point): BezierPath | null {
    if (!this.currentPath) return null;

    // Check if clicking near first anchor to close path
    const firstAnchor = this.currentPath.nodes[0].anchor;
    const distToStart = Math.hypot(point.x - firstAnchor.x, point.y - firstAnchor.y);
    if (distToStart < 10 && this.currentPath.nodes.length > 2) {
      this.currentPath.closed = true;
      const finished = this.currentPath;
      this.currentPath = null;
      this.activeNodeIndex = -1;
      this.isDraggingHandle = false;
      return finished;
    }

    const newNode: BezierNode = {
      anchor: { ...point },
      handleIn: undefined,
      handleOut: { ...point }
    };
    this.currentPath.nodes.push(newNode);
    this.activeNodeIndex = this.currentPath.nodes.length - 1;
    this.isDraggingHandle = true;
    return this.currentPath;
  }

  public finishCurrentNode() {
    this.isDraggingHandle = false;
  }

  public getCurrentPath(): BezierPath | null {
    return this.currentPath;
  }

  public static toSVGPathData(path: BezierPath): string {
    if (!path.nodes || path.nodes.length === 0) return '';
    let d = `M ${path.nodes[0].anchor.x} ${path.nodes[0].anchor.y}`;

    for (let i = 1; i < path.nodes.length; i++) {
      const prev = path.nodes[i - 1];
      const curr = path.nodes[i];

      const cp1 = prev.handleOut || prev.anchor;
      const cp2 = curr.handleIn || curr.anchor;

      d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.anchor.x} ${curr.anchor.y}`;
    }

    if (path.closed && path.nodes.length > 2) {
      const last = path.nodes[path.nodes.length - 1];
      const first = path.nodes[0];
      const cp1 = last.handleOut || last.anchor;
      const cp2 = first.handleIn || first.anchor;
      d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.anchor.x} ${first.anchor.y} Z`;
    }

    return d;
  }
}
