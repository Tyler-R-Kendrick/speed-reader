workspace {
    model {
        user = person "User"
        webApp = softwareSystem "Speed-Reader Web App"
        browserExt = container webApp "Browser Extension" "Injects RSVP player into web pages."
        pwa = container webApp "PWA Shell" "Offline reader, text input, caching."
        webComponent = container webApp "Web Component" "Reusable RSVP player."
        stateStore = container webApp "State Store" "Redux-style state management."
        serviceWorker = container webApp "Service Worker" "Offline support, caching."
        llmApi = container webApp "LLM API Client" "Handles LLM summary requests."
        tesseract = container webApp "Tesseract.js" "OCR for extracting text."
        user -> browserExt "Uses in browser"
        user -> pwa "Uses as app"
        browserExt -> webComponent "Injects and controls"
        pwa -> webComponent "Embeds and controls"
        webComponent -> stateStore "Reads/writes state"
        webComponent -> llmApi "Requests summary"
        webComponent -> tesseract "OCR for images"
        pwa -> serviceWorker "Uses for offline support"
    }
    views {
        container webApp {
            include *
            autolayout lr
            title "Speed-Reader Container Diagram"
            description "Shows main containers/components of the Speed-Reader system."
        }
    }
}
