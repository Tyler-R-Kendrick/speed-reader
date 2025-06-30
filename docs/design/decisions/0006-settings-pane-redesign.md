# Decision: Settings Pane Redesign

We evaluated new layouts for the settings pane following the Adobe Spectrum design guidelines. Three options were considered:

1. **Tabbed sections** – a dedicated tab for each category (Input, Reading, Shortcuts, Gestures).
   - *Pros:* clear separation of concerns, small scrolling regions.
   - *Cons:* extra taps to navigate between tabs, harder to discover options on mobile.

2. **Accordion groups** – a single scrolling surface with collapsible groups.
   - *Pros:* progressive disclosure keeps the screen short, easy to scan.
   - *Cons:* requires Javascript to manage open state but works well with keyboard and screen readers.

3. **Long scroll form** – all controls in one column.
   - *Pros:* very simple implementation.
   - *Cons:* overwhelming on small screens, harder to find specific options.

Option 2 provides the best balance of discoverability and minimal cognitive load. It keeps related settings together while allowing users to collapse groups they rarely change. The accordion layout is therefore chosen for implementation and implemented with Spectrum `<sp-accordion>` components to align with the design system.

To ensure consistent theming across Spectrum components, the pane is wrapped in `<sp-theme>` and uses `<sp-dialog>` styles. This fixes the plain appearance noted in earlier prototypes and positions icons correctly.
