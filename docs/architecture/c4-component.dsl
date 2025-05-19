workspace {
    model {
        user = person "User"
        webApp = softwareSystem "Speed-Reader Web App"
        browserExt = container webApp "Browser Extension"
        pwa = container webApp "PWA Shell"
        webComponent = container webApp "Web Component"
        stateStore = container webApp "State Store"
        serviceWorker = container webApp "Service Worker"
        llmApi = container webApp "LLM API Client"
        tesseract = container webApp "Tesseract.js"

        # Components inside Web Component
        player = component webComponent "RSVP Player" "Displays words, handles controls."
        settings = component webComponent "Settings Panel" "User config, WPM, color, etc."
        comprehension = component webComponent "Comprehension Monitor" "Tracks fatigue, quizzes."
        gradient = component webComponent "Gradient Renderer" "BeeLine-style color guidance."
        summary = component webComponent "Summary Panel" "LLM summary display."
        eyeTracking = component webComponent "Eye-Tracking Integration" "Reads gaze data."

        player -> settings "Reads config"
        player -> gradient "Uses for display"
        player -> comprehension "Pauses/alerts user"
        player -> summary "Shows summary"
        player -> eyeTracking "Pauses/rewinds on gaze"
        player -> stateStore "Reads/writes state"
        player -> llmApi "Requests summary"
        player -> tesseract "OCR for images"
    }
    views {
        component webComponent {
            include *
            autolayout lr
            title "Speed-Reader Web Component - Component Diagram"
            description "Shows main components inside the RSVP Web Component."
        }
    }
}
