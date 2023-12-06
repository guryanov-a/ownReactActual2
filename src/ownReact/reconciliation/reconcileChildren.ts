import { Instance, DomInstance, DomElement } from "../types/types";
import { reconcile } from "./reconcile";

interface Params {
  instance: DomInstance;
  element: DomElement;
}
type ReconcileChildren = (params: Params) => Instance[];
export const reconcileChildren: ReconcileChildren = ({ instance, element }) => {
  const { dom, childInstances } = instance;
  const children = element?.props?.children ?? [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, children.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = children[i];
    const newChildInstance = reconcile({ container: dom, instance: childInstance, element: childElement });
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance !== null);
};
