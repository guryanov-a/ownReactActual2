import { reconcile } from "./reconcile";

export const reconcileChildren = (instance, element) => {
  const { dom, childInstances } = instance;
  const {
    props: { children = [] }
  } = element;
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
