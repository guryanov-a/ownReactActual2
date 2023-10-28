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
function removeInstance({container, instance}) {
  instance.publicInstance &&
    instance.publicInstance.componentWillUnmount &&
    typeof instance.publicInstance.componentWillUnmount === "function" &&
    instance.publicInstance.componentWillUnmount();

  container.removeChild(instance.dom);

  return null;
}

const removeInstanceHofed = withPerformanceDomChange(removeInstance);

export { removeInstanceHofed as removeInstance };
