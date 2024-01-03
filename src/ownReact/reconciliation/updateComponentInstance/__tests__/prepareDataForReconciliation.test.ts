import { ComponentElement, ComponentInstance } from "../../../types/types";
import { prepareDataForReconciliation } from "../prepareDataForReconciliation";

describe("prepareDataForReconciliation", () => {
    test("updates instance publicInstance props with element props", () => {
        const instance = {
            publicInstance: {
                props: {
                    initialProp: "initialValue",
                },
                render: () => ({}),
                __internalInstance: {}
            },
            childInstance: {},
            element: {
                type: class MockComponent {
                    render = () => {};
                },
                props: {
                    initialProp: "initialValue",
                },
            }
        } as unknown as ComponentInstance;
        instance.publicInstance.__internalInstance = instance;
        const nextElement = {
            props: {
                updatedProp: "updatedValue",
            },
        } as unknown as ComponentElement;

        prepareDataForReconciliation({ instance, element: nextElement });

        expect(instance.publicInstance.props).toEqual(nextElement.props);
    });

    test("returns an object with updated child element and old child instance", () => {
        const instance = {
            publicInstance: {
                props: {},
                render: () => ({}),
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
        } as unknown as ComponentInstance;
        const element = {
            props: {},
        } as unknown as ComponentElement;

        const result = prepareDataForReconciliation({ instance, element });

        expect(result).toEqual({
            instance: instance.childInstance,
            element: { parentElement: element },
        });
    });
});