// Resize the CSS canvas size to match its rendering size
export function resizeCanvasToDisplay(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
}
