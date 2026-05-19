function addCollapseButton() {
  const explorerToggle = document.querySelector("button.desktop-explorer")
  if (!explorerToggle || document.querySelector("#collapse-all-btn")) return

  const btn = document.createElement("button")
  btn.id = "collapse-all-btn"
  btn.title = "Collapse all"
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline><line x1="12" y1="19" x2="12" y2="9"></line></svg>`
  btn.addEventListener("click", function (e) {
    e.stopPropagation()
    document.querySelectorAll(".folder-container.open .folder-button").forEach((b) => {
      (b as HTMLElement).click()
    })
  })

  explorerToggle.parentElement!.insertBefore(btn, explorerToggle.nextSibling)
}

document.addEventListener("nav", addCollapseButton)