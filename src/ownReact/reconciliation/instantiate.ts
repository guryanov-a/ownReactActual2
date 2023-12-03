import { updateDomProperties } from "./updateDomProperties";
import createPublicInstance from "./createPublicInstance";
import { OwnReactComponent } from "../OwnReactComponent";

export class InvalidTypeError extends Error {}
export class InvalidInputError extends Error {}

const instantiateClassComponent = element => {
  // create instance of a component
  const instance = {};
  const publicInstance = createPublicInstance(element, instance);
  const childElement = publicInstance.render();
  const childInstance = instantiate(childElement);
  const { dom } = childInstance;

  Object.assign(instance, {
    dom,
    element,
    childInstance,
    publicInstance
  });

  return instance;
}

const instantiateDomElement = element => {
  const { type, props = {} } = element;
  const domElement = document.createElement(type);
  const dom = updateDomProperties(domElement, [], props);

  const children = props.children ? props.children : [];
  const childrenArr = Array.isArray(children) ? children : [children];
  const childInstances = childrenArr.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = {
    dom,
    element,
    childInstances
  };
  return instance;
}

const instantiateTextElement = element => {
  const { props = {} } = element;
  const dom = document.createTextNode(props.nodeValue);
  const instance = {
    dom,
    element,
    childInstances: []
  };
  return instance;
};

/**
 * Instantiate a component
 * @param {Function} type
 * @param {Object} props
 * @returns {Object} instance
 *
 * @see https://reactjs.org/docs/reconciliation.html#mounting-components
 * @see https://reactjs.org/docs/react-component.html#constructor
 * @see https://reactjs.org/docs/react-component.html#componentdidmount
 * @see https://reactjs.org/docs/react-component.html#render
 * @see https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
 * @see https://reactjs.org/docs/react-component.html#componentdidupdate
 * @see https://reactjs.org/docs/react-component.html#componentwillunmount
 * @see https://reactjs.org/docs/react-component.html#render
 */
export default function instantiate(element) {
  if (!element || !element.type) {
    console.error(new InvalidInputError(`Invalid input: ${element}`));
    return;
  }

  const { type } = element;
  const isDomElement = typeof type === "string";

  if (type === "TEXT ELEMENT") {
    return instantiateTextElement(element);
  }

  if (isDomElement) {
    return instantiateDomElement(element);
  }

  const isClassElement = Object.prototype.isPrototypeOf.call(
    OwnReactComponent,
    type
  );
  if (isClassElement) {
    return instantiateClassComponent(element);
  }

  console.error(new InvalidTypeError(`Invalid type: ${type}`));
}
