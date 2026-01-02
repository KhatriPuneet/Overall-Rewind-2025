# Wrapped UI - 2023 Rewind

An interactive, mobile-first "Wrapped" style year-in-review experience with animations, haptics, sound effects, and quiz interactions.

## Features

✨ **12 Interactive Slides** - Complete year-in-review journey  
🎨 **Premium Animations** - GSAP-powered smooth transitions  
📱 **Haptic Feedback** - Vibration on mobile devices  
🔊 **Sound Effects** - Audio feedback for interactions  
🎮 **Quiz Overlays** - Interactive questions before slide reveals  
💎 **Glassmorphism Design** - Modern, premium UI  
📊 **Animated Statistics** - Count-up numbers and charts  
👆 **Swipe Navigation** - Touch-friendly slide transitions  

## Quick Start

1. **Open the project:**
   ```bash
   cd wrapped-ui
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python3 -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Best experience:**
   - View on mobile device or mobile emulator
   - Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)
   - Set to iPhone or mobile viewport

## Project Structure

```
wrapped-ui/
├── index.html          # Main entry point with all 12 slides
├── css/
│   └── styles.css      # All styles, animations, responsive design
├── js/
│   ├── main.js         # Core app logic & slide controller
│   ├── animations.js   # GSAP animation definitions
│   ├── haptics.js      # Vibration API for haptic feedback
│   ├── sounds.js       # Web Audio API for sound effects
│   └── quiz.js         # Quiz overlay logic
└── assets/
    ├── sounds/         # (Optional) Custom sound files
    └── icons/          # (Optional) Custom icons
```

## Slides Overview

0. **Intro** - Swipe to begin animation
1. **Advisor Performance** - 100+ Cr earnings, 1,240 advisors
2. **Geographic Impact** - 12,450 pincodes served
3. **Product Highlights** - Credit cards top category
4. **Advisor Spotlight** - Consistent advisor profile
5. **User Activity** - Most active day/time charts
6. **Interesting Facts** - Referrals, night owl, streaks
7. **Payment Preferences** - 6X RuPay usage
8. **Partner Ecosystem** - 42 partners connected
9. **Search Insights** - 843 questions answered
10. **Feature Requests** - Dark mode top request
11. **Outro** - Wrap up & share

## Navigation

- **Swipe Left/Right** - Navigate between slides
- **Tap Left/Right Edges** - Navigate between slides
- **Arrow Keys** - Navigate on desktop
- **Swipe Up** (on intro) - Start the experience

## Interactive Features

### Quiz Overlays
- Appear before revealing certain slides
- Multiple choice questions
- Blur effect on unrevealed content
- Correct/incorrect feedback with animations
- Auto-dismiss after answer

### Haptic Feedback
- Light tap on navigation
- Medium tap on quiz selection
- Success pattern on correct answer
- Error pattern on wrong answer

### Sound Effects
- Swipe navigation sound
- Quiz correct/incorrect sounds
- Slide reveal whoosh
- Toggle sound on/off (top-right button)

## Customization

### Change Slide Content
Edit `index.html` and modify the slide data:
```html
<div class="slide" data-slide="1" 
     data-has-quiz="true" 
     data-quiz-question="Your question?" 
     data-quiz-options='["Option 1", "Option 2", "Option 3"]' 
     data-quiz-answer="0">
    <!-- Slide content -->
</div>
```

### Modify Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary: #2b6cee;
    --bg-dark: #101622;
    --surface-dark: #1c2433;
    /* ... */
}
```

### Add Custom Animations
Add new animation functions in `js/animations.js`:
```javascript
animateCustomSlide(slide) {
    // Your GSAP animations
}
```

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ⚠️ Haptics only work on mobile devices
- ⚠️ Sound requires user interaction to start

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling, animations, glassmorphism
- **JavaScript (ES6+)** - Logic and interactivity
- **GSAP 3.12** - Animation library
- **Howler.js 2.2** - Audio library (optional)
- **Web Audio API** - Sound generation
- **Vibration API** - Haptic feedback
- **Google Fonts** - Inter font family
- **Material Symbols** - Icons

## Performance

- Optimized for mobile devices
- Smooth 60fps animations
- Minimal dependencies
- No build process required
- ~150KB total size (uncompressed)

## Tips

1. **Mobile Testing**: Use Chrome DevTools device emulator for best testing experience
2. **Sound**: Click the sound icon (top-right) to unmute
3. **Haptics**: Only work on actual mobile devices, not emulators
4. **Smooth Scrolling**: Some slides are scrollable - swipe vertically within the slide

## Troubleshooting

**Animations not working?**
- Check browser console for errors
- Ensure GSAP is loaded from CDN
- Try refreshing the page

**Haptics not working?**
- Haptics only work on mobile devices
- Check if browser supports Vibration API
- Some browsers require HTTPS for vibration

**Sound not playing?**
- Click the sound toggle to unmute
- Browsers require user interaction before playing audio
- Check browser's autoplay policy

## License

This project is created for demonstration purposes.

## Credits

- Design inspired by Spotify Wrapped and year-in-review experiences
- Icons from Google Material Symbols
- Animations powered by GSAP
