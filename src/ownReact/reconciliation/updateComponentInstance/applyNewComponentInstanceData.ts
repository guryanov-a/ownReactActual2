import { ComponentInstance, Instance, ComponentElement } from "../../types/types";

interface Params {
    instance: ComponentInstance;
    element: ComponentElement;
    newChildInstance: Instance;
};

type ApplyNewComponentInstanceData = (params: Params) => ComponentInstance;
export const applyNewComponentInstanceData: ApplyNewComponentInstanceData = ({ instance, element, newChildInstance }) => {
    instance.dom = newChildInstance.dom;
    instance.childInstance = newChildInstance;
    instance.element = element;
    return instance;
}