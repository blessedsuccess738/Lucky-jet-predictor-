
import React, { useEffect, useRef } from 'react';
import { GameStatus } from '../types';

interface AviatorCanvasProps {
  status: GameStatus;
  multiplier: number;
}

const AviatorCanvas: React.FC<AviatorCanvasProps> = ({ status, multiplier }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;

      // Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      if (status === GameStatus.FLYING || status === GameStatus.CRASHED) {
        // Draw Curve
        ctx.beginPath();
        ctx.strokeStyle = status === GameStatus.CRASHED ? '#ef4444' : '#ef4444';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.moveTo(0, height);

        const points = 50;
        const curveHeight = Math.min(height - 50, (multiplier - 1) * 30);
        const curveWidth = Math.min(width - 100, (multiplier - 1) * 80);

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * curveWidth;
          const y = height - Math.pow(i / points, 2.5) * curveHeight;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Shadow/Fill
        ctx.lineTo(curveWidth, height);
        ctx.lineTo(0, height);
        const gradient = ctx.createLinearGradient(0, height - curveHeight, 0, height);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw Plane (Simplified as a red triangle/shape)
        if (status === GameStatus.FLYING) {
          const planeX = curveWidth;
          const planeY = height - curveHeight;
          
          ctx.save();
          ctx.translate(planeX, planeY);
          ctx.rotate(-Math.PI / 8);
          
          // Body
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Tail
          ctx.beginPath();
          ctx.moveTo(-15, 0);
          ctx.lineTo(-25, -10);
          ctx.lineTo(-20, 0);
          ctx.fill();

          // Propeller blur
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          const propRadius = 15;
          ctx.beginPath();
          ctx.arc(20, 0, propRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        }
      }

      if (status === GameStatus.WAITING) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '20px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('WAITING FOR NEXT ROUND...', width / 2, height / 2);
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [status, multiplier]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-full object-cover"
      />
      {status === GameStatus.FLYING && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-6xl md:text-8xl font-orbitron font-bold text-white drop-shadow-2xl">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      )}
      {status === GameStatus.CRASHED && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-red-600/20 backdrop-blur-md p-6 rounded-2xl border border-red-500/50">
          <div className="text-xl font-orbitron text-red-400 mb-2 uppercase tracking-widest">Flew Away!</div>
          <div className="text-6xl font-orbitron font-bold text-red-500">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      )}
    </div>
  );
};

export default AviatorCanvas;
