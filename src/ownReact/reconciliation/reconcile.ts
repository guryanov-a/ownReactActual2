import { createInstance } from "./createInstance";
import { removeInstance } from "./removeInstance";
import { updateDomInstance } from "./updateInstance";
import { replaceInstance } from "./replaceInstance";
import { updateComponentInstance } from "./updateComponentInstance/updateComponentInstance";
import { updateTextInstance } from "./updateTextInstance";
import { Element, Instance } from "../types/types";
import { isComponentInstance } from "../types/is";

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

export interface ParamsToUpdate {
  container: HTMLElement;
  instance: Instance;
  element: Element;
}

// choosing what to do with the instance
export type Params = ParamsToInitialize | ParamsToUpdate | ParamsToRemove;
export type Reconcile = <T extends Params>(params: T) => Instance;
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
    return replaceInstance({container, element});
  }

  if (element.type === "TEXT_ELEMENT") {
    return updateTextInstance({instance, element});
  }

  // update instance in case if the element for the update is simple
  if (typeof element.type === "string") {
    return updateDomInstance({ instance, element });
  }

  // update component instance
  if (
    instance.element.type === element.type &&
    isComponentInstance(instance)
  ) {
    if (
      typeof instance.publicInstance?.shouldComponentUpdate === "function" 
      && !instance.publicInstance.shouldComponentUpdate()
    ) {
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
