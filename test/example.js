const result = `
import { JsvTextStyleClass } from "jsview-utils/JsViewReactTools/JsvStyleClass";
function createStyleClass(styleObj) {
  return new JsvTextStyleClass(styleObj).getName() 
}
export const block_item = createStyleClass({"fontSize":"30px","height":"100px","width":"100px","backgroundColor":"#000000"})
`

export default result