import path from "path";
import stylus from 'stylus';
import csstree from 'css-tree'
import runtime from './runtime'

const nodes = stylus.nodes
const originRGBAToString = nodes.RGBA.prototype.toString
nodes.RGBA.prototype.toString = function () {
  // https://github.com/stylus/stylus/issues/1825
  // six digit color
  const val = originRGBAToString.call(this)
  if (/^#[A-Za-z0-9]{3}/.test(val)) {
    return '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3]
  }
  return val
}

export default async function stylusLoader(source) {
  const styl = stylus(source)
  const callback = this.async();
  styl.render(async (error, css) => {
    if (error) {
      if (error.filename) {
        this.addDependency(path.normalize(error.filename));
      }
      callback(error);
    }
    const ast = csstree.parse(css);
    const classNameMap = {
    }
    const selectorTypeMap = {
      'IdSelector': '#',
      'TypeSelector': '',
      'ClassSelector': '.'
    }
    csstree.walk(ast, function(node) {
      if (node.type === 'Rule') {
        node.prelude.children.forEach(item => {
          if (item.type === 'Selector') {
            const fullName = item.children.reduce((result, selector) => {
              return result + `${selectorTypeMap[selector.type]}${selector.name}`
            }, '')
            classNameMap[fullName] = node
          }
        })
      }
    })
    callback(null, `${runtime(classNameMap)}`);
  });
}
