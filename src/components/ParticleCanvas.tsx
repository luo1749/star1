import { useEffect, useRef } from 'react';

interface Mouse {
  x: number;
  y: number;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  angle: number;
  spin: number;

  constructor(initX: number, initY: number) {
    this.x = initX;
    this.y = initY;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.color = 'rgba(212, 163, 115, opacity)';
    this.opacity = Math.random() * 0.5 + 0.1;
    this.angle = Math.random() * 360;
    this.spin = Math.random() * 360 * (Math.random() < 0.5 ? 1 : -1);
  }

  update(mouse: Mouse, canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += this.spin * 0.01;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      const force = (150 - distance) / 150;
      this.x += dx * force * 0.02;
      this.y += dy * force * 0.02;
      this.opacity = Math.min(this.opacity + 0.02, 0.8);
    } else {
      this.opacity -= 0.005;
    }

    if (this.opacity <= 0) {
      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          this.x = Math.random() < 0.5 ? 0 : canvasWidth;
          this.y = Math.random() * canvasHeight;
        } else {
          this.x = Math.random() * canvasWidth;
          this.y = Math.random() < 0.5 ? 0 : canvasHeight;
        }
      } else {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
      }
      this.opacity = Math.random() * 0.5 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace('opacity', String(this.opacity));
    ctx.fill();
    ctx.restore();
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<Mouse>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      particlesRef.current = Array.from(
        { length: count },
        () => new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
      );
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.x;
      mouseRef.current.y = e.y;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.update(mouseRef.current, canvas.width, canvas.height);
        p.draw(ctx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
