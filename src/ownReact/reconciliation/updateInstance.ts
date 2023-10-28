import { updateDomProperties } from "./updateDomProperties";
import { reconcileChildren } from "./reconcileChildren";
import { withPerformanceDomChange } from "../utils/withPerformance";

/**
 * Updates instance
 * @param {Object} instance
 * @param {Object} element
 * @returns {Object} instance
 * @example
 * const nextInstance = updateInstance(instance, element);
 */
function updateInstance({instance, element}) {
  updateDomProperties(instance.dom, instance.element.props, element.props);
  instance.childInstances = reconcileChildren(instance, element);
  instance.element = element;
  return instance;
}

const updateInstanceHofed = withPerformanceDomChange(updateInstance);

export { updateInstanceHofed as updateInstance };
