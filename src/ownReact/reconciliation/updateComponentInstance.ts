import { reconcile } from "./reconcile";
import { withPerformanceDomChange } from "../utils/withPerformance";

const updateComponentInstance = ({container, instance, element}) => {
  instance.publicInstance.props = element.props;
  const childElement = instance.publicInstance.render();
  const oldChildInstance = instance.childInstance;
  const childInstance = reconcile({container, instance: oldChildInstance, element: childElement});
  instance.dom = childInstance.dom;
  instance.childInstance = childInstance;
  instance.element = element;
  return instance;
};

const updateComponentInstanceHofed = withPerformanceDomChange(
  updateComponentInstance
);

export { updateComponentInstanceHofed as updateComponentInstance };
