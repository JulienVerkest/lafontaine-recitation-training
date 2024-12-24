import { useEffect, useRef } from 'react';

interface VoiceWaveProps {
  isListening: boolean;
}

export function VoiceWave({ isListening }: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isListening) {
        // Draw flat line when not listening
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const frequency = 0.02;
        const amplitude = isListening ? 15 : 5;
        const y = canvas.height / 2 + 
                 Math.sin(x * frequency + phase) * amplitude * 
                 Math.sin(x * 0.003 + phase * 0.5);
        ctx.lineTo(x, y);
      }

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#818CF8');   // indigo-400
      gradient.addColorStop(1, '#6366F1');   // indigo-500

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Update phase for animation
      phase += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isListening]);

  return (
    <canvas 
      ref={canvasRef}
      width={200}
      height={60}
      className="absolute bottom-2 left-1/2 -translate-x-1/2"
    />
  );
}
