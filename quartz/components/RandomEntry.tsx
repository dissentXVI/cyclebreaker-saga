import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/randomEntry.inline.css"

// Pages to exclude from the random draw — folder indexes, meta pages, the homepage itself
const EXCLUDED_SLUGS = new Set([
  "index",
  "404",
  "tags",
])

// Folders whose contents should never appear in the random draw
const EXCLUDED_PREFIXES = [
  "_Meta",
  "Artwork",
  "Maps",
]

const RandomEntry: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
  // Filter to only pages worth surfacing to players
  const candidates = allFiles.filter((f) => {
    const slug = f.slug ?? ""

    // Skip excluded slugs
    if (EXCLUDED_SLUGS.has(slug)) return false

    // Skip draft pages
    if (f.frontmatter?.draft === true) return false

    // Skip gm-only tagged pages
    const tags: string[] = (f.frontmatter?.tags as string[]) ?? []
    if (tags.includes("gm-only")) return false

    // Skip excluded folder prefixes
    if (EXCLUDED_PREFIXES.some((prefix) => slug.startsWith(prefix))) return false

    return true
  })

  // Serialize the candidate list into the page as a JSON data island.
  // The afterDOMLoaded script reads this and picks randomly — no hardcoded list,
  // no fetch required, works on every page, and stays current automatically.
  const entryData = candidates.map((f) => ({
    slug: f.slug,
    title: f.frontmatter?.title ?? (f.slug ?? "").split("/").pop() ?? "Untitled",
  }))

  return (
    <div class={classNames(displayClass, "random-entry-wrapper")}>
      {/* Data island — the script below reads this */}
      <script
        id="random-entry-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entryData) }}
      />

      {/* Shell rendered on the server — JS fills it in after load */}
      <div id="random-entry-widget">
        <div class="archive-card">
          <div class="archive-header">
            <span class="archive-label">From the Archive</span>
          </div>
          <span class="archive-loading">Consulting the Watcher…</span>
        </div>
      </div>
    </div>
  )
}

RandomEntry.css = style

// This runs in the browser after the DOM is ready.
// Quartz collects all .afterDOMLoaded strings from components and
// bundles them into postscript.js — so this is the correct, safe way
// to run client-side JS in a Quartz component.
RandomEntry.afterDOMLoaded = `
(function () {
  const dataEl = document.getElementById("random-entry-data")
  const widget = document.getElementById("random-entry-widget")
  if (!dataEl || !widget) return

  let entries = []
  try {
    entries = JSON.parse(dataEl.textContent ?? "[]")
  } catch (e) {
    console.warn("[RandomEntry] Could not parse entry data", e)
    return
  }

  if (entries.length === 0) return

  function getBaseUrl() {
    // Respect Quartz's base path (works in both root and subdirectory deploys)
    const base = document.querySelector('meta[name="quartz:base-path"]')
    return base ? base.getAttribute("content") : ""
  }

  function roll() {
    const entry = entries[Math.floor(Math.random() * entries.length)]
    const base = getBaseUrl()
    const href = base ? base.replace(/\\/$/, "") + "/" + entry.slug : "/" + entry.slug

    widget.innerHTML =
      '<div class="archive-card">' +
        '<div class="archive-header">' +
          '<span class="archive-label">From the Archive</span>' +
          '<button class="archive-reroll" id="archive-reroll-btn" title="Draw another entry" aria-label="Draw another entry">&#x21BA;</button>' +
        '</div>' +
        '<a href="' + href + '" class="archive-title">' + entry.title + '</a>' +
      '</div>'

    document.getElementById("archive-reroll-btn")?.addEventListener("click", roll)
  }

  roll()
})()
`

export default (() => RandomEntry) satisfies QuartzComponentConstructor
