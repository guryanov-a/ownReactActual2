import { Instance } from "../types/types";
import { withPerformanceDomChange } from "../utils/withPerformance";
import { isComponentInstance } from "../types/is";

interface Params {
  container: HTMLElement;
  instance: Instance;
}
type RemoveInstance = (params: Params) => null;
const removeInstance: RemoveInstance = ({ container, instance }) => {
  if (isComponentInstance(instance) && typeof instance.publicInstance.componentWillUnmount === "function") {
    instance.publicInstance.componentWillUnmount();
  }

  container.removeChild(instance.dom);
  return null;
}

const removeInstanceHofed = withPerformanceDomChange(removeInstance);

export { removeInstanceHofed as removeInstance };
