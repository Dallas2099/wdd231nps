// Grab references to everything we need once.
const modal = document.getElementById('modal');
const openButton = document.getElementById('open-modal');
const closeButton = modal ? modal.querySelector('.close-button') : null;

/* Optional accessibility helpers:
// let lastFocusedElement;
// const focusableSelector =
//   'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
*/

/**
 * Opens the modal by revealing the overlay and updating ARIA state.
 */
function openModal() {
  if (!modal) return;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  /* Optional improvements:
  // lastFocusedElement = document.activeElement;
  // const firstFocusable = modal.querySelector(focusableSelector);
  // if (firstFocusable) firstFocusable.focus();
  // document.body.style.overflow = 'hidden';
  */
}

/**
 * Closes the modal, restores visibility, and resets the ARIA state.
 */
function closeModal() {
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');

  /* Optional improvements:
  // document.body.style.overflow = '';
  // if (lastFocusedElement) lastFocusedElement.focus();
  */
}

// Wire up the open and close buttons when they exist on the page.
if (openButton) {
  openButton.addEventListener('click', openModal);
}

if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}

// Close when the user presses Escape anywhere on the page.
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) {
    closeModal();
  }
});

// Close if the user clicks on the dimmed overlay instead of the panel.
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
