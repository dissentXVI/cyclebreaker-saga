function addCollapseButton() {
  const explorerToggle = document.querySelector("button.desktop-explorer")
  if (!explorerToggle || document.querySelector("#collapse-all-btn")) return

  const btn = document.createElement("button")
  btn.id = "collapse-all-btn"
  btn.title = "Collapse all"
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 11 12 5 6 11"></polyline><polyline points="18 19 12 13 6 19"></polyline></svg>`
  btn.addEventListener("click", function (e) {
    e.stopPropagation()
    document.querySelectorAll(".folder-outer.open").forEach((outer) => {
      const folderBtn = outer.previousElementSibling && outer.previousElementSibling.querySelector(".folder-button")
      if (folderBtn) {
        (folderBtn as HTMLElement).click()
      }
    })
  })

  explorerToggle.appendChild(btn)
}

document.addEventListener("nav", addCollapseButton)
