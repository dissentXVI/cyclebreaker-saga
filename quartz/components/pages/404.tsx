import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>No record exists here. Either this chapter hasn't been written, or its secrets have yet to be uncovered by the Chosen.</p>
      <a href={baseDir}>Return to Aspiria</a>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
