import path from 'path';
import stylus from 'stylus';
import csstree from 'css-tree';

const jsvPropertyMap = {
  animation: ["animation", "-webkit-animation"],
  backgroundImage: ["background-image"],
  borderRadius: ["border-radius"],
  borderImage: ["border-image"],
  borderImageOutset: ["border-image-outset"],
  borderImageWidth: ["border-image-width"],
  backgroundColor: ["background-color"],
  backfaceVisibility: ["backface-visibility", "-webkit-backface-visibility"],
  clipPath: ["clip-path"],
  fontFamily: ["font-family"],
  fontSize: ["font-size"],
  fontStyle: ["font-style"],
  lineHeight: ["line-height"],
  objectFit: ["object-fit"],
  perspective: ["perspective", "-webkit-perspective"],
  perspectiveOrigin: ["perspective-origin", "-webkit-perspective-origin"],
  textAlign: ["text-align"],
  textOverflow: ["text-overflow"],
  transform: ["transform", "-webkit-transform"],
  transformOrigin: ["transform-origin", "-webkit-transform-origin"],
  transformStyle: ["transform-style", "-webkit-transform-style"],
  transition: ["transition", "-webkit-transition"],
  whiteSpace: ["white-space"],
  zIndex: ["z-index"]
};
const propertyMap = Object.keys(jsvPropertyMap).reduce((result, property) => {
  const cssProperty = jsvPropertyMap[property][0];
  result[cssProperty] = property;
  return result;
}, {});
function getProperty(cssProperty) {
  return propertyMap[cssProperty] || cssProperty;
}

function runtime(classNameMap) {
  let code = `
import { JsvTextStyleClass } from "jsview-utils/JsViewReactTools/JsvStyleClass";
function createStyleClass(styleObj) {
  return new JsvTextStyleClass(styleObj).getName() 
}`;
  Object.keys(classNameMap).forEach(item => {
    const node = classNameMap[item];
    const className = item.replace('.', '');
    const styleObj = node.block.children.toArray().reduce((result, styleItem) => {
      const property = getProperty(styleItem.property);
      result[property] = csstree.generate(styleItem.value);
      return result;
    }, {});
    code += `
export const ${className} = createStyleClass(${JSON.stringify(styleObj)})
`;
  });
  return code;
}

const nodes = stylus.nodes;
const originRGBAToString = nodes.RGBA.prototype.toString;

nodes.RGBA.prototype.toString = function () {
  // https://github.com/stylus/stylus/issues/1825
  // six digit color
  const val = originRGBAToString.call(this);

  if (/^#[A-Za-z0-9]{3}/.test(val)) {
    return '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
  }

  return val;
};

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
    const selectorTypeMap = {
      'IdSelector': '#',
      'TypeSelector': '',
      'ClassSelector': '.'
    };
    csstree.walk(ast, function (node) {
      if (node.type === 'Rule') {
        node.prelude.children.forEach(item => {
          if (item.type === 'Selector') {
            const fullName = item.children.reduce((result, selector) => {
              return result + `${selectorTypeMap[selector.type]}${selector.name}`;
            }, '');
            classNameMap[fullName] = node;
          }
        });
      }
    });
    callback(null, `${runtime(classNameMap)}`);
  });
}

export default stylusLoader;
