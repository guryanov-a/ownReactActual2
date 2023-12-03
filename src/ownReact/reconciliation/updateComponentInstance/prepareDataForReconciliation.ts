import { ComponentInstance, Element, Instance, ComponentElement } from "../../types/types";

interface Params {
    instance: ComponentInstance;
    element: ComponentElement;
}

interface Result {
    instance: Instance;
    element: Element;
}
type PrepareDataForReconciliation = (params: Params) => Result;
export const prepareDataForReconciliation: PrepareDataForReconciliation = ({ instance, element }) => {
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;

    return { instance: oldChildInstance, element: childElement };
};