import { QuartzTransformerPlugin } from "../types"

/**
 * StripDMContent
 * ==============
 * Quartz transformer plugin that strips DM-only content from pages
 * before they are published to the public site.
 *
 * Removes:
 *   1. The entire ## Secrets section including the heading itself
 *   2. Any [!dm] callout blocks
 *
 * Your vault files are never modified — this only affects the built site.
 */
export const StripDMContent: QuartzTransformerPlugin = () => {
  return {
    name: "StripDMContent",
    textTransform(_ctx, src) {
      let text = typeof src === "string" ? src : src.toString()

      // 1. Remove ## Secrets heading + all content until next ## heading
      text = text.replace(
        /^##\s+Secrets\s*\n[\s\S]*?(?=^##\s)/gim,
        ""
      )

      // 2. Remove ## Secrets heading + all content when it's the last section
      //    (handles empty sections and sections at end of file)
      text = text.replace(
        /^##\s+Secrets[\s\S]*$/gim,
        ""
      )

      // 3. Remove [!dm] callout blocks including all continuation lines
      text = text.replace(
        /^>\s*\[!dm\][^\n]*\n(?:>[^\n]*\n?)*/gim,
        ""
      )

      // 4. Clean up excessive blank lines left behind
      text = text.replace(/\n{3,}/g, "\n\n")

      return text
    },
  }
}
