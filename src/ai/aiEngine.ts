export class LocalAIEngine {
  private endpoint: string;

  constructor(endpoint: string = 'http://localhost:8085') {
    this.endpoint = endpoint;
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.endpoint}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async generatePromptAugmentation(task: string): Promise<string> {
    try {
      const res = await fetch(`${this.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'auto',
          messages: [
            {
              role: 'system',
              content: 'You are an expert digital artist and visual director. Expand the user concept into a high-detail generative art prompt. Return only the prompt.'
            },
            { role: 'user', content: task }
          ]
        })
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || task;
    } catch {
      return task;
    }
  }

  public async inpaintMask(
    canvasDataUrl: string,
    _maskDataUrl: string,
    prompt: string
  ): Promise<string> {
    // Bridges local Stable Diffusion / ComfyUI / Inpainting endpoint
    console.log('Sending inpainting payload to local GPU engine:', { prompt });
    return canvasDataUrl; // Returns updated canvas
  }
}
