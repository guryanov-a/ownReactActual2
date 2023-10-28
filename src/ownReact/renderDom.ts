import { reconcile } from "./reconciliation/reconcile";
import { withPerformanceUpdate } from "./utils/withPerformance";

const renderDom = ({ element, container }) => {
  return reconcile({container, instance: null, element});
};

const renderDomHofed = withPerformanceUpdate(renderDom, "Initial render");

export { renderDomHofed as renderDom };
