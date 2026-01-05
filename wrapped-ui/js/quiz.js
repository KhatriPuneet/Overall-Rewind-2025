// Quiz Manager
class QuizManager {
    constructor() {
        this.overlay = document.getElementById('quiz-overlay');
        this.questionEl = null;
        this.optionsEl = null;
        this.skipBtn = null;
        this.currentAnswer = null;
        this.onComplete = null;
        this.answered = false;
        this.timeoutTimer = null;
        this.timerBar = null;

        this.init();
    }

    init() {
        if (!this.overlay) return;

        this.questionEl = this.overlay.querySelector('.quiz-question');
        this.optionsEl = this.overlay.querySelector('.quiz-options');
        this.skipBtn = this.overlay.querySelector('.quiz-skip');

        if (this.skipBtn) {
            this.skipBtn.addEventListener('click', () => this.skip());
        }
    }

    show(question, options, answerIndex, onComplete) {
        this.currentAnswer = answerIndex;
        this.onComplete = onComplete;
        this.answered = false;

        // Set question
        if (this.questionEl) {
            this.questionEl.textContent = question;
        }

        // Create options
        if (this.optionsEl) {
            this.optionsEl.innerHTML = '';
            options.forEach((option, index) => {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'quiz-option';
                optionBtn.textContent = option;
                optionBtn.addEventListener('click', () => this.selectOption(index, optionBtn));
                this.optionsEl.appendChild(optionBtn);
            });
        }

        // Show overlay with animation
        this.overlay.classList.remove('hidden');
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 10);

        // Add blur class to slide
        const currentSlide = document.querySelector('.slide.active');
        if (currentSlide) {
            currentSlide.classList.add('quiz-blur');
        }

        // Initialize or reset timeout bar
        if (!this.timerBar) {
            this.timerBar = document.createElement('div');
            this.timerBar.className = 'quiz-timeout-bar';
            const quizContent = this.overlay.querySelector('.quiz-content');
            if (quizContent) {
                // Prepend to make it the first child for sticky positioning
                quizContent.insertBefore(this.timerBar, quizContent.firstChild);
            } else {
                this.overlay.appendChild(this.timerBar);
            }
        }

        // Reset animation
        this.timerBar.style.transition = 'none';
        this.timerBar.style.width = '100%';

        // Force reflow
        this.timerBar.offsetHeight;

        // Start 3s countdown
        this.timerBar.style.transition = 'width 3s linear';
        this.timerBar.style.width = '0%';

        // Set auto-dismiss timer
        if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
        this.timeoutTimer = setTimeout(() => {
            if (!this.answered) {
                this.skip();
            }
        }, 3000);
    }

    selectOption(index, optionBtn) {
        if (this.answered) return;

        // Stop timer
        if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
        if (this.timerBar) {
            // Freeze bar at current position
            const width = this.timerBar.offsetWidth;
            this.timerBar.style.transition = 'none';
            this.timerBar.style.width = `${width}px`;
        }

        this.answered = true;
        const isCorrect = index === this.currentAnswer;

        // Haptic feedback
        window.hapticManager.medium();

        // Visual feedback
        if (isCorrect) {
            optionBtn.classList.add('correct');
            window.soundManager.play('correct');
            window.hapticManager.success();

            // Show confetti or success animation
            this.showSuccessAnimation();

            setTimeout(() => {
                this.hide();
            }, 1500);
        } else {
            optionBtn.classList.add('wrong');
            window.soundManager.play('wrong');
            window.hapticManager.error();

            // Show correct answer after a delay
            setTimeout(() => {
                const correctBtn = this.optionsEl.children[this.currentAnswer];
                if (correctBtn) {
                    correctBtn.classList.add('correct');
                }

                setTimeout(() => {
                    this.hide();
                }, 1500);
            }, 800);
        }
    }

    skip() {
        this.hide();
    }

    hide() {
        if (this.timeoutTimer) clearTimeout(this.timeoutTimer);

        // Remove blur class from slide
        const currentSlide = document.querySelector('.slide.active');
        if (currentSlide) {
            currentSlide.classList.remove('quiz-blur');
        }

        // Hide overlay with slide-down animation
        this.overlay.classList.remove('active');
        setTimeout(() => {
            this.overlay.classList.add('hidden');
            if (this.onComplete) {
                this.onComplete();
            }
        }, 500); // Match the slide-down animation duration
    }

    showSuccessAnimation() {
        // Simple success animation - could be enhanced with confetti library
        const overlay = this.overlay;
        const particles = [];

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';

            overlay.appendChild(particle);
            particles.push(particle);

            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let x = 0;
            let y = 0;
            let opacity = 1;

            const animate = () => {
                x += vx * 0.016;
                y += vy * 0.016 + 50 * 0.016; // gravity
                opacity -= 0.02;

                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };

            animate();
        }
    }
}

// Initialize quiz manager
window.quizManager = new QuizManager();
