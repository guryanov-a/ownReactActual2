import { reconcile } from "../reconcile";
import { withPerformanceDomChange } from "../../utils/withPerformance";
import { applyNewComponentInstanceData } from "./applyNewComponentInstanceData";
import { prepareDataForReconciliation } from "./prepareDataForReconciliation";

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
