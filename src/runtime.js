import csstree from 'css-tree'
import { getProperty } from './propertyMap'


export default function runtime (classNameMap) {
  let code = `
import { JsvTextStyleClass } from "jsview-utils/JsViewReactTools/JsvStyleClass";
function createStyleClass(styleObj) {
  return new JsvTextStyleClass(styleObj).getName() 
}`
  Object.keys(classNameMap).forEach(item => {
    const node = classNameMap[item]
    const className = item.replace('.', '')
    const styleObj = node.block.children.toArray().reduce((result, styleItem) => {
      const property = getProperty(styleItem.property)
      result[property] = csstree.generate(styleItem.value)
      return result
    }, {})
    code += `
export const ${className} = createStyleClass(${JSON.stringify(styleObj)})
`
  })
  return code
}