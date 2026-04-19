import { QuartzTransformerPlugin } from "../types"

/**
 * StripDMContent
 * ==============
 * Quartz transformer plugin that strips DM-only content from pages
 * before they are published to the public site.
 *
 * Removes:
 *   1. The entire ## Secrets section (and all content until the next ## heading or end of file)
 *   2. Any [!dm] callout blocks
 *
 * Your vault files are never modified — this only affects the built site.
 */
export const StripDMContent: QuartzTransformerPlugin = () => {
  return {
    name: "StripDMContent",
    textTransform(_ctx, src) {
      // Work with string content
      let text = typeof src === "string" ? src : src.toString()

      // 1. Remove ## Secrets section and everything after it until the next ## heading or end of file
      text = text.replace(
        /^##\s+Secrets\s*\n[\s\S]*?(?=\n##\s|\Z)/gim,
        ""
      )

      // Also handle case where Secrets is the last section (no following ## heading)
      text = text.replace(
        /^##\s+Secrets\s*\n[\s\S]*$/gim,
        ""
      )

      // 2. Remove [!dm] callout blocks (lines starting with > that contain [!dm])
      // This handles the full callout block including all continuation lines
      text = text.replace(
        /^>\s*\[!dm\][^\n]*\n(?:>[^\n]*\n?)*/gim,
        ""
      )

      // 3. Clean up any excessive blank lines left behind
      text = text.replace(/\n{3,}/g, "\n\n")

      return text
    },
  }
}
