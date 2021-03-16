import path from 'path';
import stylus from 'stylus';
import csstree from 'css-tree';

function runtime(classNameMap) {
  let code = `
    import { JsvStyleClass, JsvTextStyleClass } from "jsview-utils/JsViewReactTools/JsvStyleClass";
    function createStyleClass(styleObj) {
      return new JsvTextStyleClass(styleObj).getName() 
    }
  `;
  Object.keys(classNameMap).forEach(item => {
    const node = classNameMap[item];
    const className = item.replace('.', '').replace(':', '__');
    const styleObj = node.block.children.toArray().reduce((result, styleItem) => {
      result[styleItem.property] = csstree.generate(styleItem.value);
      return result;
    }, {});
    code += `
    export const ${className} = createStyleClass(${JSON.stringify(styleObj)})
    `;
  });
  return code;
}

async function stylusLoader(source) {
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
    const classNameMap = {};
    const focusSelectors = [];
    const selectorTypeMap = {
      'IdSelector': '#',
      'TypeSelector': '',
      'ClassSelector': '.',
      'PseudoClassSelector': ':'
    };
    csstree.walk(ast, function (node) {
      if (node.type === 'Rule') {
        node.prelude.children.forEach(item => {
          if (item.type === 'Selector') {
            const info = item.children.reduce((result, selector) => {
              result.fullName += `${selectorTypeMap[selector.type]}${selector.name}`;

              if (selector.type === 'PseudoClassSelector' && selector.name === 'focus') {
                result.focus = true;
              }

              return result;
            }, {
              fullName: '',
              focus: false
            });
            classNameMap[info.fullName] = node;

            if (info.focus) {
              focusSelectors.push(info.fullName);
            }
          }
        });
      }
    });
    focusSelectors.forEach(item => {
      const styleNode = classNameMap[item.replace(/:focus/, '')];
      const styleNodeOnFocus = classNameMap[item];

      if (styleNode) {
        const childrenData = [].concat(styleNode.block.children.toArray()).concat(styleNodeOnFocus.block.children.toArray());
        styleNodeOnFocus.block.children.fromArray(childrenData);
      }
    });
    callback(null, `${runtime(classNameMap)}`);
  });
}

export default stylusLoader;
