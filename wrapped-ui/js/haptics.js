// Haptic Feedback Manager
class HapticManager {
    constructor() {
        this.supported = 'vibrate' in navigator;
    }

    vibrate(pattern) {
        if (this.supported) {
            navigator.vibrate(pattern);
        }
    }

    light() {
        this.vibrate(10);
    }

    medium() {
        this.vibrate(20);
    }

    heavy() {
        this.vibrate(30);
    }

    success() {
        this.vibrate([10, 50, 10]);
    }

    error() {
        this.vibrate([20, 100, 20]);
    }
}

// Initialize haptic manager
window.hapticManager = new HapticManager();
