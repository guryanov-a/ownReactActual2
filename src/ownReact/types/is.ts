import { OwnReactComponent } from "../OwnReactComponent";
import { ComponentElement, ComponentInstance, DomElement, Element, Instance, TextElement } from "./types";

export function isComponentInstance(instance: Instance | null): instance is ComponentInstance {
    return !!instance && isComponentElement(instance.element);
}

export function isComponentElement(element: Element): element is ComponentElement {
    return Object.prototype.isPrototypeOf.call(
        OwnReactComponent,
        element.type
    );
}

export function isDomElement(element: Element): element is DomElement {
    const { type } = element;
    return type !== "TEXT_ELEMENT" && typeof type === "string";
}

export function isTextElement(element: Element): element is TextElement {
    return element.type === "TEXT_ELEMENT";
}