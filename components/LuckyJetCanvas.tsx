
import React, { useEffect, useRef } from 'react';
import { GameStatus } from '../types';

interface LuckyJetCanvasProps {
  status: GameStatus;
  multiplier: number;
}

const LuckyJetCanvas: React.FC<LuckyJetCanvasProps> = ({ status, multiplier }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Stars Background
      ctx.fillStyle = '#ffffff';
      for(let i=0; i<30; i++) {
        const x = (Math.sin(i * 123.4) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 432.1) * 0.5 + 0.5) * height;
        const size = Math.abs(Math.sin(Date.now()/1000 + i)) * 1.5;
        ctx.globalAlpha = size / 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Grid
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 60) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      if (status === GameStatus.FLYING || status === GameStatus.CRASHED) {
        const curveHeight = Math.min(height - 80, (multiplier - 1) * 35);
        const curveWidth = Math.min(width - 120, (multiplier - 1) * 70);

        // Curve Line (Lucky Jet Purple/Indigo)
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.moveTo(0, height);

        const points = 60;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * curveWidth;
          const y = height - Math.pow(i / points, 2.2) * curveHeight;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Area Fill
        ctx.lineTo(curveWidth, height);
        ctx.lineTo(0, height);
        const gradient = ctx.createLinearGradient(0, height - curveHeight, 0, height);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Character Joe (Simplified)
        if (status === GameStatus.FLYING) {
          const joeX = curveWidth;
          const joeY = height - curveHeight;

          ctx.save();
          ctx.translate(joeX, joeY);
          
          // Flame/Jet effect
          const flameSize = 10 + Math.random() * 15;
          const flameGrad = ctx.createRadialGradient(0, 5, 0, 0, 5, flameSize);
          flameGrad.addColorStop(0, '#facc15');
          flameGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.arc(0, 10, flameSize, 0, Math.PI * 2);
          ctx.fill();

          // Body (Purple suit)
          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.roundRect(-12, -25, 24, 30, 8);
          ctx.fill();

          // Helmet (Gold visor)
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.roundRect(-8, -20, 16, 10, 2);
          ctx.fill();

          // Jetpack (Silver/Grey)
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.roundRect(-18, -15, 6, 20, 2);
          ctx.roundRect(12, -15, 6, 20, 2);
          ctx.fill();

          ctx.restore();
        }
      }

      if (status === GameStatus.WAITING) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
        ctx.font = '22px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('WAITING FOR JOE TO FUEL UP...', width / 2, height / 2);
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [status, multiplier]);

  return (
    <div className="relative w-full h-[350px] md:h-[450px] bg-[#0b0e14]/80 rounded-2xl overflow-hidden border border-indigo-500/30">
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={450} 
        className="w-full h-full object-cover"
      />
      {status === GameStatus.FLYING && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-7xl md:text-9xl font-orbitron font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      )}
      {status === GameStatus.CRASHED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500">
          <div className="text-center animate-bounce">
            <div className="text-2xl font-orbitron text-yellow-400 mb-2 tracking-[0.3em] uppercase">Joe Flew Away!</div>
            <div className="text-8xl font-orbitron font-bold text-white drop-shadow-[0_0_15px_rgba(24acc15,0.8)]">
              {multiplier.toFixed(2)}x
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyJetCanvas;
