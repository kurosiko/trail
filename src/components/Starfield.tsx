import { useRef, useEffect, useState } from 'preact/hooks';
interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    speed: number;
    growing: boolean;
}

export default function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isReady,setIsReady] = useState<boolean>(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;
        let stars: Star[] = [];
        const count = 150;

        const initStars = () => {
          stars = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.01 + 0.003,
            growing: Math.random() > 0.5,
          }));
        };
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                if (star.growing) {
                    star.alpha += star.speed;
                    if (star.alpha >= 1) star.growing = false;
                } else {
                    star.alpha -= star.speed;
                    if (star.alpha <= 0.1) star.growing = true;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.shadowBlur = star.size > 1.2 ? 4 : 0;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);
        setIsReady(true)
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000"
            style={{
                opacity: isReady ? 1 : 0
            }}
        />
    );
}