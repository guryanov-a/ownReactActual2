import { updateDomProperties } from "./updateDomProperties";
import { createPublicInstance } from "./createPublicInstance";
import { ComponentElement, ComponentInstance, DomElement, DomInstance, Element, Instance, TextElement, TextInstance } from "../types/types";
import { isDomElement, isTextElement } from "../types/is";
import { withPerformanceUpdate, withPerformanceDomChange } from "../utils/withPerformance";

interface InstantiateClassComponentParams { element: ComponentElement }
type InstantiateClassComponent = ({ element }: InstantiateClassComponentParams) => ComponentInstance | null;
const instantiateClassComponent: InstantiateClassComponent = withPerformanceUpdate(({ element }) => {
  // create instance of a component
  const instance = {} as ComponentInstance;
  const publicInstance = createPublicInstance({ element, instance });
  const childElement = publicInstance.render() as unknown as Element;
  childElement.parentElement = element;

  if (childElement === null) {
    return null;
  }

  const childInstance = instantiate({ element: childElement });

  if (childInstance === null) {
    return null;
  }

  const { dom } = childInstance;

  Object.assign(instance, {
    dom,
    element,
    childInstance,
    publicInstance
  });

  return instance;
}, 'Component create');

type InstantiateDomElement = (params: { element: DomElement }) => DomInstance;
const instantiateDomElement: InstantiateDomElement = withPerformanceDomChange(({ element }) => {
  const { type, props = {} } = element;
  const domElement = document.createElement(type);
  const dom = updateDomProperties(domElement, [], props);

  const children = props.children ? props.children : [];
  const childrenArr = Array.isArray(children) ? children : [children];
  const childInstances = childrenArr
    .map((childElement) => {
      childElement.parentElement = element;
      return instantiate({ element: childElement });
    })
    .filter((childInstance): childInstance is Instance => childInstance !== null);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = {
    dom,
    element,
    childInstances
  };
  return instance;
});

type InstantiateTextElement = (params: { element: TextElement}) => TextInstance;
const instantiateTextElement: InstantiateTextElement = withPerformanceDomChange(({ element }) => {
  const { props } = element;
  const dom = document.createTextNode(props?.nodeValue);

  const instance = {
    dom,
    element,
  };
  return instance;
});

export type Instantiate = ({ element }: { element: Element }) => Instance | null;
export const instantiate: Instantiate = ({ element }) => {
  if (isTextElement(element)) {
    return instantiateTextElement({ element });
  } else if (isDomElement(element)) {
    return instantiateDomElement({element});
  } else { // isComponentElement(element)
    return instantiateClassComponent({ element });
  }
}
