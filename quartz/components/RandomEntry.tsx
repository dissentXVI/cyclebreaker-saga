import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/randomEntry.inline.css"

const EXCLUDED_SLUGS = new Set(["index", "404", "tags"])
const EXCLUDED_PREFIXES = ["_Meta", "Artwork", "Maps"]

const RandomEntry: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
  const candidates = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    if (EXCLUDED_SLUGS.has(slug)) return false
    if (f.frontmatter?.draft === true) return false
    const tags: string[] = (f.frontmatter?.tags as string[]) ?? []
    if (tags.includes("gm-only")) return false
    if (EXCLUDED_PREFIXES.some((prefix) => slug.startsWith(prefix))) return false
    return true
  })

  const entryData = candidates.map((f) => ({
    slug: f.slug,
    title: f.frontmatter?.title ?? (f.slug ?? "").split("/").pop() ?? "Untitled",
  }))

  return (
    <div class={classNames(displayClass, "random-entry-wrapper")}>
      <script
        id="random-entry-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entryData) }}
      />
      <div id="random-entry-widget">
        <div class="archive-card">
          <div class="archive-header">
            <span class="archive-label">Random Article</span>
          </div>
          <span class="archive-loading">Consulting the Watcher…</span>
        </div>
      </div>
    </div>
  )
}

RandomEntry.css = style

RandomEntry.afterDOMLoaded = `
(function () {
  function initRandomEntry() {
    const dataEl = document.getElementById("random-entry-data")
    const widget = document.getElementById("random-entry-widget")
    if (!dataEl || !widget) return

    let entries = []
    try {
      entries = JSON.parse(dataEl.textContent ?? "[]")
    } catch (e) {
      return
    }

    if (entries.length === 0) return

    function roll() {
      const entry = entries[Math.floor(Math.random() * entries.length)]
      const href = "/" + entry.slug

      widget.innerHTML =
        '<div class="archive-card">' +
          '<div class="archive-header">' +
            '<span class="archive-label">Random Article</span>' +
            '<button class="archive-reroll" id="archive-reroll-btn" title="Draw another entry" aria-label="Draw another entry">&#x21BA;</button>' +
          '</div>' +
          '<a href="' + href + '" class="archive-title">' + entry.title + '</a>' +
        '</div>'

      const btn = document.getElementById("archive-reroll-btn")
      if (btn) btn.addEventListener("click", roll)
    }

    roll()
  }

  // Run on initial load
  initRandomEntry()

  // Re-run on Quartz SPA navigation
  document.addEventListener("nav", initRandomEntry)
})()
`

export default (() => RandomEntry) satisfies QuartzComponentConstructor
