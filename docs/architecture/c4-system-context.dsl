workspace {
    model {
        user = person "User" "A person who wants to read text quickly and efficiently."
        webApp = softwareSystem "Speed-Reader Web App" "PWA, browser extension, and web component for RSVP reading."
        llmService = softwareSystem "LLM Service" "External LLM API for text summarization."
        eyeTracking = softwareSystem "Eye-Tracking Hardware" "Optional hardware for gaze-based controls."

        user -> webApp "Uses"
        webApp -> llmService "Requests summary via API (optional)"
        webApp -> eyeTracking "Reads gaze data (optional)"
    }
    views {
        systemContext webApp {
            include *
            autolayout lr
            title "Speed-Reader System Context"
            description "Shows the main systems and users interacting with Speed-Reader."
        }
    }
}
