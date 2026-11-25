window.Animations = {
  init() {
    this.initCanvas();
    this.animateTools();
  },
  
  initCanvas() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1
    }));
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  },
  
  animateTools() {
    const wrench = document.getElementById('wrench');
    const oil = document.getElementById('oilCan');
    setInterval(() => {
      const rx = (Math.random() - 0.5) * 150;
      const ry = (Math.random() - 0.5) * 100;
      const rr = (Math.random() - 0.5) * 20;
      wrench.style.transform = `translate(${rx}px, ${ry}px) rotate(${rr}deg)`;
    }, 4000);
    setInterval(() => {
      const rx = (Math.random() - 0.5) * 120;
      const ry = (Math.random() - 0.5) * 80;
      const rr = (Math.random() - 0.5) * 25;
      oil.style.transform = `translate(${rx}px, ${ry}px) rotate(${rr}deg)`;
    }, 5000);
  }
};
