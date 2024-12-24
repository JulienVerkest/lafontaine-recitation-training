import { useEffect, useRef } from 'react';

export function VoiceWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const draw = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(99, 102, 241)';
      ctx.lineWidth = 2;

      const amplitude = 20;
      const frequency = 0.05;
      const waves = 3;

      for (let x = 0; x < canvas.width; x++) {
        let y = 0;
        for (let i = 0; i < waves; i++) {
          y += Math.sin((x * frequency * (i + 1)) + phase + i * Math.PI / 4) * 
               (amplitude / (i + 1));
        }
        
        if (x === 0) {
          ctx.moveTo(x, canvas.height / 2 + y);
        } else {
          ctx.lineTo(x, canvas.height / 2 + y);
        }
      }

      ctx.stroke();
      phase += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className="mx-auto"
    />
  );
}
