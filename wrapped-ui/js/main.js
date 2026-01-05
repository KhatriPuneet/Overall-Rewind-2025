// Main application controller
class WrappedApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.isTransitioning = false;
        this.quizActive = false;
        this.completedQuizzes = new Set(); // Track which slides have had quiz completed

        // Touch tracking
        this.touchStartX = 0;
        this.touchStartY = 0;

        // Vertical drag state for slide 0
        this.isDraggingVertical = false;
        this.dragStartY = 0;
        this.currentDragY = 0;
        this.dragThreshold = 0.3; // 30% of screen height

        this.slideTimer = null; // Timer for auto-advancing slides

        this.init();

        // Track App Open
        if (window.posthog) {
            posthog.capture('opened_rewind_overall_2025');
        }
    }

    init() {
        this.setupEventListeners();
        this.showSlide(0);
        window.animationManager.revealSlideContent(0);

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
        document.getElementById('tap-left')?.addEventListener('click', () => this.prevSlide('tap'));
        document.getElementById('tap-right')?.addEventListener('click', () => this.nextSlide('tap'));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.quizActive) return;
            if (e.key === 'ArrowLeft') this.prevSlide('tap');
            if (e.key === 'ArrowRight') this.nextSlide('tap');
        });

        // Sound toggle
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            window.soundManager.toggleMute();
            const soundBtn = document.getElementById('sound-toggle');
            const icon = soundBtn.querySelector('.material-symbols-outlined');
            soundBtn.classList.toggle('muted');

            // Change icon based on muted state
            if (soundBtn.classList.contains('muted')) {
                icon.textContent = 'volume_off';
            } else {
                icon.textContent = 'volume_up';
            }
        });

        // Replay button
        document.getElementById('replay-btn')?.addEventListener('click', () => {
            this.replay();
        });

        // Swipe to open button - trigger vertical transition animation
        document.querySelector('.swipe-container')?.addEventListener('click', () => {
            if (this.currentSlide === 0) {
                // Simulate a swipe-up by triggering the vertical transition
                this.completeVerticalTransition();
            }
        });
    }

    handleTouchStart(e) {
        if (this.quizActive) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;

        // Initialize vertical drag state for slide 0
        if (this.currentSlide === 0) {
            this.dragStartY = e.touches[0].clientY;
            this.isDraggingVertical = false; // Will be set to true in touchmove if vertical
        }
    }

    handleTouchMove(e) {
        if (this.quizActive) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchX - this.touchStartX;
        const diffY = touchY - this.touchStartY;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);

        // On slide 0, handle vertical drag for reveal
        if (this.currentSlide === 0 && diffY < -20 && absDiffY > absDiffX) {
            // User is dragging up on slide 0
            this.isDraggingVertical = true;
            e.preventDefault();

            const dragDistance = this.touchStartY - touchY;
            this.currentDragY = dragDistance;

            // Apply progressive transform
            this.handleVerticalDrag(dragDistance);
        }
        // Horizontal swipe detection for other slides
        else if (absDiffX > absDiffY && absDiffX > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (this.quizActive) return;

        // Handle vertical drag on slide 0
        if (this.currentSlide === 0 && this.isDraggingVertical) {
            const screenHeight = window.innerHeight;
            const dragPercentage = this.currentDragY / screenHeight;

            if (dragPercentage >= this.dragThreshold) {
                // Complete transition to next slide
                this.completeVerticalTransition();
            } else {
                // Snap back to original position
                this.cancelVerticalDrag();
            }

            this.isDraggingVertical = false;
            this.currentDragY = 0;
            return;
        }

        // Handle horizontal swipes
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - this.touchStartX;
        const diffY = touchEndY - this.touchStartY;

        // Check if swipe is more horizontal than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // Swipe right - go to previous slide
                this.prevSlide('swipe');
            } else if (diffX < -50) {
                // Swipe left - go to next slide
                this.nextSlide('swipe');
            }
        }
    }

    nextSlide(method = 'swipe') {
        if (this.isTransitioning || this.quizActive) return;

        // Disable tap navigation on first slide (must swipe up or click button)
        if (method === 'tap' && this.currentSlide === 0) return;

        // Haptic feedback for tap interactions
        if (method === 'tap') {
            window.hapticManager.light();
        }

        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1, method);
        }
    }

    prevSlide(method = 'swipe') {
        if (this.isTransitioning || this.quizActive) return;

        // Disable tap navigation on first slide
        if (method === 'tap' && this.currentSlide === 0) return;

        // Haptic feedback for tap interactions
        if (method === 'tap') {
            window.hapticManager.light();
        }

        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1, method);
        }
    }

    goToSlide(index, method = 'swipe') {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;
        const direction = index > this.currentSlide ? 'next' : 'prev';
        const isTap = method === 'tap';
        const transitionDuration = isTap ? 300 : 600;

        // Play swipe sound
        window.soundManager.play('swipe');

        // Haptic feedback
        window.hapticManager.light();

        // Hide current slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);

        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');

            // Add snap class if it's a tap interaction
            if (isTap) currentSlideEl.classList.add('snap');
            else currentSlideEl.classList.remove('snap');

            if (direction === 'next') {
                currentSlideEl.classList.add('prev');
            }
        }

        // Show new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${index}"]`);
        if (newSlideEl) {
            newSlideEl.classList.remove('prev');

            // Add snap class if it's a tap interaction
            if (isTap) newSlideEl.classList.add('snap');
            else newSlideEl.classList.remove('snap');

            newSlideEl.classList.add('active');
        }

        this.currentSlide = index;
        this.updateProgressBars();

        // Animate slide content
        setTimeout(() => {
            window.animationManager.animateSlide(index);
            this.checkAndShowQuiz();
            this.startSlideTimer(); // Start auto-advance timer

            // Track Rewind Viewed (Reached Last Slide)
            if (index === this.totalSlides - 1 && window.posthog) {
                posthog.capture('viewed_rewind_overall_2025');
            }
        }, isTap ? 50 : 100);

        setTimeout(() => {
            this.isTransitioning = false;
            // Clean up snap classes
            const allSlides = document.querySelectorAll('.slide');
            allSlides.forEach(slide => slide.classList.remove('snap'));
        }, transitionDuration);
    }

    startSlideTimer() {
        // Clear any existing timer
        if (this.slideTimer) clearTimeout(this.slideTimer);

        // Don't auto-advance on first and last slide
        if (this.currentSlide === 0 || this.currentSlide === this.totalSlides - 1) return;

        // Don't auto-advance if quiz is active (will be handled by checkAndShowQuiz)
        if (this.quizActive) return;

        // Set timer for 5 seconds
        this.slideTimer = setTimeout(() => {
            this.nextSlide('auto');
        }, 5000);
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
        const container = document.getElementById('progress-bars');
        if (container) {
            if (this.currentSlide === 0 || this.currentSlide === this.totalSlides - 1) {
                container.style.opacity = '0';
                container.style.pointerEvents = 'none'; // Prevent interaction when hidden
            } else {
                container.style.opacity = '1';
                container.style.pointerEvents = 'auto';
            }
        }

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

                // Resume progress bar and timer
                const activeBar = document.querySelector(`.progress-bar[data-slide="${this.currentSlide}"]`);
                if (activeBar) activeBar.classList.remove('paused');

                // Give user time to see results before advancing - 5 seconds
                this.slideTimer = setTimeout(() => {
                    this.nextSlide('auto');
                }, 5000);
            });

            this.quizActive = true;

            // Pause progress bar
            const activeBar = document.querySelector(`.progress-bar[data-slide="${this.currentSlide}"]`);
            if (activeBar) activeBar.classList.add('paused');

            if (this.slideTimer) clearTimeout(this.slideTimer);

        } else {
            // No quiz or already completed - reveal content immediately
            window.animationManager.revealSlideContent(this.currentSlide);
            this.startSlideTimer();
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

    handleVerticalDrag(dragDistance) {
        const screenHeight = window.innerHeight;
        const dragPercentage = Math.min(dragDistance / screenHeight, 1);

        const slide0 = document.querySelector('.slide[data-slide="0"]');
        const slide1 = document.querySelector('.slide[data-slide="1"]');

        if (!slide0 || !slide1) return;

        // Add dragging class to disable transitions
        slide0.classList.add('dragging');

        // Move slide 0 up based on drag
        const translateY = -dragDistance;
        slide0.style.transform = `translateY(${translateY}px)`;

        // Show slide 1 behind slide 0
        slide1.classList.add('revealing');
    }

    completeVerticalTransition() {
        const slide0 = document.querySelector('.slide[data-slide="0"]');
        const slide1 = document.querySelector('.slide[data-slide="1"]');

        if (!slide0 || !slide1) return;

        // Remove dragging class to enable smooth transition
        slide0.classList.remove('dragging');

        // Animate slide 0 completely off screen
        slide0.style.transform = 'translateY(-100%)';

        // Wait for animation, then switch to slide 1
        setTimeout(() => {
            slide0.classList.remove('active');
            slide0.classList.remove('dragging');
            slide0.style.transform = '';

            // Promote slide 1 from revealing to active
            slide1.classList.remove('revealing');
            slide1.classList.add('active');

            this.currentSlide = 1;
            this.updateProgressBars();

            // Animate slide content
            window.animationManager.animateSlide(1);
            this.checkAndShowQuiz();

            window.soundManager.play('techno');
            window.hapticManager.light();
        }, 800);
    }

    cancelVerticalDrag() {
        const slide0 = document.querySelector('.slide[data-slide="0"]');
        const slide1 = document.querySelector('.slide[data-slide="1"]');

        if (!slide0 || !slide1) return;

        // Remove dragging class to enable smooth transition back
        slide0.classList.remove('dragging');

        // Animate back to original position
        slide0.style.transform = 'translateY(0)';

        // Wait for animation, then clean up
        setTimeout(() => {
            slide1.classList.remove('revealing');
            slide0.style.transform = '';
        }, 300);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WrappedApp();
});
