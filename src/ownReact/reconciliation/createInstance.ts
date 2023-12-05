import { instantiate } from "./instantiate";
import { withPerformanceDomChange } from "../utils/withPerformance";
import { Element, Instance } from "../types/types";
import { isComponentInstance } from "../types/is";

interface Params {
  container: HTMLElement;
  element: Element;
}
type CreateInstance = (params: Params) => Instance;
const createInstance: CreateInstance = ({ container, element }) => {
  const instance: Instance = instantiate(element);
  container.appendChild(instance.dom);

  if (isComponentInstance(instance)) {
    instance.publicInstance.componentDidMount &&
      instance.publicInstance.componentDidMount();
  }

  return instance;
}

const createInstanceHofed = withPerformanceDomChange(createInstance);

export { createInstanceHofed as createInstance };
