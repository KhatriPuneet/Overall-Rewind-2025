// Animation Manager using GSAP
class AnimationManager {
    constructor() {
        this.gsap = window.gsap;
    }

    animateSlide(slideIndex) {
        const slide = document.querySelector(`.slide[data-slide="${slideIndex}"]`);
        if (!slide) return;

        // Animate slide icon
        const icon = slide.querySelector('.slide-icon');
        if (icon) {
            this.gsap.fromTo(icon,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }

        // Slide-specific animations
        switch (slideIndex) {
            case 0:
                this.animateIntro(slide);
                break;
            case 1:
                this.animateAdvisorPerformance(slide);
                break;
            case 2:
                this.animateGeographic(slide);
                break;
            case 3:
                this.animateProducts(slide);
                break;
            case 4:
                this.animateSpotlight(slide);
                break;
            case 5:
                this.animateActivity(slide);
                break;
            case 6:
                this.animateFacts(slide);
                break;
            case 7:
                this.animatePayment(slide);
                break;
            case 8:
                this.animateEcosystem(slide);
                break;
            case 9:
                this.animateSearch(slide);
                break;
            case 10:
                this.animateFeature(slide);
                break;
            case 11:
                this.animateOutro(slide);
                break;
        }
    }

    animateIntro(slide) {
        const title = slide.querySelector('.intro-title');
        const indicator = slide.querySelector('.swipe-indicator');

        this.gsap.fromTo(title,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        this.gsap.fromTo(indicator,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' }
        );
    }

    animateAdvisorPerformance(slide) {
        const header = slide.querySelector('.slide-header');
        const heroStat = slide.querySelector('.hero-stat');
        const statsGrid = slide.querySelector('.stats-grid');

        this.gsap.fromTo(header,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(heroStat,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.2)' }
        );

        this.gsap.fromTo(statsGrid,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
        );
    }

    animateGeographic(slide) {
        const megaNumber = slide.querySelector('.mega-number');
        const cards = slide.querySelectorAll('.info-card');

        this.gsap.fromTo(megaNumber,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
        );

        cards.forEach((card, index) => {
            this.gsap.fromTo(card,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, delay: 0.3 + (index * 0.1), ease: 'power3.out' }
            );
        });
    }

    animateProducts(slide) {
        const title = slide.querySelector('.slide-title-alt');
        const hero = slide.querySelector('.product-hero');
        const topProducts = slide.querySelector('.top-products');
        const speedStat = slide.querySelector('.speed-stat');

        this.gsap.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(hero,
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.2)' }
        );

        if (topProducts) {
            this.gsap.fromTo(topProducts,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
            );
        }

        if (speedStat) {
            this.gsap.fromTo(speedStat,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: 'power3.out' }
            );
        }
    }

    animateSpotlight(slide) {
        const title = slide.querySelector('.spotlight-title');
        const avatar = slide.querySelector('.avatar-container');
        const info = slide.querySelector('.profile-info');
        const desc = slide.querySelector('.profile-description');

        this.gsap.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(avatar,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.5)' }
        );

        this.gsap.fromTo(info,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        this.gsap.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.7, ease: 'power3.out' }
        );
    }

    animateActivity(slide) {
        // Slot machine animation for the day
        const slotMachine = slide.querySelector('.slot-machine-container');
        const slotReel = slide.querySelector('.slot-reel');
        const finalDay = slide.querySelector('.final-day');

        if (slotReel) {
            // Start with first item visible
            this.gsap.set(slotReel, { y: 0 });

            // Animate the slot machine spinning
            // Tuesday is at index 1, and we have 9 items total
            // We want to spin through multiple times and land on Tuesday (index 8 - the second Tuesday)
            const itemHeight = 90; // Height of each slot item
            const targetIndex = 8; // Second "Tuesday" in the list
            const spins = 2; // Number of full spins before landing
            const totalDistance = -(targetIndex * itemHeight + spins * 7 * itemHeight);

            this.gsap.to(slotReel, {
                y: totalDistance,
                duration: 3,
                ease: 'power4.out',
                onComplete: () => {
                    // Hide slot machine and show final day
                    if (slotMachine) slotMachine.style.display = 'none';
                    if (finalDay) {
                        finalDay.style.display = 'block';
                        this.gsap.fromTo(finalDay,
                            { scale: 0.8, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
                        );
                    }
                }
            });
        }

        const bars = slide.querySelectorAll('.bar');
        const curveBars = slide.querySelectorAll('.curve-bar');

        bars.forEach((bar, index) => {
            const height = bar.getAttribute('data-height') || '50';
            this.gsap.fromTo(bar,
                { height: '0%' },
                { height: height + '%', duration: 1, delay: 3.5 + index * 0.1, ease: 'power3.out' }
            );
        });

        curveBars.forEach((bar, index) => {
            this.gsap.fromTo(bar,
                { scaleY: 0 },
                { scaleY: 1, duration: 1, delay: 4 + (index * 0.05), ease: 'power3.out', transformOrigin: 'bottom' }
            );
        });

        // Animate tooltip
        const tooltip = slide.querySelector('.bar-tooltip');
        if (tooltip) {
            this.gsap.fromTo(tooltip,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 5, ease: 'power3.out' }
            );
        }
    }

    animateFacts(slide) {
        const sections = slide.querySelectorAll('.fact-section, .fact-section-small');

        sections.forEach((section, index) => {
            this.gsap.fromTo(section,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: index * 0.2, ease: 'power3.out' }
            );
        });
    }

    animatePayment(slide) {
        const multiplier = slide.querySelector('.payment-multiplier');
        const card = slide.querySelector('.payment-card');
        const text = slide.querySelector('.payment-text');

        this.gsap.fromTo(multiplier,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
        );

        this.gsap.fromTo(card,
            { y: 50, opacity: 0, rotateY: -15 },
            { y: 0, opacity: 1, rotateY: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
        );

        this.gsap.fromTo(text,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: 'power3.out' }
        );
    }

    animateEcosystem(slide) {
        const title = slide.querySelector('.ecosystem-title');
        const highlight = slide.querySelector('.partner-highlight');
        const tiles = slide.querySelectorAll('.partner-tile');

        this.gsap.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(highlight,
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.2)' }
        );

        tiles.forEach((tile, index) => {
            this.gsap.fromTo(tile,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, delay: 0.4 + (index * 0.05), ease: 'back.out(1.5)' }
            );
        });
    }

    animateSearch(slide) {
        const label = slide.querySelector('.search-label');
        const number = slide.querySelector('.search-number');
        const title = slide.querySelector('.search-title');
        const desc = slide.querySelector('.search-desc');

        this.gsap.fromTo(label,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(number,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.5)' }
        );

        this.gsap.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        this.gsap.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.7, ease: 'power3.out' }
        );
    }

    animateFeature(slide) {
        const title = slide.querySelector('.feature-title');
        const card = slide.querySelector('.feature-card');
        const desc = slide.querySelector('.feature-desc');

        this.gsap.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );

        this.gsap.fromTo(card,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.2)' }
        );

        this.gsap.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );
    }

    animateOutro(slide) {
        const visual = slide.querySelector('.outro-visual');
        const title = slide.querySelector('.outro-title');
        const desc = slide.querySelector('.outro-desc');
        const actions = slide.querySelector('.outro-actions');

        this.gsap.fromTo(visual,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.3)' }
        );

        this.gsap.fromTo(title,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
        );

        this.gsap.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        this.gsap.fromTo(actions,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.7, ease: 'power3.out' }
        );
    }

    revealSlideContent(slideIndex) {
        const slide = document.querySelector(`.slide[data-slide="${slideIndex}"]`);
        if (!slide) return;

        // Animate all number counters
        const counters = slide.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2;

            this.gsap.to(counter, {
                innerText: target,
                duration: duration,
                ease: 'power2.out',
                snap: { innerText: 1 },
                onUpdate: function () {
                    counter.innerText = Math.ceil(counter.innerText);
                }
            });
        });

        // Play reveal sound
        window.soundManager.play('reveal');
    }
}

// Initialize animation manager
window.animationManager = new AnimationManager();
