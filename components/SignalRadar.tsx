
import React, { useEffect, useRef } from 'react';

const SignalRadar: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 20;

      // Draw outer circles
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshair
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Sweeping arm
      const sweepGradient = ctx.createConicGradient(angle, cx, cy);
      sweepGradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
      sweepGradient.addColorStop(0.1, 'transparent');
      
      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + 0.5);
      ctx.fill();

      // Signal dots
      if (active) {
        ctx.fillStyle = '#facc15';
        for (let i = 0; i < 5; i++) {
          const x = cx + Math.cos(i * 1.5 + angle * 0.2) * (radius * 0.7);
          const y = cy + Math.sin(i * 1.5 + angle * 0.2) * (radius * 0.7);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      angle += 0.02;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [active]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto bg-indigo-950/10 rounded-full border border-indigo-500/20 p-4">
      <canvas ref={canvasRef} width={400} height={400} className="w-full h-full opacity-60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className={`text-xs font-mono mb-1 ${active ? 'text-green-400' : 'text-slate-600'}`}>
          {active ? 'SIGNAL ACTIVE' : 'SCANNING FREQUENCY...'}
        </div>
        <div className="text-[10px] text-indigo-500/50 uppercase tracking-[0.3em]">LJT_CORE_3.0</div>
      </div>
    </div>
  );
};

export default SignalRadar;
