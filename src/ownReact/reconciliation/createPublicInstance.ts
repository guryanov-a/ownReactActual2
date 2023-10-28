/**
 * Create public instance of a component
 * @param {Object} element
 * @param {Object} internalInstance
 * @returns {Object} publicInstance
 *
 * @see https://reactjs.org/docs/reconciliation.html#mounting-components
 * @see https://reactjs.org/docs/react-component.html#constructor
 * @see https://reactjs.org/docs/react-component.html#componentdidmount
 * @see https://reactjs.org/docs/react-component.html#render
 */
export default function createPublicInstance(element, internalInstance) {
  const { type: ClassComponent, props } = element;
  const publicInstance = new ClassComponent(props);
  publicInstance.__internalInstance = internalInstance;
  return publicInstance;
}
