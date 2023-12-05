import type { OwnReactComponent } from "../OwnReactComponent";
import type { ComponentElement, ComponentInstance } from "../types/types";

type Params = {
  element: ComponentElement;
  instance: ComponentInstance;
}
type CreatePublicInstance = (params: Params) => OwnReactComponent;
export const createPublicInstance: CreatePublicInstance = ({ element, instance }) => {
  const { type: ClassComponent, props } = element;

  const publicInstance = new ClassComponent(props);
  publicInstance.__internalInstance = instance;

  return publicInstance;
}
