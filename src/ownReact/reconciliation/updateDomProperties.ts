export function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = name => name.startsWith("on");
  const isAttribute = name => !isEvent(name) && name != "children";

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove DOM properties
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = null;
    });

  // Set DOM properties
  const domPropertiesToSet = Object.keys(nextProps).filter(isAttribute);

  for (let i = 0; i < domPropertiesToSet.length; i++) {
    const name = domPropertiesToSet[i];
    if (name === "style") {
      Object.keys(nextProps[name]).forEach(styleName => {
        dom.style[styleName] = nextProps[name][styleName];
      });
    } else {
      dom[name] = nextProps[name];
    }
  }

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  return dom;
}
