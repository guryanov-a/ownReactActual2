import { reconcile } from "../reconcile";
import { withPerformanceDomChange } from "../../utils/withPerformance";
import { applyNewComponentInstanceData } from "./applyNewComponentInstanceData";
import { prepareDataForReconciliation } from "./prepareDataForReconciliation";

interface DomElement {
  type: string;
  props: Record<string, any>;
}

interface ComponentElement {
  type: typeof OwnReactComponent;
  props: Record<string, any>;
}

type Element = DomElement | ComponentElement;

interface ComponentInstance {
  publicInstance: PublicInstance;
  childInstance: Instance;
  element: ComponentElement;
}

interface DomInstance {
  type: string;
  dom: HTMLElement;
  element: DomElement;
}

type Instance = ComponentInstance | DomInstance;

interface PublicInstance {
  props: Record<string, any>;
  render: () => {};
  __internalInstance: Instance;
}

const updateComponentInstance = (dataForUpdate) => {
  const dataForReconciliation = prepareDataForReconciliation(dataForUpdate);

  const { container } = dataForUpdate;
  const newChildInstance = reconcile({ container, ...dataForReconciliation });

  const { instance, element } = dataForUpdate;
  return applyNewComponentInstanceData({ instance, element, newChildInstance });
};

const updateComponentInstanceHofed = withPerformanceDomChange(
  updateComponentInstance
);

export { updateComponentInstanceHofed as updateComponentInstance };
