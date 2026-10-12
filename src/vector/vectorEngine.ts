import { VectorShape } from '../types';

export class VectorEngine {
  private svgElement: SVGSVGElement;

  constructor(svgElement: SVGSVGElement) {
    this.svgElement = svgElement;
  }

  public render(shapes: VectorShape[], selectedId?: string) {
    this.svgElement.innerHTML = '';

    for (const shape of shapes) {
      let el: SVGElement | null = null;

      if (shape.type === 'rect') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', shape.x.toString());
        rect.setAttribute('y', shape.y.toString());
        rect.setAttribute('width', (shape.width || 100).toString());
        rect.setAttribute('height', (shape.height || 100).toString());
        rect.setAttribute('fill', shape.fill);
        rect.setAttribute('stroke', shape.stroke);
        rect.setAttribute('stroke-width', shape.strokeWidth.toString());
        el = rect;
      } else if (shape.type === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', shape.x.toString());
        circle.setAttribute('cy', shape.y.toString());
        circle.setAttribute('r', (shape.radius || 50).toString());
        circle.setAttribute('fill', shape.fill);
        circle.setAttribute('stroke', shape.stroke);
        circle.setAttribute('stroke-width', shape.strokeWidth.toString());
        el = circle;
      } else if (shape.type === 'path' && shape.pathData) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', shape.pathData);
        path.setAttribute('fill', shape.fill);
        path.setAttribute('stroke', shape.stroke);
        path.setAttribute('stroke-width', shape.strokeWidth.toString());
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        el = path;
      } else if (shape.type === 'text') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', shape.x.toString());
        text.setAttribute('y', shape.y.toString());
        text.setAttribute('fill', shape.fill);
        text.setAttribute('font-size', (shape.fontSize || 24).toString());
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('font-weight', '600');
        text.textContent = shape.text || 'Sample Text';
        el = text;
      }

      if (el) {
        el.setAttribute('data-id', shape.id);
        if (shape.id === selectedId) {
          el.setAttribute('stroke', '#38bdf8');
          el.setAttribute('stroke-dasharray', '4 2');
        }
        this.svgElement.appendChild(el);
      }
    }
  }

  public exportSVG(): string {
    return this.svgElement.outerHTML;
  }
}
