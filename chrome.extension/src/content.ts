(() => {
  // Check if the overlay already exists
  if (document.getElementById('speed-reader-overlay')) {
    return;
  }

  // Create the overlay div
  const overlay = document.createElement('div');
  overlay.id = 'speed-reader-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Blur effect
  overlay.style.backdropFilter = 'blur(5px)';
  overlay.style.zIndex = '2147483647'; // Max z-index
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create the rsvp-player container
  const playerContainer = document.createElement('div');
  playerContainer.style.width = '80%';
  playerContainer.style.height = '80%';
  playerContainer.style.backgroundColor = '#fff'; // Or your player's background
  playerContainer.style.borderRadius = '10px';
  playerContainer.style.overflow = 'auto'; // In case content is too long

  // Create the rsvp-player element
  const rsvpPlayer = document.createElement('rsvp-player');

  // Extract text from the body
  let pageText = document.body.innerText || '';
  // Attempt to remove script and style content more robustly
  const scripts = document.body.querySelectorAll('script, style, noscript, iframe, header, footer, nav, aside');
  scripts.forEach(s => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = s.innerHTML;
    pageText = pageText.replace(tempDiv.innerText, '');
  });
  pageText = pageText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); // Clean up HTML tags and extra spaces


  rsvpPlayer.setAttribute('text', pageText);
  rsvpPlayer.setAttribute('wpm', '300'); // Default WPM

  // Append rsvp-player to its container, then container to overlay
  playerContainer.appendChild(rsvpPlayer);
  overlay.appendChild(playerContainer);

  // Append overlay to the body
  document.body.appendChild(overlay);

  // Inject the rsvp-player web component script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('rsvp_assets/rsvp-player.js');
  script.type = 'module';
  document.head.appendChild(script);

  // Close overlay when clicking on the blurred background
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      // Clean up the injected script tag to prevent multiple injections if re-opened
      document.head.removeChild(script);
    }
  });

  // Prevent clicks inside the player container from closing the overlay
  playerContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

})();
