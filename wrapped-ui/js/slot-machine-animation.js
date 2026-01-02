// Slot Machine Animation for Slide 5
// Add this to replace the animateActivity function in animations.js

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
