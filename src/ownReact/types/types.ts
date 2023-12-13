import type { OwnReactExtendedClass, OwnReactComponent } from "../OwnReactComponent";

// types
type TextElementType = "TEXT_ELEMENT";
type DomElementType = string;
type ComponentElementType = OwnReactExtendedClass;

// elements
interface BaseElement {
    __id: number;
}
export interface TextElement extends BaseElement {
    type: TextElementType;
    props: {
        nodeValue: string;
    };
}

export interface DomElement extends BaseElement {
    type: DomElementType;
    props: ParamsProps;
}

export interface ComponentElement extends BaseElement {
    type: ComponentElementType;
    props: ParamsProps;
}

export type Element = DomElement | ComponentElement | TextElement;

// instances
export interface ComponentInstance {
    publicInstance: OwnReactComponent;
    childInstance: Instance;
    element: ComponentElement;
    dom: HTMLElement;
}

export interface DomInstance {
    dom: HTMLElement;
    element: DomElement;
    childInstances: Instance[];
}

export interface TextInstance {
    dom: Text;
    element: TextElement;
}

export type Instance = ComponentInstance | DomInstance | TextInstance;

// props
export interface TextElementProps {
    nodeValue: string;
}
export interface ArgsProps {
    key?: string;
    [key: string]: unknown;
}
export interface ParamsProps extends ArgsProps {
    children?: Element[];
}
export type ElementProps = TextElementProps | ParamsProps;