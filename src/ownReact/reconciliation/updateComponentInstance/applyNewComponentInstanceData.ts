export const applyNewComponentInstanceData = ({ instance, element, newChildInstance }) => {
    instance.dom = newChildInstance.dom;
    instance.childInstance = newChildInstance;
    instance.element = element;
    return instance;
}