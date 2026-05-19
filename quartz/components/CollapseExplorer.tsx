import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/collapseExplorer.inline"

const CollapseExplorer: QuartzComponent = () => {
  return <></>
}

CollapseExplorer.afterDOMLoaded = script

export default (() => CollapseExplorer) satisfies QuartzComponentConstructor