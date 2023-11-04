describe("prepareDataForReconciliation", () => {
    test("updates instance publicInstance props with element props", async () => {
        const container = document.createElement("div");
        const instance = {
        publicInstance: {
            props: {
            initialProp: "initialValue",
            },
            render: () => {},
        },
        childInstance: {},
        };
        const element = {
        props: {
            updatedProp: "updatedValue",
        },
        };

        const { prepareDataForReconciliation } = await import("../prepareDataForReconciliation");
        prepareDataForReconciliation({ container, instance, element });

        expect(instance.publicInstance.props).toEqual(element.props);
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
            container,
            instance: instance.childInstance,
            element: instance.publicInstance.render(),
        });
    });
});