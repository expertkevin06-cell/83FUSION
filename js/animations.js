// Gestion des animations du fond d'écran
class BackgroundAnimations {
    constructor() {
        this.wrench = document.getElementById('wrench');
        this.oilCan = document.getElementById('oilCan');
        this.bubbles = document.querySelectorAll('.bubble');
        
        this.initRandomMovements();
    }

    initRandomMovements() {
        // Mouvements aléatoires pour la clé et la burette
        setInterval(() => {
            this.randomMove(this.wrench);
            this.randomMove(this.oilCan);
        }, 5000);
    }

    randomMove(element) {
        if (!element) return;
        
        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 150;
        const randomRotate = (Math.random() - 0.5) * 30;
        
        element.style.transition = 'transform 3s ease-in-out';
        element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    }

    pause() {
        document.querySelectorAll('.animated-background *').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resume() {
        document.querySelectorAll('.animated-background *').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new BackgroundAnimations();
});
