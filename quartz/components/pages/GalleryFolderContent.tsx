import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { PageList, SortFn } from "../PageList"
import style from "../styles/listPage.scss"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { ComponentChildren } from "preact"
import { pathToRoot } from "../../util/path"
import { trieFromAllFiles } from "../../util/ctx"
import { QuartzPluginData } from "../../plugins/vfile"
import { i18n } from "../../i18n"
import { concatenateResources } from "../../util/resources"

// Folder slugs that get the gallery treatment
const GALLERY_PREFIXES = ["Characters", "Locations", "Organizations", "World-Encyclopedia", "Chronicles"]

// Tags that should never appear in the gallery
const EXCLUDED_TAGS = new Set(["gm-only", "incomplete"])

// Resolve image to absolute URL path
// If image contains a slash it's already a full path, otherwise construct from folder
function resolveImagePath(slug: string, image: string): string {
  // Full path already provided — just prepend slash
  if (image.includes("/")) {
    return `/${image}`
  }

  // Construct path from folder structure
  const parts = slug.split("/")
  if (parts[0] === "Characters" && parts.length >= 2) {
    // Player characters have artwork at Artwork/_Player Characters/ not Artwork/Characters/_Player Characters/
    if (parts[1] === "_Player-Characters" || parts[1] === "_Player Characters") {
      return `/Artwork/_Player-Characters/${image}`
    }
    const subfolderMap: Record<string, string> = {
      "Major Allies": "Major_Allies",
      "Major-Allies": "Major_Allies",
      "Navarresean See": "Navarre",
      "Navarresean-See": "Navarre",
      "_Player Characters": "_Player Characters",
      "_Player-Characters": "_Player Characters",
      "Crimson Cleavers": "Crimson_Cleavers",
      "Crimson-Cleavers": "Crimson_Cleavers",
      "Southern Kula": "Southern_Kula",
      "Southern-Kula": "Southern_Kula",
    }
    const artParts = parts.slice(1, -1).map((p) => subfolderMap[p] ?? p)
    return `/Artwork/Characters/${artParts.join("/")}/${image}`
  }
  if (parts[0] === "Locations") {
    return `/Artwork/Locations/${image}`
  }
  return `/Artwork/${image}`
}

export default ((opts?: { sort?: SortFn }) => {
  const GalleryFolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = (fileData.slug ?? "").replace(/\/index$/, "").replace(/\/$/, "")
    const baseDir = pathToRoot(fileData.slug!)
    const useGallery = GALLERY_PREFIXES.some((prefix) => slug.startsWith(prefix))

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(slug.split("/"))
    if (!folder) return null

    // Collect pages
    const allPagesInFolder: QuartzPluginData[] = folder.children
      .map((node) => {
        if (node.data) return node.data
        if (node.isFolder) {
          const getMostRecentDates = (): QuartzPluginData["dates"] => {
            let maybeDates: QuartzPluginData["dates"] | undefined = undefined
            for (const child of node.children) {
              if (child.data?.dates) {
                if (!maybeDates) {
                  maybeDates = { ...child.data.dates }
                } else {
                  if (child.data.dates.created > maybeDates.created) maybeDates.created = child.data.dates.created
                  if (child.data.dates.modified > maybeDates.modified) maybeDates.modified = child.data.dates.modified
                  if (child.data.dates.published > maybeDates.published) maybeDates.published = child.data.dates.published
                }
              }
            }
            return maybeDates ?? { created: new Date(), modified: new Date(), published: new Date() }
          }
          return {
            slug: node.slug,
            dates: getMostRecentDates(),
            frontmatter: { title: node.displayName, tags: [] },
          }
        }
      })
      .filter((p): p is QuartzPluginData => p !== undefined)

    // Filter out hidden entries
    const visiblePages = allPagesInFolder.filter((page) => {
      if (page.frontmatter?.draft === true) return false
      const tags: string[] = (page.frontmatter?.tags as string[]) ?? []
      if (tags.some((t) => EXCLUDED_TAGS.has(t))) return false
      return true
    })

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    // ── Gallery view ───────────────────────────────────────────────
    if (useGallery) {
      const sorted = [...visiblePages].sort((a, b) => {
        const tA = (a.frontmatter?.title as string) ?? ""
        const tB = (b.frontmatter?.title as string) ?? ""
        return tA.localeCompare(tB)
      })

      return (
        <div class="popover-hint">
          <style>{`.popover-hint .article-title { display: none; } .popover-hint > article { display: none; }`}</style>
          <article>{content}</article>
          <div class="gallery-folder">
            <p class="gallery-count">
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: sorted.length,
              })}
            </p>
            <div class={`gallery-grid${slug.includes("Divinities") ? " gallery-grid-deities" : ""}`}>
              {sorted.map((page) => {
                const pageSlug = page.slug ?? ""
                const title = (page.frontmatter?.title as string) ?? pageSlug.split("/").pop() ?? "Untitled"
                const image = page.frontmatter?.image as string | undefined
                const isFolder = folder.children.find(n => n.slug === pageSlug)?.isFolder ?? false
                const href = `/${pageSlug}`
                const imgSrc = image ? resolveImagePath(pageSlug, image) : null

                return (
                  <a href={href} class={`gallery-card${isFolder ? " gallery-card-folder" : ""}`}>
                    <div class="gallery-card-inner">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={title}
                          class="gallery-portrait"
                          loading="lazy"
                        />
                      ) : (
                        <div class="gallery-placeholder">
                          <div class="gallery-placeholder-logo" />
                        </div>
                      )}
                    </div>
                    <div class="gallery-card-name">{title}</div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // ── Default list view (for all other folders) ──────────────────
    const listProps = {
      ...props,
      sort: opts?.sort,
      allFiles: visiblePages,
    }

    return (
      <div class="popover-hint">
        <article>{content}</article>
        <div class="page-listing">
          <p>
            {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
              count: visiblePages.length,
            })}
          </p>
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  GalleryFolderContent.css = concatenateResources(style, PageList.css, `
.gallery-folder {
  margin-top: 1.5rem;
}

.gallery-count {
  font-size: 0.85rem;
  color: var(--gray);
  margin-bottom: 1.25rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  text-decoration: none !important;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  overflow: hidden;
  background: var(--light);
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.gallery-card:hover {
  border-color: var(--secondary);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--darkgray) 15%, transparent);
}

.gallery-card-inner {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--lightgray);
  position: relative;
}

.gallery-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  margin: 0 !important;
  border-radius: 0 !important;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-portrait {
  transform: scale(1.04);
}

.gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--secondary) 10%, var(--light));
}

.gallery-placeholder-logo {
  width: 50%;
  height: 50%;
  background-image: url("/static/CB_Symbol_Glow.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* Match the muted blue secondary color used in dark mode */
  filter: invert(1) sepia(1) saturate(0.4) hue-rotate(170deg) brightness(0.55);
  opacity: 0.5;
}

:root[saved-theme="light"] .gallery-placeholder-logo {
  filter: invert(0) sepia(1) saturate(0.4) hue-rotate(170deg) brightness(0.55);
}

.gallery-grid-deities .gallery-card-inner {
  background: color-mix(in srgb, var(--secondary) 10%, var(--light));
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-grid-deities .gallery-portrait {
  object-fit: contain;
  object-position: center;
  width: 55%;
  height: 55%;
  margin: auto;
  mix-blend-mode: multiply;
  filter: sepia(1) saturate(0.5) hue-rotate(170deg) brightness(0.7);
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.gallery-grid-deities .gallery-card:hover .gallery-portrait {
  opacity: 1;
}

.gallery-card-folder .gallery-card-inner {
  aspect-ratio: 1 / 1;
}

.gallery-card-name {
  padding: 0.5rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.3;
  text-align: center;
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
  }
}
`)

  return GalleryFolderContent
}) satisfies QuartzComponentConstructor
