// Main application controller
class WrappedApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.quizActive = false;
        this.completedQuizzes = new Set(); // Track which slides have had quiz completed

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBars();
        this.showSlide(0);

        // Auto-show quiz for slides that have them
        setTimeout(() => {
            this.checkAndShowQuiz();
        }, 500);
    }

    setupEventListeners() {
        // Touch events for swipe
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Tap areas for navigation
        document.getElementById('tap-left')?.addEventListener('click', () => this.prevSlide());
        document.getElementById('tap-right')?.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.quizActive) return;
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Sound toggle
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            window.soundManager.toggleMute();
            document.getElementById('sound-toggle').classList.toggle('muted');
        });

        // Replay button
        document.getElementById('replay-btn')?.addEventListener('click', () => {
            this.replay();
        });

        // Swipe to open button - two-step interaction
        const swipeToOpen = document.querySelector('.swipe-to-open');
        swipeToOpen?.addEventListener('click', (e) => {
            if (this.currentSlide === 0) {
                if (!swipeToOpen.classList.contains('expanded')) {
                    // First click: expand the component
                    swipeToOpen.classList.add('expanded');
                    e.stopPropagation(); // Prevent tap area from triggering
                } else {
                    // Second click: navigate to next slide
                    this.nextSlide();
                }
            }
        });
    }

    handleTouchStart(e) {
        if (this.quizActive) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        if (this.quizActive) return;
        // Prevent default to avoid scrolling while swiping
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = Math.abs(touchX - this.touchStartX);
        const diffY = Math.abs(touchY - this.touchStartY);

        // If horizontal swipe is more significant than vertical
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (this.quizActive) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - this.touchStartX;
        const diffY = touchEndY - this.touchStartY;

        // Check if swipe is more horizontal than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // Swipe right - go to previous slide
                this.prevSlide();
            } else if (diffX < -50) {
                // Swipe left - go to next slide
                this.nextSlide();
            }
        } else if (this.currentSlide === 0 && diffY < -50) {
            // Swipe up on intro slide
            this.nextSlide();
        }
    }

    nextSlide() {
        if (this.isTransitioning || this.quizActive) return;
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.isTransitioning || this.quizActive) return;
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;
        const direction = index > this.currentSlide ? 'next' : 'prev';

        // Play swipe sound
        window.soundManager.play('swipe');

        // Haptic feedback
        window.hapticManager.light();

        // Hide current slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        currentSlideEl?.classList.remove('active');
        if (direction === 'next') {
            currentSlideEl?.classList.add('prev');
        }

        // Show new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${index}"]`);
        newSlideEl?.classList.remove('prev');
        newSlideEl?.classList.add('active');

        this.currentSlide = index;
        this.updateProgressBars();

        // Animate slide content
        setTimeout(() => {
            window.animationManager.animateSlide(index);
            this.checkAndShowQuiz();
        }, 100);

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    showSlide(index) {
        const slideEl = document.querySelector(`.slide[data-slide="${index}"]`);
        slideEl?.classList.add('active');
        this.currentSlide = index;
        this.updateProgressBars();

        setTimeout(() => {
            window.animationManager.animateSlide(index);
        }, 100);
    }

    updateProgressBars() {
        const bars = document.querySelectorAll('.progress-bar');
        bars.forEach((bar, index) => {
            bar.classList.remove('active', 'completed');
            if (index < this.currentSlide) {
                bar.classList.add('completed');
            } else if (index === this.currentSlide) {
                bar.classList.add('active');
            }
        });
    }

    checkAndShowQuiz() {
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        const hasQuiz = currentSlideEl?.getAttribute('data-has-quiz') === 'true';

        // Only show quiz if it hasn't been completed yet
        if (hasQuiz && this.currentSlide > 0 && !this.completedQuizzes.has(this.currentSlide)) {
            const question = currentSlideEl.getAttribute('data-quiz-question');
            const options = JSON.parse(currentSlideEl.getAttribute('data-quiz-options') || '[]');
            const answerIndex = parseInt(currentSlideEl.getAttribute('data-quiz-answer') || '0');

            window.quizManager.show(question, options, answerIndex, () => {
                this.quizActive = false;
                this.completedQuizzes.add(this.currentSlide); // Mark quiz as completed
                window.animationManager.revealSlideContent(this.currentSlide);
            });

            this.quizActive = true;
        }
    }

    replay() {
        // Mark all quizzes as completed so they won't show during replay
        for (let i = 0; i < this.totalSlides; i++) {
            this.completedQuizzes.add(i);
        }

        // Reset to first slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        currentSlideEl?.classList.remove('active');

        // Clear all previous states
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active', 'prev');
        });

        // Go to first slide
        this.currentSlide = 0;
        this.showSlide(0);

        // Play sound
        window.soundManager.play('swipe');
        window.hapticManager.light();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WrappedApp();
});
