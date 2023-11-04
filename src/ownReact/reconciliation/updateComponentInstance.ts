import { reconcile } from "./reconcile";
import { withPerformanceDomChange } from "../utils/withPerformance";

export const prepareDataForReconciliation = ({ container, instance, element }) => {
  instance.publicInstance.props = element.props;
  const childElement = instance.publicInstance.render();
  const oldChildInstance = instance.childInstance;

  return { container, instance: oldChildInstance, element: childElement };
};

export const applyNewComponentInstanceData = ({ instance, element, newChildInstance }) => {
  instance.dom = newChildInstance.dom;
  instance.childInstance = newChildInstance;
  instance.element = element;
  return instance;
}

const updateComponentInstance = (dataForUpdate) => {
  const dataForReconciliation = prepareDataForReconciliation(dataForUpdate);
  const newChildInstance = reconcile(dataForReconciliation);

  const { instance, element } = dataForUpdate;
  return applyNewComponentInstanceData({ instance, element, newChildInstance });
};

const updateComponentInstanceHofed = withPerformanceDomChange(
  updateComponentInstance
);

export { updateComponentInstanceHofed as updateComponentInstance };
