import { createInstance } from "./createInstance";
import { removeInstance } from "./removeInstance";
import { updateInstance } from "./updateInstance";
import { replaceInstance } from "./replaceInstance";
import { updateComponentInstance } from "./updateComponentInstance";
import { updateTextInstance } from "./updateTextInstance";
import { OwnReactComponent } from "../OwnReactComponent";

export class UnexpectedError extends Error {}
export class WrongInputError extends Error {}
export class WrongDataError extends Error {}

/**
 * reconcile VDOM states
 * @param {HTMLElement} container
 * @param {Object} currentInstance
 * @param {Object} element
 * @returns {Object} nextInstance
 * @example
 * const prevInstance = rootInstance;
 * const nextInstance = reconcile(container, prevInstance, element);
 *
 * @see https://reactjs.org/docs/reconciliation.html
 * @see https://reactjs.org/docs/rendering-elements.html
 * @see https://reactjs.org/docs/rendering-elements.html#updating-the-rendered-element
 * @see https://reactjs.org/docs/rendering-elements.html#react-only-updates-whats-necessary
 *
 * @todo
 * - [ ] test
 */
export function reconcile({container, instance, element}) {
  if (instance === undefined || element === undefined) {
    console.error(
      new WrongInputError(
        "prev instance or curr element is undefined. This should not happen."
      )
    );
    return instance;
  }

  // choosing what to do with the instance

  // initialize instance
  if (instance === null) {
    return createInstance({container, element});
  }

  // clean up after removing
  if (element === null) {
    return removeInstance({container, instance});
  }

  if (
    !(instance.element && instance.element.type) ||
    !element.type
  ) {
    console.error(
      new WrongDataError(
        "prev or curr element type is undefined. This should not happen."
      )
    );
    return instance;
  }

  // replace instance in case of major changes
  if (instance.element.type !== element.type) {
    return replaceInstance({container, element});
  }

  if (element.type === "TEXT ELEMENT") {
    return updateTextInstance({instance, element});
  }

  // update instance in case if the element for the update is simple
  if (typeof element.type === "string") {
    return updateInstance({instance, element});
  }

  // update component instance
  if (
    instance.element.type === element.type &&
    Object.prototype.isPrototypeOf.call(OwnReactComponent, element.type)
  ) {
    if (
      instance.publicInstance.shouldComponentUpdate &&
      typeof instance.publicInstance.shouldComponentUpdate ===
        "function" &&
      !instance.publicInstance.shouldComponentUpdate()
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
