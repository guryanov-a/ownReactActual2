import { createInstance } from "./createInstance";
import { removeInstance } from "./removeInstance";
import { updateDomInstance } from "./updateInstance";
import { replaceInstance } from "./replaceInstance";
import { updateComponentInstance } from "./updateComponentInstance/updateComponentInstance";
import { updateTextInstance } from "./updateTextInstance";
import { ComponentElement, ComponentInstance, DomElement, DomInstance, Element, Instance, TextElement, TextInstance } from "../types/types";
import { isComponentElement, isComponentInstance, isDomElement, isDomInstance, isTextElement, isTextInstance } from "../types/is";

export class UnexpectedError extends Error {}

export interface ParamsToInitialize {
  container: HTMLElement;
  instance: null;
  element: Element;
}

export interface ParamsToRemove {
  container: HTMLElement;
  instance: Instance;
  element: null;
}

export interface ParamsToUpdateText {
  container: HTMLElement;
  instance: TextInstance;
  element: TextElement;
}

export interface ParamsToUpdateDom {
  container: HTMLElement;
  instance: DomInstance;
  element: DomElement;
}

export interface ParamsToUpdateComponent {
  container: HTMLElement;
  instance: ComponentInstance;
  element: ComponentElement;
}

// choosing what to do with the instance
type Reconcile = {
  (params: ParamsToInitialize): Instance;
  (params: ParamsToRemove): null;
  (params: ParamsToUpdateText): TextInstance;
  (params: ParamsToUpdateDom): DomInstance;
  (params: ParamsToUpdateComponent): ComponentInstance;
}
export const reconcile: Reconcile = ({ container, instance, element }) => {
  // clean up after removing
  if (element === null) {
    return removeInstance({ container, instance });
  }

  // initialize instance
  if (instance === null) {
    return createInstance({ container, element });
  }

  // replace instance in case of major changes
  if (instance.element.type !== element.type) {
    return replaceInstance({ container, element });
  }

  if (isTextElement(element) && isTextInstance(instance)) {
    return updateTextInstance({ instance, element });
  }

  // update instance in case if the element for the update is simple
  if (isDomInstance(instance) && isDomElement(element)) {
    return updateDomInstance({ instance, element });
  }

  // update component instance
  if (isComponentInstance(instance) && isComponentElement(element)) {
    if (!instance.publicInstance.shouldComponentUpdate()) {
      return instance;
    }

    return updateComponentInstance({ container, instance, element });
  }

  // default
  console.error(
    new UnexpectedError(
      "No condition for reconciliation is met. This should not happen."
    )
  );
  return instance;
}
