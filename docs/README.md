# Speed-Reader: Requirements & Design Guidelines

## 1. Product Overview
Speed-Reader is a cross-platform reading tool that presents text one word at a time (RSVP) and offers alternative reading modes to balance speed, comprehension, and comfort. It is delivered as:
- A reusable, configurable Web Component (core player)
- Chrome/Edge browser extensions (inject player into any page)
- A PWA SPA (offline reader, copy-paste or URL input)
- Mobile Web support

## 2. Core User Experience
- **Controls:**
  - Play/Pause: Spacebar or button
  - Speed Up/Down: Arrow Up/Down (200–350 wpm, default 300)
  - Rewind: Arrow Left (rewind 5 words)
  - Fullscreen: F or button
  - Settings/Mode: Gear icon
- **Display:**
  - Words are centered in a focal point sized by the longest word in the session
  - Punctuation markers appear before/after the word, stacking to show nesting

## 3. Functional Requirements
1. **Configurable Control** ([feature](features/configurable_control.feature))
   - Adjustable WPM range (200–350, default 300). Comprehension drops above 300 wpm ([Di Nocera et al.](https://www.sciencedirect.com/science/article/pii/S0747563214007663), [Ricciardi et al.](https://www.researchgate.net/profile/Orlando-Ricciardi/publication/328925418_Rapid_serial_visual_presentation_Degradation_of_inferential_reading_comprehension_as_a_function_of_speed/links/5e5f7ec04585152ce8053ccd/Rapid-serial-visual-presentation-Degradation-of-inferential-reading-comprehension-as-a-function-of-speed.pdf)).
   - Dynamic speed control: Auto-adjust pacing based on comprehension quiz results.
2. **Gradient-Guided Text** ([feature](features/gradient_guided_text.feature))
   - BeeLine-style color gradients for continuous text to guide eye movement ([WestEd BeeLine Study](https://www.rif.org/sites/default/files/documents/2019/10/24/Support_Materials/BeeLineWestEdStudyFinal.pdf)).
3. **LLM Summary** ([feature](features/llm_summary.feature))
   - LLM summary option using user-supplied endpoint/key.
4. **Comprehension & Fatigue Monitoring** ([feature](features/comprehension_fatigue.feature))
   - Visual fatigue alerts: Detect blink suppression and prompt breaks ([Di Nocera et al.](https://www.sciencedirect.com/science/article/pii/S0747563214007663)).
5. **User Control & Navigation**
   - Instant pause/rewind/slowdown via buttons or gestures ([Aldinhe Study](https://journal.aldinhe.ac.uk/index.php/jldhe/article/view/970)).
6. **Eye-Tracking Integration** ([feature](features/eye_tracking_integration.feature))
   - Gaze-based pausing and regression support if hardware is available ([Rayner & Pollatsek](https://www.mdpi.com/2226-471X/9/12/360)).

## 4. Non-Functional Requirements
- **Performance:** <50 ms latency per word at 350 wpm
- **Cross-Platform:** Responsive web, browser extensions, offline PWA, future native apps
- **Offline Support:** PWA must work offline (service worker, IndexedDB)
- **Accessibility:** WCAG 2.1 AA, adjustable font/contrast, ARIA labels
- **Code Quality:** TypeScript, ESLint, Prettier, 90% unit test coverage

## 5. Architecture & Technology
- **Frontend:** TypeScript, Lit (Web Components), Tailwind CSS
- **Bundling:** Vite + SWC
- **Testing:** Jest + Testing Library
- **Offline:** Workbox Service Worker
- **NLP/OCR:** Tesseract.js
- **State:** Redux-style store (Proxy + events)

## 6. Milestone 0 (MVP)
- Lit-based RSVP player (play/pause, speed control)
- Chrome extension to inject player on any selection
- PWA shell with text input and offline caching
- Unit tests ≥80% coverage

## 7. References
- Di Nocera et al., 2014 – RSVP & comprehension limits
- WestEd BeeLine Study, 2019 – Gradient guidance
- Rayner & Pollatsek, 2015 – Eye movements & reading

---
This document defines the requirements and design guidelines for building Speed-Reader. All features and architecture decisions should be traceable to these principles and referenced studies.
