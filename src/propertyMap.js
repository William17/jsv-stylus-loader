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
  zIndex: ["z-index"],
}

const propertyMap = Object.keys(jsvPropertyMap).reduce((result, property) => {
  const cssProperty = jsvPropertyMap[property][0]
  result[cssProperty] = property
  return result
}, {})

export function getProperty (cssProperty) {
  return propertyMap[cssProperty] || cssProperty
}