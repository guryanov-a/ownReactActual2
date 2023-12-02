import type { OwnReactComponent } from "./OwnReactComponent";

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
    type: OwnReactComponent;
    props: Record<string, any>;
}

export type Element = DomElement | ComponentElement | TextElement;

// instances
export interface ComponentInstance {
    publicInstance: PublicInstance;
    childInstance: Instance;
    element: ComponentElement;
    dom: HTMLElement;
}

export interface DomInstance {
    type: string;
    dom: HTMLElement;
    element: DomElement;
    childInstances: Instance[];
}

export type Instance = ComponentInstance | DomInstance;

// component instances
export interface PublicInstance {
    props?: Record<string, any>;
    render: () => Element;
    componentWillUnmount?: () => void;
    __internalInstance: Instance;
}

// props
export interface TextElementProps {
    nodeValue: string;
}
export interface DomElementProps {
    key?: string;
    [key: string]: any;
}
export interface ComponentProps {
    children?: Element[];
    key?: string;
    [key: string]: unknown;
}
export type ElementProps = TextElementProps | DomElementProps | ComponentProps;