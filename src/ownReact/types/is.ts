import { OwnReactComponent } from "../OwnReactComponent";
import { ComponentInstance, Instance } from "./types";

export const isComponentInstance = (instance: Instance): instance is ComponentInstance => {
    return Object.prototype.isPrototypeOf.call(OwnReactComponent, instance.element.type);
};