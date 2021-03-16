import path from "path";
import stylus from 'stylus';
import csstree from 'css-tree'
import runtime from './runtime'

export default async function stylusLoader(source) {
  const styl = stylus(source);
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
