import { OwnReactComponent } from "../OwnReactComponent";
import { ComponentInstance, Instance } from "../types";
import { withPerformanceDomChange } from "../utils/withPerformance";

/**
 * Remove instance from parent instance
 * @param {Object} instance
 * @returns {null}
 * @example
 * const nextInstance = removeInstance(instance);
 *
 * @todo
 * - [ ] test
 *
 * @see https://reactjs.org/docs/reconciliation.html#recursing-on-children
 * @see https://reactjs.org/docs/react-component.html#componentwillunmount
 * @see https://reactjs.org/docs/react-component.html#render
 * @see https://reactjs.org/docs/react-component.html#componentdidupdate
 * @see https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
 * @see https://reactjs.org/docs/react-component.html#render
 * @see https://reactjs.org/docs/react-component.html#componentdidmount
 * @see https://reactjs.org/docs/react-component.html#constructor
 * @see https://reactjs.org/docs/reconciliation.html#keys
 * @see https://reactjs.org/docs/reconciliation.html#recursing-on-children
 */

const isComponentInstance = (instance: Instance): instance is ComponentInstance => {
  return Object.prototype.isPrototypeOf.call(OwnReactComponent, instance.element.type);
};

interface Params {
  container: HTMLElement;
  instance: Instance;
}
type RemoveInstance = (params: Params) => null;
const removeInstance: RemoveInstance = ({ container, instance }) => {
  if (isComponentInstance(instance) && instance.publicInstance.componentWillUnmount) {
    instance.publicInstance.componentWillUnmount();
  }

  container.removeChild(instance.dom);
  return null;
}

const removeInstanceHofed = withPerformanceDomChange(removeInstance);

export { removeInstanceHofed as removeInstance };
