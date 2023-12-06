import { updateDomProperties } from "./updateDomProperties";
import { createPublicInstance } from "./createPublicInstance";
import { ComponentElement, ComponentInstance, DomElement, DomInstance, Element, Instance, TextElement, TextInstance } from "../types/types";
import { isDomElement, isTextElement } from "../types/is";

type InstantiateClassComponent = (element: ComponentElement) => ComponentInstance | null;
const instantiateClassComponent: InstantiateClassComponent = (element) => {
  // create instance of a component
  const instance = {} as ComponentInstance;
  const publicInstance = createPublicInstance({ element, instance });
  const childElement = publicInstance.render();

  if (childElement === null) {
    return null;
  }

  const childInstance = instantiate(childElement);

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
}

type InstantiateDomElement = (element: DomElement) => DomInstance;
const instantiateDomElement: InstantiateDomElement = (element) => {
  const { type, props = {} } = element;
  const domElement = document.createElement(type);
  const dom = updateDomProperties(domElement, [], props);

  const children = props.children ? props.children : [];
  const childrenArr = Array.isArray(children) ? children : [children];
  const childInstances = childrenArr
    .map(instantiate)
    .filter((childInstance): childInstance is Instance => childInstance !== null);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = {
    dom,
    element,
    childInstances
  };
  return instance;
}

type InstantiateTextElement = (element: TextElement) => TextInstance;
const instantiateTextElement: InstantiateTextElement = (element) => {
  const { props } = element;
  const dom = document.createTextNode(props?.nodeValue);

  const instance = {
    dom,
    element,
  };
  return instance;
};

export type Instantiate = (element: Element) => Instance | null;
export const instantiate: Instantiate = (element) => {
  if (isTextElement(element)) {
    return instantiateTextElement(element);
  } else if (isDomElement(element)) {
    return instantiateDomElement(element);
  } else { // isComponentElement(element)
    return instantiateClassComponent(element);
  }
}
