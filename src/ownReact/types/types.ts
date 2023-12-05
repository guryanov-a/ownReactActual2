import type { OwnReactExtendedClass, OwnReactComponent } from "../OwnReactComponent";

// elements
export interface TextElement {
    type: "TEXT_ELEMENT";
    props: {
        nodeValue: string;
    };
}

export interface DomElement {
    type: string;
    props: Record<string, any>;
}

export interface ComponentElement {
    type: OwnReactExtendedClass;
    props: Record<string, any>;
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
export interface DomElementProps {
    key?: string;
    [key: string]: any;
}
export interface ComponentProps extends ComponentInputProps {
    children?: Element[];
}
export interface ComponentInputProps {
    key?: string;
    [key: string]: unknown;
}

export type ElementProps = TextElementProps | DomElementProps | ComponentProps;