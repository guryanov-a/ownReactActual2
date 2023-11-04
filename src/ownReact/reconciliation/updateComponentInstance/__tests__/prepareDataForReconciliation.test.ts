import { OwnReactComponent } from "../../../OwnReactComponent";

interface DomElement {
    type: string;
    props: Record<string, any>;
}

interface ComponentElement {
    type: typeof OwnReactComponent;
    props: Record<string, any>;
}

type Element = DomElement | ComponentElement;

interface ComponentInstance {
    publicInstance: PublicInstance;
    childInstance: Instance;
    element: ComponentElement;
}

interface DomInstance {
    type: string;
    dom: HTMLElement;
    element: DomElement;
}

type Instance = ComponentInstance | DomInstance;

interface PublicInstance {
    props: Record<string, any>;
    render: () => {};
    __internalInstance: Instance;
}

describe("prepareDataForReconciliation", () => {
    test("updates instance publicInstance props with element props", async () => {
        const instance = {
            publicInstance: {
                props: {
                    initialProp: "initialValue",
                },
                render: () => {},
                __internalInstance: {}
            },
            childInstance: {},
            element: {
                type: class MockComponent {
                    render: () => {}
                }
                props: {
                    initialProp: "initialValue",
                },
            }
        };
        instance.publicInstance.__internalInstance = instance;
        const nextElement = {
            props: {
                updatedProp: "updatedValue",
            },
        };

        const { prepareDataForReconciliation } = await import("../prepareDataForReconciliation");
        prepareDataForReconciliation({ instance, element: nextElement });

        expect(instance.publicInstance.props).toEqual(nextElement.props);
    });

    test("returns an object with updated child element and old child instance", async () => {
        const container = document.createElement("div");
        const instance = {
        publicInstance: {
            props: {},
            render: () => {},
        },
        childInstance: {
            dom: {},
            element: {
            type: "div",
            props: {
                className: "initialValue",
            },
            },
            childInstances: [],
        },
        };
        const element = {
            props: {},
        };

        const { prepareDataForReconciliation } = await import("../prepareDataForReconciliation");
        const result = prepareDataForReconciliation({ container, instance, element });

        expect(result).toEqual({
            instance: instance.childInstance,
            element: instance.publicInstance.render(),
        });
    });
});