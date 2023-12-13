import { reconcile } from "./reconciliation/reconcile";
import { ComponentInstance } from "./types/types";
import { withPerformanceUpdate } from "./utils/withPerformance";

interface Params {
  instance: ComponentInstance;
}
type UpdateComponent = (params: Params) => ComponentInstance;
const updateComponent: UpdateComponent = ({ instance: internalInstance }) => {
  const parentDom = internalInstance.dom.parentNode  as HTMLElement;
  const { element } = internalInstance;
  return reconcile({ container: parentDom, instance: internalInstance, element });
};

const updateComponentHofed = withPerformanceUpdate(
  updateComponent,
  `Component update`
);

export { updateComponentHofed as updateComponent };
