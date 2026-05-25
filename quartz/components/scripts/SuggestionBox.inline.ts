function initSuggestionBox() {
  const btn = document.getElementById("suggestion-box-btn")
  const modal = document.getElementById("suggestion-modal")
  const overlay = document.getElementById("suggestion-modal-overlay")
  const closeBtn = document.getElementById("suggestion-modal-close")
  const form = document.getElementById("suggestion-form") as HTMLFormElement | null
  const pageUrlInput = document.getElementById("suggestion-page-url") as HTMLInputElement | null
  const submitBtn = document.getElementById("suggestion-submit") as HTMLButtonElement | null
  const successDiv = document.getElementById("suggestion-success")
  const closeSuccessBtn = document.getElementById("suggestion-close-success")

  if (!btn || !modal || !form) return

  // Auto-fill current page URL
  if (pageUrlInput) {
    pageUrlInput.value = window.location.href
  }

  function openModal() {
    modal!.classList.add("open")
    modal!.setAttribute("aria-hidden", "false")
    if (pageUrlInput) pageUrlInput.value = window.location.href
    // Reset form state
    form!.style.display = "block"
    if (successDiv) successDiv.classList.remove("visible")
  }

  function closeModal() {
    modal!.classList.remove("open")
    modal!.setAttribute("aria-hidden", "true")
    form!.reset()
    form!.style.display = "block"
    if (successDiv) successDiv.classList.remove("visible")
  }

  btn.addEventListener("click", openModal)
  overlay!.addEventListener("click", closeModal)
  closeBtn!.addEventListener("click", closeModal)
  closeSuccessBtn?.addEventListener("click", closeModal)

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal!.classList.contains("open")) closeModal()
  })

  // Handle form submission via fetch
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    if (!submitBtn) return

    submitBtn.disabled = true
    submitBtn.textContent = "Sending..."

    try {
      const data = new FormData(form)
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (response.ok) {
        form.style.display = "none"
        if (successDiv) successDiv.classList.add("visible")
      } else {
        submitBtn.textContent = "Error — try again"
        submitBtn.disabled = false
      }
    } catch {
      submitBtn.textContent = "Error — try again"
      submitBtn.disabled = false
    }
  })
}

document.addEventListener("nav", initSuggestionBox)
