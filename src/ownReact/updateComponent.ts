import { reconcile } from "./reconciliation/reconcile";
import { withPerformanceUpdate } from "./utils/withPerformance";

const updateComponent = ({ instance: internalInstance }) => {
  const parentDom = internalInstance.dom.parentNode;
  const { element } = internalInstance;
  return reconcile({container: parentDom, instance: internalInstance, element});
};

const updateComponentHofed = withPerformanceUpdate(
  updateComponent,
  `Component update`
);

export { updateComponentHofed as updateComponent };
