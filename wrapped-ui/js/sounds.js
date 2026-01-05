// Sound Manager using Howler.js
class SoundManager {
    constructor() {
        this.muted = true; // Start muted
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        // Using data URIs for simple beep sounds since we don't have actual audio files
        // In production, replace these with actual audio files

        // Swipe sound - short click
        this.sounds.swipe = {
            play: () => {
                if (!this.muted) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 800;
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }
            }
        };

        // Correct answer sound - success chime
        this.sounds.correct = {
            play: () => {
                if (!this.muted) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 1000;
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }
            }
        };

        // Wrong answer sound - error buzz
        this.sounds.wrong = {
            play: () => {
                if (!this.muted) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 200;
                    oscillator.type = 'sawtooth';

                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                }
            }
        };

        // Reveal sound - whoosh
        this.sounds.reveal = {
            play: () => {
                if (!this.muted) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }
            }
        };

        // Techno start sound - futuristic swell
        this.sounds.techno = {
            play: () => {
                if (!this.muted) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                    // Bass oscillator
                    const osc1 = audioContext.createOscillator();
                    const gain1 = audioContext.createGain();
                    osc1.connect(gain1);
                    gain1.connect(audioContext.destination);

                    osc1.type = 'sawtooth';
                    osc1.frequency.setValueAtTime(100, audioContext.currentTime);
                    osc1.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);

                    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                    // High pitch sweep
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);

                    osc2.type = 'square';
                    osc2.frequency.setValueAtTime(400, audioContext.currentTime);
                    osc2.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.1);
                    osc2.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.4);

                    gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

                    osc1.start(audioContext.currentTime);
                    osc1.stop(audioContext.currentTime + 0.5);
                    osc2.start(audioContext.currentTime);
                    osc2.stop(audioContext.currentTime + 0.5);
                }
            }
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    setMuted(muted) {
        this.muted = muted;
    }
}

// Initialize sound manager
window.soundManager = new SoundManager();
