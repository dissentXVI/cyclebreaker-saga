import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/SuggestionBox.inline"

const SuggestionBox: QuartzComponent = () => {
  return (
    <>
      <button id="suggestion-box-btn" aria-label="Open suggestion box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Suggestion Box</span>
      </button>

      <div id="suggestion-modal" role="dialog" aria-modal="true" aria-labelledby="suggestion-modal-title" aria-hidden="true">
        <div id="suggestion-modal-overlay"></div>
        <div id="suggestion-modal-content">
          <div id="suggestion-modal-header">
            <h3 id="suggestion-modal-title">Suggestion Box</h3>
            <button id="suggestion-modal-close" aria-label="Close">&times;</button>
          </div>
          <p id="suggestion-modal-desc">Found a typo, broken link, or unintended spoiler? Have a suggestion? Let us know.</p>

          <form id="suggestion-form" action="https://formspree.io/f/xqejddpo" method="POST">
            <input type="hidden" name="_subject" value="Cyclebreaker Saga Wiki Feedback" />
            <input type="hidden" id="suggestion-page-url" name="page_url" value="" />

            <div class="suggestion-field">
              <label for="suggestion-type">Type of Feedback</label>
              <select id="suggestion-type" name="type" required>
                <option value="" disabled selected>Select a type...</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Typo">Typo</option>
                <option value="Broken Link">Broken Link</option>
                <option value="Spoiler Report">Spoiler Report</option>
              </select>
            </div>

            <div class="suggestion-field">
              <label for="suggestion-message">Message</label>
              <textarea id="suggestion-message" name="message" rows={5} placeholder="Describe the issue or suggestion..." required></textarea>
            </div>

            <div id="suggestion-form-footer">
              <button type="submit" id="suggestion-submit">Send Feedback</button>
            </div>
          </form>

          <div id="suggestion-success" aria-live="polite">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <p>Thank you — your feedback has been sent to the GMs.</p>
            <button id="suggestion-close-success">Close</button>
          </div>
        </div>
      </div>
    </>
  )
}

SuggestionBox.afterDOMLoaded = script

SuggestionBox.css = `
#suggestion-box-btn {
  position: fixed !important;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  color: var(--secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 12px color-mix(in srgb, var(--darkgray) 20%, transparent);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
#suggestion-box-btn:hover {
  border-color: var(--secondary);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--secondary) 20%, transparent);
  transform: translateY(-2px);
}
#suggestion-box-btn svg {
  flex-shrink: 0;
}

/* ── Modal overlay ───────────────────────────────────────────────── */
#suggestion-modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 2000;
}
#suggestion-modal.open {
  display: block;
}
#suggestion-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}
#suggestion-modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 2rem));
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

/* ── Modal header ────────────────────────────────────────────────── */
#suggestion-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
#suggestion-modal-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--dark);
}
#suggestion-modal-close {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--gray);
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}
#suggestion-modal-close:hover {
  color: var(--dark);
}
#suggestion-modal-desc {
  font-size: 0.82rem;
  color: var(--gray);
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

/* ── Form fields ─────────────────────────────────────────────────── */
.suggestion-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}
.suggestion-field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dark);
}
.suggestion-field select,
.suggestion-field textarea {
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  color: var(--dark);
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}
.suggestion-field select:focus,
.suggestion-field textarea:focus {
  outline: none;
  border-color: var(--secondary);
}

/* ── Submit button ───────────────────────────────────────────────── */
#suggestion-form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
#suggestion-submit {
  background: var(--secondary);
  border: none;
  border-radius: 4px;
  color: var(--light);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem 1.25rem;
  transition: opacity 0.2s;
}
#suggestion-submit:hover {
  opacity: 0.85;
}
#suggestion-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Success state ───────────────────────────────────────────────── */
#suggestion-success {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  text-align: center;
}
#suggestion-success.visible {
  display: flex;
}
#suggestion-success svg {
  color: var(--secondary);
}
#suggestion-success p {
  color: var(--dark);
  font-size: 0.9rem;
  margin: 0;
}
#suggestion-close-success {
  background: none;
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  color: var(--secondary);
  cursor: pointer;
  font-size: 0.82rem;
  padding: 0.4rem 1rem;
  transition: border-color 0.2s;
}
#suggestion-close-success:hover {
  border-color: var(--secondary);
}
`

export default (() => SuggestionBox) satisfies QuartzComponentConstructor
